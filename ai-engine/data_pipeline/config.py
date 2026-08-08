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
    STACK_API_KEY: str = "rl_5B23ANz35KDkt99X1NhQcbKXF"  

    # Pipeline query controls
    SEED_TAGS: list[str] = field(default_factory=lambda: [
        # Languages
        "python", "javascript", "typescript", "rust", "go", "cpp",
        
        # Web & Frameworks
        "reactjs", "node.js", "fastapi", "django", "next.js", "express",
        
        # Data & AI / Vector Search
        "vector-database", "machine-learning", "embeddings", "postgresql", "redis", "mongodb",
        
        # DevOps & Cloud Infrastructure
        "docker", "kubernetes", "aws", "linux", "git",
        
        # Core Architecture & Engineering
        "asyncio", "multithreading", "concurrency", "rest", "graphql"
    ])

    MIN_TAG_COUNT: int = 1000
    PAGESIZE: int = 100
    MAX_QUESTIONS_PER_TAG: int = 100

    def __post_init__(self):
        self.BASE_DIR.mkdir(parents=True, exist_ok=True)
