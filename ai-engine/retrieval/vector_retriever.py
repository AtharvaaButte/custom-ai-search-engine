import os
import pickle
import numpy as np
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer

class VectorRetriever:
    def __init__(self, index_path="ai-engine/data/indexes/vector.pkl", model_name: str = "all-MiniLM-L6-v2"):
        """
        Initializes the Vector Search Engine with a SentenceTransformer model.
        all-MiniLM-L6-v2 produces 384-dimensional dense vectors.
        """
        print(f"Loading transformer model: {model_name}...")
        self.index_path = index_path
        self.model = SentenceTransformer(model_name)
        self.embeddings : np.ndarray = None
        self.documents: List[Dict[str, Any]] = []

    def build_and_save(self, documents: List[Dict[str, Any]]):
        """Generates dense vector embeddings and saves them to disk."""
        print("Generating Vector Embeddings...")

        self.documents = documents  

        # Prepare text strings for embedding
        corpus = []
        for doc in documents:
            content = doc.get("content", "")
            corpus.append(content)

        raw_embeddings = self.model.encode(
            corpus, 
            show_progress_bar=True, 
            convert_to_numpy=True
        )

         # L2 Normalization 
        norms = np.linalg.norm(raw_embeddings, axis=1, keepdims=True)

        norms[norms == 0] = 1e-10
        self.embeddings = raw_embeddings/ norms 

        print(f"Vector index built with shape: {self.embeddings.shape}")

        # Save to disk using pickle
        os.makedirs(os.path.dirname(self.index_path), exist_ok=True)
        with open(self.index_path, "wb") as f:
            pickle.dump({"embeddings": self.embeddings, "documents": self.documents}, f)
        print(f"Vector embeddings saved successfully to {self.index_path}")

    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Encodes the query and finds top_k documents using Cosine Similarity (Dot Product of normalized vectors).
        """
        if self.embeddings is None:
            raise ValueError("Vector index has not been built yet. Call index_documents first.")

        # Encode query and L2-normalize
        query_embedding = self.model.encode([query], convert_to_numpy=True)[0]
        query_norm =np.linalg.norm(query_embedding)

        if query_norm> 0:
            query_embedding = query_embedding/query_norm

        scores = np.dot (self.embeddings, query_embedding)
        top_indices = np.argsort(scores)[::-1][:top_k]


        results = []
        for idx in top_indices:
            score = float(scores[idx])
            doc_copy = self.documents[idx].copy()
            doc_copy["vector_score"] = score
            results.append(doc_copy)

        return results

    def load_index(self):
        """Loads cached vector embeddings from pickle file."""
        if not os.path.exists(self.index_path):
            raise FileNotFoundError(f"No vector cache found at {self.index_path}. Build it first!")

        print(f"Loading cached Vector embeddings from {self.index_path}...")
        with open(self.index_path, "rb") as f:
            data = pickle.load(f)
            self.embeddings = data["embeddings"]
            self.documents = data["documents"]

