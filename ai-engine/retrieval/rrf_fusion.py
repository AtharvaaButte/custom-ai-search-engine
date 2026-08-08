from typing import List,Dict, Any

class RRFHybridRetriever:
    def __init__(self,bm25_retriever, vector_retriever, k: int = 60):
        """
        :param bm25_retriever: Your initialized BM25 search module
        :param vector_retriever: Your initialized Vector/Embedding search module
        :param k: RRF smoothing constant
        """
        self.bm25_retriever = bm25_retriever
        self.vector_retriever = vector_retriever
        self.k = k

    def search(self, query: str, top_k: int = 10, candidate_k: int = 50) -> List[Dict[str, Any]]:
        
        bm25_results = self.bm25_retriever.search(query, top_k=candidate_k)
        vector_results = self.vector_retriever.search(query, top_k=candidate_k)

        rrf_scores: Dict[str, float] = {}
        doc_store: Dict[str, Dict[str, Any]] = {}

        # Process BM25 ranks
        for rank, doc in enumerate(bm25_results, start=1):
            doc_id = str(doc["doc_id"])
            doc_store[doc_id] = doc
            rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (1.0 / (self.k + rank))

        # Process Vector ranks
        for rank, doc in enumerate(vector_results, start=1):
            doc_id = str(doc["doc_id"])
            if doc_id not in doc_store:
                doc_store[doc_id] = doc
            rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (1.0 / (self.k + rank))

        # Sort documents by accumulated RRF score descending
        sorted_doc_ids = sorted(rrf_scores.keys(), key=lambda doc_id: rrf_scores[doc_id], reverse=True)

        final_results = []
        for doc_id in sorted_doc_ids[:top_k]:
            item = doc_store[doc_id].copy()
            item["rrf_score"] = round(rrf_scores[doc_id], 5)
            final_results.append(item)

        return final_results
