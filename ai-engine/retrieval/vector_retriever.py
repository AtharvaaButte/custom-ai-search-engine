import os
import pickle
import numpy as np
import httpx
from typing import List, Dict, Any

class VectorRetriever:
    def __init__(self, index_path="ai-engine/data/indexes/vector.pkl", model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.index_path = index_path
        self.model_name = model_name
        self.embeddings: np.ndarray = None
        self.documents: List[Dict[str, Any]] = []
        
        # Read API token from environment variables
        self.api_key = (
            os.getenv("HF_TOKEN") or 
            os.getenv("HUGGINGFACE_API_KEY") or 
            os.getenv("EMBEDDING_API_KEY")
        )
        
        default_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{model_name}"
        self.api_url = os.getenv("EMBEDDING_API_URL", default_url)

    def _get_embedding_remote(self, text: str) -> np.ndarray:
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        payload = {"inputs": text, "options": {"wait_for_model": True}}

        try:
            with httpx.Client(timeout=15.0) as client:
                response = client.post(self.api_url, json=payload, headers=headers)
                
                if response.status_code != 200:
                    error_msg = f"Embedding API call failed with status {response.status_code}: {response.text}"
                    print(f"Error: {error_msg}")
                    raise RuntimeError(error_msg)
                
                res_json = response.json()
                
                if isinstance(res_json, list):
                    if len(res_json) == 0:
                        raise ValueError("Embedding API returned an empty list.")
                    # Handle 2D list output (e.g. [[...]]) or token embeddings
                    if isinstance(res_json[0], list):
                        if len(res_json) == 1:
                            arr = np.array(res_json[0], dtype=np.float32)
                        else:
                            arr = np.mean(res_json, axis=0, dtype=np.float32)
                    else:
                        arr = np.array(res_json, dtype=np.float32)
                    
                    return arr
                
                raise ValueError(f"Unexpected response format from Embedding API: {res_json}")

        except Exception as e:
            print(f"Embedding Fetch Error for text: {str(e)}")
            raise RuntimeError(f"Failed to fetch remote vector embedding: {str(e)}")

    def build_and_save(self, documents: List[Dict[str, Any]]):
        print("Generating Remote Vector Embeddings via HTTP API...")
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
            doc_copy["vector_score"] = round(score, 5)
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
