from pathlib import Path
from dataclasses import dataclass, field

@dataclass
class PipelineConfig:
    # Base paths relative to ai-engine root
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    DATA_DIR: Path = BASE_DIR / "data"

    # Storage file paths
    TAGS_FILE: Path = DATA_DIR / "discovered_tags.json"
    RAW_POSTS_FILE: Path = DATA_DIR / "raw_posts.json"
    PROCESSED_POSTS_FILE: Path = DATA_DIR / "processed_posts.json"

    # Stack Exchange API settings
    BASE_API_URL: str = "https://api.stackexchange.com/2.3"
    SITE: str = "stackoverflow"

    # Pipeline query controls
    SEED_TAGS: list[str] = field(default_factory=lambda: ["python", "reactjs", "node.js", "vector-database"])
    MIN_TAG_COUNT: int = 1000
    PAGESIZE: int = 50
    MAX_QUESTIONS_PER_TAG: int = 50

    def __post_init__(self):
        self.BASE_DIR.mkdir(parents=True, exist_ok=True)
