import os
from pathlib import Path
from typing import List, Dict, Any
from groq import Groq
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class RAGSummarizer :
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.client = Groq(api_key=self.api_key) if self.api_key else None

    def generate_summary(self, query: str, context_docs: List[Dict[str, Any]]) -> str:
        if not self.client:
            return "AI Summarization unavailable: GROQ_API_KEY is missing."

        # Format top retrieved documents as context
        context_text = ""
        for idx, doc in enumerate(context_docs[:5], start=1):
            title = doc.get("title","")
            content =  doc.get("content", "")
            body = content.partition("\n\n")[2] or content
            context_text += f"[{idx}] Title: {title}\nContent: {body}\n\n"

        # System and User prompts
        system_prompt = (
            "You are an expert software developer assistant for a Stack Overflow search engine. "
            "Synthesize a clear, direct solution to the user's issue using ONLY the provided context documents. "
            "Include code snippets where relevant and cite reference sources using brackets like [1], [2]."
        )

        user_prompt = f"User Question: {query}\n\nTop Search Results:\n{context_text}"

        # Call Groq API
        try:
            response = self.client.chat.completions.create (
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.2,
                max_tokens=800
            )
            return response.choices[0].message.content

        except Exception as e:
            return f"Error generating summary: {str(e)}"