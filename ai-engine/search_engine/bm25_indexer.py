import json
import re
import pickle
from rank_bm25 import BM25Okapi
from typing import List, Dict, Any

class BM25SearchEngine:
    def __init__(self):
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

    def index_documents(self, documents: List[Dict[str, Any]]):
        """
        Takes cleaned JSON documents, tokenizes their content, and builds the BM25 index.
        """
        print(f"Indexing {len(documents)} documents for BM25...")
        self.documents = documents

        tokenized_corpus = []
        for doc in documents:
            text = doc.get("content", "")
            words= self._tokenize(text)
            tokenized_corpus.append(words)

        self.bm25 = BM25Okapi(tokenized_corpus)
        print(" BM25 Index successfully built!")

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


    def save_index(self, filepath:str):
        """Saves the built BM25 index and document mapping to disk."""

        with open(filepath, "wb") as f:
            pickle.dump({"bm25": self.bm25, "documents": self.documents},f)
            print(f" BM25 index saved to {filepath}")

    def load_index(self, filepath: str):
        """Loads a pre-built BM25 index from disk."""
        with open(filepath, "rb") as f:
            data = pickle.load(f)
            self.bm25 = data["bm25"]
            self.documents = data["documents"]
        print(f" BM25 index loaded from {filepath}")

# Quick 
if __name__ == "__main__":
    # Sample data mimicking your clean JSON posts
    sample_posts = [
        {"id": "1", "title": "Python List Error", "content": "Python list object has no attribute get error in code"},
        {"id": "2", "title": "Dictionary Methods", "content": "How to use dictionary get method in Python"},
        {"id": "3", "title": "Java Lists", "content": "ArrayList performance in Java programming"}
    ]

    # Initialize and run BM25
    engine = BM25SearchEngine()
    engine.index_documents(sample_posts)

    # Perform a search for exact error keywords
    query = "list no attribute get"
    results = engine.search(query, top_k=2)

    print(f"\nSearch Query: '{query}'")
    for res in results:
        print(f"- [Score: {res['bm25_score']:.2f}] Post ID {res['id']}: {res['title']}")
    