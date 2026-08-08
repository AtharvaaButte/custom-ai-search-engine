import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from retrieval.bm25_retriever import BM25Retriever
from retrieval.vector_retriever import VectorRetriever
from retrieval.rrf_fusion import RRFHybridRetriever

INDEX_DIR = os.path.join(BASE_DIR, "data", "indexes")
BM25_CACHE = os.path.join(INDEX_DIR, "bm25.pkl")
VECTOR_CACHE = os.path.join(INDEX_DIR, "vector.pkl")

def cli_test():
    print("Loading indexes for CLI test...")
    bm25 = BM25Retriever(index_path=BM25_CACHE)
    bm25.load_index()

    vector = VectorRetriever(index_path=VECTOR_CACHE)
    vector.load_index()

    hybrid = RRFHybridRetriever(bm25_retriever=bm25, vector_retriever=vector, k=60)

    query = "docker exit code 137"
    results = hybrid.search(query=query, top_k=5)

    print(f"\nResults for '{query}':")
    for res in results:
        print(f"- [{res['rrf_score']:.4f}] {res.get('title', 'No Title')}")

if __name__ == "__main__":
    cli_test()