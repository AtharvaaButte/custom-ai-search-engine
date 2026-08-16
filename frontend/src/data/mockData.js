export const mockSearchResults = {
  summary: "Python memory leaks usually stem from uncollected references in global variables, circular references involving __del__ methods, or unclosed resource handles like open database connections and file streams. Utilizing tracemalloc and objgraph helps locate uncollected objects rapidly.",
  metrics: {
    latency_ms: 14,
    algorithm: "RRF Hybrid",
    total_hits: 5,
    query: "Python memory leaks"
  },
  results: [
    {
      id: "post_1",
      title: "Fixing Memory Leaks in Python Scripts",
      snippet: "When dealing with large datasets, force garbage collection using gc.collect() and inspect leaking references with tracemalloc. Avoid holding long-lived references in class-level attributes or global dictionary caches without proper eviction policies.",
      scores: {
        bm25: 14.82,
        vector: 0.89,
        rrf: 0.032
      }
    },
    {
      id: "post_2",
      title: "Understanding PyTorch GPU Memory Management",
      snippet: "PyTorch uses a caching allocator to speed up memory allocations. Free unneeded tensors with torch.cuda.empty_cache() to release unused cached GPU memory back to the system allocator.",
      scores: {
        bm25: 4.10,
        vector: 0.94,
        rrf: 0.028
      }
    },
    {
      id: "post_3",
      title: "Optimizing PostgreSQL Connection Pools",
      snippet: "Unclosed database connections cause severe connection pool leaks in backend services. Always use connection pool contexts and set max_overflow limits correctly in SQLAlchemy or asyncpg.",
      scores: {
        bm25: 12.05,
        vector: 0.31,
        rrf: 0.019
      }
    }
  ]
};