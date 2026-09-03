import os
from contextlib import asynccontextmanager
from typing import Dict, List, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from retrieval.bm25_retriever import BM25Retriever
from retrieval.vector_retriever import VectorRetriever
from retrieval.rrf_fusion import RRFHybridRetriever

from services.rag_service import RAGSummarizer

hybrid_engine: Optional[RRFHybridRetriever] = None
rag_summarizer: Optional[RAGSummarizer] = None

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX_DIR = os.path.join(BASE_DIR, "data", "indexes")
BM25_CACHE = os.path.join(INDEX_DIR, "bm25.pkl")
VECTOR_CACHE = os.path.join(INDEX_DIR, "vector.pkl")

@asynccontextmanager
async def lifespan(app: FastAPI):
    global hybrid_engine, rag_summarizer
    print("Booting Search Engine & Loading Indexes into RAM...")

    if not os.path.exists(BM25_CACHE) or not os.path.exists(VECTOR_CACHE):
        print("Index files missing! Automatically building search indexes...")
        try:
            from scripts.build_indexes import build_all_indexes
            build_all_indexes()
        except Exception as err:
            print(f"Warning: Could not build indexes automatically: {err}")

    # Load pre-built indexes
    bm25 = BM25Retriever(index_path=BM25_CACHE)
    bm25.load_index()

    vector = VectorRetriever(index_path=VECTOR_CACHE)
    vector.load_index()

    # Initialize RRF Hybrid Retriever
    hybrid_engine = RRFHybridRetriever(
        bm25_retriever=bm25, 
        vector_retriever=vector, 
        k=60
    )
    rag_summarizer = RAGSummarizer()
    print("Search Engine & RAG Pipeline Loaded!")
    yield

    print(" Shutting down Search Engine...")

# App Initialization
app = FastAPI(
    title="StackOverflow Hybrid Search Engine",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas (Request / Response Contracts)

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, example="docker exit code 137 memory leak")
    top_k: int = Field(default=10, ge=1, le=50)
    enable_rag: bool = Field(default=False)

class SearchResultDocument(BaseModel):
    id: str
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    rrf_score: float
    bm25_score: Optional[float] = 0.0
    vector_score: Optional[float] = 0.0

class SearchResponse(BaseModel):
    query: str
    count: int
    summary: Optional[str] = None   
    results: List[SearchResultDocument]


# REST Endpoints

@app.get("/health")
def health_check():
    if hybrid_engine is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, 
            detail="Search engine initializing"
        )
    return {"status": "ok", "message": "Search Engine Active"}
    
@app.post("/search", response_model=SearchResponse)
def search_posts(payload: SearchRequest):
    if hybrid_engine is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Search engine is not loaded"
        )

    results = hybrid_engine.search(query=payload.query, top_k=payload.top_k)

    # GENERATE AI SUMMARY IF ENABLE_RAG IS TRUE
    ai_summary = None
    if payload.enable_rag and rag_summarizer:
        ai_summary = rag_summarizer.generate_summary(payload.query, results)

    return SearchResponse(
        query=payload.query,
        count=len(results),
        summary=ai_summary,
        results=results
    )

