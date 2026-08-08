import os
import json
import sys
import time

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from retrieval.bm25_retriever import BM25Retriever 
from retrieval.vector_retriever import VectorRetriever

DATA_PATH =  os.path.join(BASE_DIR,"data", "processed_posts.json")
INDEX_DIR = os.path.join(BASE_DIR, "data" , "indexes")
BM25_CACHE = os.path.join(INDEX_DIR, "bm25.pkl")
VECTOR_CACHE = os.path.join(INDEX_DIR, "vector.pkl")

def build_all_indexes():
    os.makedirs(INDEX_DIR, exist_ok=True)

    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Raw dataset not found at {DATA_PATH}. Place your StackOverflow JSON dataset there.")

    print("Loading raw dataset...")
    start_time = time.time()
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        docs = json.load(f)
    print(f"Loaded {len(docs)} documents in {time.time() - start_time:.2f}s")

    # Build & Save BM25 Index
    print("Building BM25 Index...")
    bm25 = BM25Retriever(index_path=BM25_CACHE)
    bm25.build_and_save(docs)

    # Build & Save Vector Index
    print("Building Vector Index (generating embeddings)...")
    vector = VectorRetriever(index_path=VECTOR_CACHE)
    vector.build_and_save(docs)

    print("All indexes successfully built and cached to disk!")

if __name__ == "__main__":
    build_all_indexes()