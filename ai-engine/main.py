import os
import sys
import uvicorn

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from api.app import app

if __name__ == "__main__":
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))

    print(f"Starting FastAPI Hybrid Search Engine Server on {HOST}:{PORT}...")
    uvicorn.run(
        "api.app:app",
        host=HOST,
        port=PORT,
        reload=False
    )