import os
import sys
import uvicorn

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

if __name__ == "__main__":
    print("Starting FastAPI Hybrid Search Engine Server...")
    uvicorn.run(
        "api.app:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )