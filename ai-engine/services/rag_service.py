import os
import re
from pathlib import Path
from typing import List, Dict, Any
from groq import Groq
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)


def clean_llm_output(text: str) -> str:
    """Strips <think> tags. Fallbacks gracefully if content is trapped inside <think> tags."""
    if not text:
        return ""

    # 1. Try removing complete <think>...</think> blocks
    cleaned = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL).strip()
    if cleaned:
        return cleaned

    # 2. Fallback: If stripping <think> tags emptied the output, remove the opening/closing tags only
    cleaned_fallback = re.sub(r'</?think>', '', text, flags=re.IGNORECASE).strip()
    return cleaned_fallback


# Backward-compatibility alias
clean_think_tags = clean_llm_output


class RAGSummarizer:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.client = Groq(api_key=self.api_key) if self.api_key else None
        self.model_name = os.getenv("GROQ_MODEL", "qwen/qwen3.6-27b")

    def generate_summary(self, query: str, context_docs: List[Dict[str, Any]]) -> str:
        if not self.client:
            return "AI Summary unavailable: GROQ_API_KEY is missing."

        # Filter documents based on relevance score thresholds before passing to LLM context
        relevant_docs = [
            doc for doc in context_docs
            if doc.get("rrf_score", 0.0) > 0.0 or doc.get("bm25_score", 0.0) >= 0.01 or doc.get("vector_score", 0.0) >= 0.2
        ]

        if not relevant_docs:
            return "No sufficiently relevant search results found to generate an AI summary."

        context_text = ""
        for idx, doc in enumerate(relevant_docs[:3], start=1):
            title = doc.get("title", "Untitled")
            raw_content = doc.get("content") or doc.get("body", "")
            body = raw_content.partition("\n\n")[2] or raw_content
            context_text += f"[{idx}] Title: {title}\nContent: {body[:800]}\n\n"

        system_prompt = (
            "You are an AI search assistant. "
            "CRITICAL REQUIREMENT: Do NOT output <think> tags, chain-of-thought reasoning, or meta-introductions. "
            "Output ONLY the final 2-3 sentence answer and 2 concise bullet points directly in raw markdown. "
            "Keep total length strictly under 100 words. Cite sources like [1], [2]."
        )

        try:
            # Pass parameters to suppress reasoning format/tokens in Groq API
            try:
                response = self.client.chat.completions.create(
                    model=self.model_name,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": f"Query: {query}\n\nContext:\n{context_text}"}
                    ],
                    temperature=0.1,
                    max_tokens=250,
                    extra_body={"reasoning_format": "hidden", "reasoning_effort": "none"},
                    stream=False
                )
            except Exception:
                # Fallback to standard request if extra_body options are not supported
                response = self.client.chat.completions.create(
                    model=self.model_name,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": f"Query: {query}\n\nContext:\n{context_text}"}
                    ],
                    temperature=0.1,
                    max_tokens=250,
                    stream=False
                )

            raw_output = response.choices[0].message.content or ""
            return clean_llm_output(raw_output)

        except Exception as e:
            return f"Failed to generate summary: {str(e)}"
