import { Search, Zap, Cpu } from 'lucide-react';

export function SearchHeader({ query, setQuery, onSearch, isSearching, inputRef }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isSearching) {
      onSearch(query);
    }
  };

  return (
    <div className="space-y-6">
      <header className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-xs font-mono text-indigo-300 shadow-sm">
          <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Hybrid BM25 + Vector Engine v2.0</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-indigo-200 to-cyan-300 tracking-tight">
          Neural Technical Search
        </h1>
      </header>

      <div className="max-w-3xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="relative flex items-center shadow-2xl rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 focus-within:border-indigo-500/80 focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all duration-200">
          <Search className="w-5 h-5 ml-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search docs or error logs... (Press Enter to Search)"
            className="w-full px-4 py-4 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-base font-medium"
          />
          <button
            type="submit"
            disabled={!query.trim() || isSearching}
            className="mr-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-40 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            {isSearching ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

export default SearchHeader;