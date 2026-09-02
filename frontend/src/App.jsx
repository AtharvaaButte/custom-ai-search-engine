import { SearchHeader } from './components/SearchHeader';
import { MetricsBar } from './components/MetricsBar';
import { ResultCard } from './components/ResultCard';
import { AISummary } from './components/AISummary';
import { SkeletonLoader } from './components/SkeletonLoader';
import { LandingState } from './components/LandingState';
import { useSearch } from './hooks/useSearch';
import { AlertCircle, SearchX } from 'lucide-react';

export default function App() {
  const {
    query,
    setQuery,
    resultsData,
    aiSummary,
    isSearching,
    error,
    latency,
    dataSource,
    searchInputRef,
    executeSearch,
    handleSelectQuery,
  } = useSearch();

  // Safely resolve the documents array
  const items = Array.isArray(resultsData?.results)
    ? resultsData.results
    : Array.isArray(resultsData)
    ? resultsData
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased relative selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Radial Background Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">
        <SearchHeader
          inputRef={searchInputRef}
          isSearching={isSearching}
          onSearch={executeSearch}
          query={query}
          setQuery={setQuery}
        />

        {!resultsData && !isSearching && !error && (
          <LandingState onSelectQuery={handleSelectQuery} />
        )}

        {error && (
          <div className="max-w-3xl mx-auto w-full p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {resultsData && (
          <MetricsBar
            latency={latency}
            source={dataSource}
            count={resultsData.count ?? items.length}
          />
        )}

        {isSearching ? (
          <SkeletonLoader />
        ) : (
          resultsData && (
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Matched Documents List */}
              <section className="flex-1 w-full space-y-4">
                <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 px-1">
                  Matched Documents ({items.length})
                </h2>

                {items.length > 0 ? (
                  items.map((result, index) => (
                    <ResultCard key={result.id || index} result={result} />
                  ))
                ) : (
                  <div className="py-12 text-center bg-slate-900/40 border border-slate-800/60 rounded-xl flex flex-col items-center gap-3 text-slate-400">
                    <SearchX className="w-8 h-8 text-slate-500" />
                    <p className="text-sm font-medium">No matches found for "{query}"</p>
                  </div>
                )}
              </section>

              {/* AI Summary Section */}
              <AISummary content={aiSummary} isStreaming={isSearching} />
            </div>
          )
        )}
      </main>
    </div>
  );
}