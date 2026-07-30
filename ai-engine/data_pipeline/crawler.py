import time
import requests
from typing import List, Dict, Any
from .config import PipelineConfig

class StackOverflowCrawler:
    def __init__(self, config: PipelineConfig):
        self.config = config

    def fetch_questions_by_tag(self, tag:str) -> List[Dict[str, Any]]:
        """Fetches top-voted questions and answers for a specific tag."""
        url = f"{self.config.BASE_API_URL}/questions"

        params = {
            "site": self.config.SITE,
            "order": "desc",
            "sort": "votes",           # Priority on highest quality/voted questions
            "tagged": tag,
            "pagesize": self.config.MAX_QUESTIONS_PER_TAG,
            "filter": "withbody"       # Ensures the response body text is included
        }

        try:
            response = requests.get(url,params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            return data.get("items", [])

        except requests.RequestException:
            print(f"[Error] Failed to fetch questions for tag '{tag}': {e}")
            return []

    def crawl_all_tags(self, tags:List[str])-> List[Dict[str,Any]]:
        """Iterates through discovered tags and collects raw question payloads."""
        all_posts: List[Dict[str, Any]] = []
        seen_ids = set()


        for tag in tags:
            print(f"[Crawler] Fetching posts for tag: '{tag}'...")
            posts = self.fetch_questions_by_tag(tag)

            for post in posts:
                q_id = post.get("question_id")
                if q_id and q_id not in seen_ids:
                    seen_ids.add(q_id)
                    all_posts.append(post)

            time.sleep(0.5)

        return all_posts
