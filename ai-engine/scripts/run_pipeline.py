import json
import sys
from pathlib import Path

AI_ENGINE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(AI_ENGINE_DIR))

from data_pipeline import (
    PipelineConfig,
    TagDiscovery,
    StackOverflowCrawler,
    DataTransformer
)


def test_pipeline():
    print(" --- STAGE 1: CONFIG INITIALIZATION ---")
    config = PipelineConfig()
    print(f"Data directory created at: {config.DATA_DIR}")

    print("\n --- STAGE 2: TESTING TAG DISCOVERY ---")
    discovery = TagDiscovery(config)
    tags = discovery.get_seed_matrix()
    print(f"Discovered Tags ({len(tags)} total): {tags}")

    with open(config.TAGS_FILE,"w", encoding="utf-8") as f:
        json.dump(tags,f,indent=2)

    print("\n --- STAGE 3: CRAWLING STACK OVERFLOW ---")
    crawler = StackOverflowCrawler(config)

    sample_tags = tags[:5]  
    raw_posts = crawler.crawl_all_tags(sample_tags)
    print(f"✓ Fetched {len(raw_posts)} unique questions.")

    with open(config.RAW_POSTS_FILE, "w", encoding="utf-8") as f:
        json.dump(raw_posts, f, indent=2)

    print("\n🧹 --- STAGE 4: DATA TRANSFORMATION ---")
    transformer = DataTransformer()
    processed_posts = transformer.process_batch(raw_posts)
    print(f"✓ Transformed {len(processed_posts)} documents.")

    with open(config.PROCESSED_POSTS_FILE, "w", encoding="utf-8") as f:
        json.dump(processed_posts, f, indent=2)

    print("\nPipeline complete! Clean documents saved to:", config.PROCESSED_POSTS_FILE)

if __name__ == "__main__":
    test_pipeline()