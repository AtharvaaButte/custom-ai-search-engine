import os
import pickle
import numpy as np
import httpx
from typing import List, Dict, Any

class VectorRetriever:
    def __init__(self, index_path="ai-engine/data/indexes/vector.pkl", model_name: str = "all-MiniLM-L6-v2"):
        self.index_path = index_path
        self.model_name = model_name
        self.embeddings: np.ndarray = None
        self.documents: List[Dict[str, Any]] = []
        self.api_key = os.getenv("EMBEDDING_API_KEY") or os.getenv("HF_TOKEN")
        self.api_url = os.getenv(
            "EMBEDDING_API_URL", 
            f"https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/{model_name}"
        )

    def _get_embedding_remote(self, text: str) -> np.ndarray:
        headers = {}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        try:
            with httpx.Client(timeout=10.0) as client:
                response = client.post(
                    self.api_url,
                    json={"inputs": text, "options": {"wait_for_model": True}},
                    headers=headers
                )
                if response.status_code == 200:
                    res_json = response.json()
                    if isinstance(res_json, list):
                        if isinstance(res_json[0], list):
                            arr = np.mean(res_json, axis=0)
                            return np.array(arr, dtype=np.float32)
                        return np.array(res_json, dtype=np.float32)
        except Exception as e:
            print(f"Warning: HTTP embedding request failed ({e}). Using deterministic feature encoding.")
        
        return self._get_fallback_embedding(text)

    def _get_fallback_embedding(self, text: str) -> np.ndarray:
        vec = np.zeros(384, dtype=np.float32)
        words = text.lower().split()
        if not words:
            return vec
        for word in words:
            idx = abs(hash(word)) % 384
            vec[idx] += 1.0
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec

    def build_and_save(self, documents: List[Dict[str, Any]]):
        print("Generating Vector Embeddings (Lightweight)...")
        self.documents = documents
        corpus = [doc.get("content", "") for doc in documents]
        
        raw_embeddings = []
        for text in corpus:
            emb = self._get_embedding_remote(text)
            raw_embeddings.append(emb)
        
        raw_embeddings = np.array(raw_embeddings, dtype=np.float32)
        norms = np.linalg.norm(raw_embeddings, axis=1, keepdims=True)
        norms[norms == 0] = 1e-10
        self.embeddings = raw_embeddings / norms

        print(f"Vector index built with shape: {self.embeddings.shape}")
        os.makedirs(os.path.dirname(self.index_path), exist_ok=True)
        with open(self.index_path, "wb") as f:
            pickle.dump({"embeddings": self.embeddings, "documents": self.documents}, f)
        print(f"Vector embeddings saved successfully to {self.index_path}")

    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        if self.embeddings is None:
            raise ValueError("Vector index has not been built yet.")

        query_embedding = self._get_embedding_remote(query)
        query_norm = np.linalg.norm(query_embedding)
        if query_norm > 0:
            query_embedding = query_embedding / query_norm

        scores = np.dot(self.embeddings, query_embedding)
        top_indices = np.argsort(scores)[::-1][:top_k]

        results = []
        for idx in top_indices:
            score = float(scores[idx])
            doc_copy = self.documents[idx].copy()
            doc_copy["vector_score"] = score
            results.append(doc_copy)

        return results

    def load_index(self):
        if not os.path.exists(self.index_path):
            raise FileNotFoundError(f"No vector cache found at {self.index_path}. Build it first!")

        print(f"Loading cached Vector embeddings from {self.index_path}...")
        with open(self.index_path, "rb") as f:
            data = pickle.load(f)
            self.embeddings = data["embeddings"]
            self.documents = data["documents"]
