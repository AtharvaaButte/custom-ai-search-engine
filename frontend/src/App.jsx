import React, { useState } from 'react';
import { Search, Cpu, Gauge, RefreshCw } from 'lucide-react';
import { mockSearchResults } from './data/mockData';
import ResultCard from './components/ResultCard';
import AISummaryCard from './components/AISummaryCard';
import SkeletonLoader from './components/SkeletonLoader';

export default function App() {
  const [query, setQuery] = useState(mockSearchResults.metrics.query);
  const [data, setData] = useState(mockSearchResults);
  const [isLoading, setIsLoading] = useState(false);

  // Simulated search reload trigger to preview loading states
  const handleSimulatedSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Centered Hero Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-6">
        
        {/* Header Title */}
        <header className="text-center mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-3">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Hybrid Neural + Sparse Search Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Technical Search Core
          </h1>
        </header>

        {/* Top Search Input Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSimulatedSearch(); }}
          className="relative group"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-indigo-400 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation, code, postmortems... (Press '/' to focus)"
            className="w-full pl-11 pr-24 py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-lg text-sm sm:text-base"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleSimulatedSearch}
              title="Test Skeleton Loading State"
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono text-zinc-400 bg-zinc-800 border border-zinc-700 rounded">
              /
            </kbd>
          </div>
        </form>

        {/* Latency & Execution Metrics Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-2.5 bg-zinc-900/60 border border-zinc-800/80 rounded-lg text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Gauge className="w-3.5 h-3.5" />
              <span>Latency: <strong>{isLoading ? '...' : `${data.metrics.latency_ms}ms`}</strong></span>
            </span>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-300">
              Algorithm: <strong className="text-indigo-300">{data.metrics.algorithm}</strong>
            </span>
          </div>
          <div>
            Hits: <span className="text-zinc-200">{isLoading ? '...' : `${data.metrics.total_hits} documents`}</span>
          </div>
        </div>

        {/* Dynamic Section: Skeleton Loaders vs Real Feed */}
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <>
            {/* AI Summary Spotlight Card */}
            <AISummaryCard summary={data.summary} />

            {/* Document Results Feed */}
            <section className="flex flex-col gap-4 mt-2">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 px-1">
                Matched Documents ({data.results.length})
              </h2>

              {data.results.map((result) => (
                <ResultCard key={result.id} result={result} />
              ))}
            </section>
          </>
        )}

      </main>
    </div>
  );
}