import json
import sys
from pathlib import Path
import time

AI_ENGINE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(AI_ENGINE_DIR))

from data_pipeline import (
    PipelineConfig,
    TagDiscovery,
    StackOverflowCrawler,
    DataTransformer
)


def test_pipeline():
    start_time = time.time()
    print(" --- STAGE 1: CONFIG INITIALIZATION ---")
    config = PipelineConfig()
    print(f"Data directory: {config.DATA_DIR}")

    print("\n --- STAGE 2: TESTING TAG DISCOVERY ---")
    discovery = TagDiscovery(config)
    tags = discovery.get_seed_matrix()
    print(f"Extracted {len(tags)} tag nodes from graph.")

    with open(config.TAGS_FILE,"w", encoding="utf-8") as f:
        json.dump(tags,f,indent=2)

    print("\n --- STAGE 3: CRAWLING (NovaFetch Crawler) ---")
    crawler = StackOverflowCrawler(config)

    raw_posts = crawler.crawl_all_tags(tags)
    print(f"Ingestion complete. Downloaded {len(raw_posts)} questions.")

    with open(config.RAW_POSTS_FILE, "w", encoding="utf-8") as f:
        json.dump(raw_posts, f, indent=2)

    print("\n --- STAGE 4: DATA TRANSFORMATION ---")
    transformer = DataTransformer()
    processed_posts = transformer.process_batch(raw_posts)
    print(f"Cleaned and transformed {len(processed_posts)} documents.")

    with open(config.PROCESSED_POSTS_FILE, "w", encoding="utf-8") as f:
        json.dump(processed_posts, f, indent=2)

    elapsed = round(time.time() - start_time, 2)

    print("\n" + "=" * 45)
    print("        PIPELINE EXECUTION SUMMARY       ")
    print("=" * 45)
    print(f" Discovered Tags   : {len(tags)}")
    print(f" Crawled Questions : {len(raw_posts)}")
    print(f" Processed Docs    : {len(processed_posts)}")
    print(f" Engine Used       : NovaFetch Crawler")
    print(f" Total Execution   : {elapsed}s")
    print("=" * 45)

if __name__ == "__main__":
    test_pipeline()