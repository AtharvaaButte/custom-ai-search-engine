import os
import json
from retrieval.bm25_retriever import BM25Retriever
from retrieval.vector_retriever import VectorRetriever
from retrieval.rrf_fusion import RRFHybridRetriever

# Paths
DATA_PATH = "data/processed_posts.json"
INDEX_DIR = "data/indexes"
BM25_CACHE = os.path.join(INDEX_DIR, "bm25.pkl")
VECTOR_CACHE = os.path.join(INDEX_DIR, "vector.pkl")

def main():
    os.makedirs(INDEX_DIR, exist_ok=True)

    # Instantiate Retrievers
    bm25_engine = BM25Retriever(index_path=BM25_CACHE)
    vector_engine = VectorRetriever(index_path=VECTOR_CACHE)

    # Load raw documents if building indexes is required
    docs = None
    if not os.path.exists(BM25_CACHE) or not os.path.exists(VECTOR_CACHE):
        print("Loading dataset from raw file...")
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            docs = json.load(f)

    # Load or Build BM25 Index
    if os.path.exists(BM25_CACHE):
        bm25_engine.load_index()
    else:
        bm25_engine.build_and_save(docs)

    # Load or Build Vector Index
    if os.path.exists(VECTOR_CACHE):
        vector_engine.load_index()
    else:
        vector_engine.build_and_save(docs)

    # Initialize RRF Hybrid Retriever
    hybrid_search = RRFHybridRetriever(
        bm25_retriever=bm25_engine,
        vector_retriever=vector_engine,
        k=60
    )