import os
from contextlib import asynccontextmanager
from typing import Dict, List, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from retrieval.bm25_retriever import BM25Retriever
from retrieval.vector_retriever import VectorRetriever
from retrieval.rrf_fusion import RRFHybridRetriever

hybrid_engine: Optional[RRFHybridRetriever] = None

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX_DIR = os.path.join(BASE_DIR, "data", "indexes")
BM25_CACHE = os.path.join(INDEX_DIR, "bm25.pkl")
VECTOR_CACHE = os.path.join(INDEX_DIR, "vector.pkl")

@asynccontextmanager
async def lifespan(app: FastAPI):
    global hybrid_engine
    print("Booting Search Engine & Loading Indexes into RAM...")

    if not os.path.exists(BM25_CACHE) or not os.path.exists(VECTOR_CACHE):
        raise RuntimeError(
            "Index files missing! Run 'python scripts/build_indexes.py' first."
    )

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
    print("Search Engine loaded and ready for HTTP traffic!")

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

class SearchResultDocument(BaseModel):
    doc_id: str
    title: Optional[str] = None
    body: Optional[str] = None
    tags: Optional[List[str]] = None
    rrf_score: float

class SearchResponse(BaseModel):
    query: str
    count: int
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

    return SearchResponse(
        query=payload.query,
        count=len(results),
        results=results
    )
    

