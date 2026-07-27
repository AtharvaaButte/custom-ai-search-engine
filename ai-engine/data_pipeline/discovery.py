import time
import requests
from typing import List, Dict, Any
from.config import PipelineConfig

class TagDiscovery:
    def __init__(self, config: PipelineConfig):
        self.config = config
    
    def fetch_related_tags(self, inname_query: str = "") -> List[Dict[str, Any]]:
        url = f"{self.config.BASE_API_URL}/tags"

        params = {
            "site": self.config.SITE,
            "order": "desc",
            "sort": "popular",
            "pagesize": self.config.PAGESIZE,
            "inname": inname_query
        }

        try:
            response = requests.get(url,params=params,timeout=10)
            response.raise_for_status()
            data = response.json()

            return[
                tag for tag in data.get("items",[])
                if tag.get("count", 0) >= self.config.MIN_TAG_COUNT
            ]
        
        except requests.RequestException as e:
            print(f"[Error] Failed to fetch tags for query '{inname_query}': {e}")
            return []
        
    def get_seed_matrix(self) -> List[str]:
        discovered_tags = set(self.config.SEED_TAGS)
        
        for seed in self.config.SEED_TAGS:
            print(f"[Discovery] Expanding tag domain for: '{seed}'...")
            related = self.fetch_related_tags(inname_query=seed)
            for item in related:
                discovered_tags.add(item["name"])
            time.sleep(0.5)   

        return list(discovered_tags)