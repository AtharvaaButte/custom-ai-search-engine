import html
import re

from typing import List, Dict, Any

class DataTransformer:
    @staticmethod
    def clean_html(raw_html: str)-> str:
        """Removes HTML markup tags and cleans white spaces."""
        if not raw_html:
            return ""
        decoded_text = html.unescape(raw_html)
        clean_txt = re.sub(r'<[^>]+>', ' ', raw_html)

        return " ".join(clean_txt.split())

    def transform_post(self, raw_post: Dict[str, Any]) -> Dict[str, Any]:
        """Transforms raw API payload into clean document structure for indexing."""
        title = raw_post.get("title", "")
        raw_body = raw_post.get("body", "")
        clean_body = self.clean_html(raw_body)

        content = f"{title}\n\n{clean_body}"

        return {
            "id": str(raw_post.get("question_id")),
            "title": title,
            "url": raw_post.get("link"),
            "score": raw_post.get("score", 0),
            "tags": raw_post.get("tags", []),
            "content": content
        } 

    def process_batch(self, raw_posts: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Processes a list of raw posts and returns transformed documents."""
        return [self.transform_post(post) for post in raw_posts]