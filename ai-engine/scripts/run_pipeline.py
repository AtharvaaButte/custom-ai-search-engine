import json
import sys
from pathlib import Path

# Ensure the root of ai-engine is in Python's search path
sys.path.append(str(Path(__file__).resolve().parent.parent))

from data_pipeline.discovery import TagDiscovery
from data_pipeline.config import PipelineConfig

def test_pipeline():
    print(" --- STAGE 1: CONFIG INITIALIZATION ---")
    config = PipelineConfig()
    print(f"Data directory created at: {config.DATA_DIR}")

    print("\n --- STAGE 2: TESTING TAG DISCOVERY ---")
    discovery = TagDiscovery(config)
    tags = discovery.get_seed_matrix()
    print(f"Discovered Tags ({len(tags)} total): {tags}")

if __name__ == "__main__":
    test_pipeline()