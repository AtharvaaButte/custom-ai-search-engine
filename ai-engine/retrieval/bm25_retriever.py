import re
import os
import pickle
from rank_bm25 import BM25Okapi
from typing import List, Dict, Any

class BM25Retriever:
    def __init__(self, index_path="ai-engine/data/indexes/bm25.pkl"):
        self.index_path = index_path
        self.bm25 = None
        self.documents: List[Dict[str, Any]]

    def _tokenize(self, text: str) -> List[str]:
        """
        Converts text to lowercase and splits it into individual words/tokens.
        Retains underscores and hyphens which are common in programming (e.g. 'set_up').
        """
        text = text.lower()
        tokens = re.findall(r'\b\w+\b', text)
        return tokens

    def build_and_save(self, documents: List[Dict[str, Any]]):
        """Tokenizes documents, builds BM25 index, and pickles it to disk."""
        print("Building BM25 Index...")
        self.documents = documents

        # Simple whitespace/lowercase tokenization
        tokenized_corpus = []
        for doc in documents:
            text = doc.get("content", "")
            words= self._tokenize(text)
            tokenized_corpus.append(words)


        self.bm25 = BM25Okapi(tokenized_corpus)
        print(" BM25 Index successfully built!")

        # Save to disk using pickle
        os.makedirs(os.path.dirname(self.index_path), exist_ok=True)
        with open(self.index_path, "wb") as f:
            pickle.dump({"bm25": self.bm25, "documents": self.documents}, f)
        print(f"BM25 index saved successfully to {self.index_path}")


    def search(self, query: str, top_k: int = 5)-> List[Dict[str,Any]]:
        """
        Searches the BM25 index for a user query and returns the top_k matching posts.
        """

        if not self.bm25:
            raise ValueError("BM25 index has not been built yet. Call index_documents first.")

        # Tokenize the user's search query
        tokenized_query = self._tokenize(query)

        # Calculate BM25 relevance scores for all documents
        doc_scores = self.bm25.get_scores(tokenized_query)

        # Rank document indices from highest score to lowest score
        indexed_scores = []
        for index in range(len(doc_scores)):
            score = doc_scores[index]
            indexed_scores.append((index, score))

        def get_score(item):
            return item[1]

        indexed_scores.sort(key=get_score, reverse=True)

        top_indices = [] 
        for index , score in indexed_scores[:top_k]:
            top_indices.append(index)

        results = []

        for idx in top_indices:
            doc_copy = self.documents[idx].copy()
            doc_copy["bm25_score"] = float(score)
            results.append(doc_copy)

        return results

    def load_index(self):
        """Loads pre-built BM25 index from pickle file."""
        if not os.path.exists(self.index_path):
            raise FileNotFoundError(f"No index found at {self.index_path}. Build it first!")
            
        print(f"Loading cached BM25 index from {self.index_path}...")
        with open(self.index_path, "rb") as f:
            data = pickle.load(f)
            self.bm25 = data["bm25"]
            self.documents = data["documents"]

