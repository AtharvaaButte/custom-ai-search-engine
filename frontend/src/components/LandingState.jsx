import { Sparkles, ArrowUpRight } from 'lucide-react';
import ArchitectureSection from './ArchitectureSection';

const SUGGESTED_QUERIES = [
  "docker exit code 137 memory leak",
  "ModuleNotFoundError: No module named",
  "TypeError: Cannot read properties of undefined",
  "Redis cache invalidation strategies in Python"
];

export function LandingState({ onSelectQuery }) {
  return (
    <div className="max-w-5xl mx-auto w-full space-y-10 mt-2">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase tracking-wider font-semibold">
          <Sparkles className="w-4 h-4 text-cyan-400"/>
          <span>Popular Queries</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SUGGESTED_QUERIES.map((item) => (
            <button
              key={item}
              onClick={() => onSelectQuery(item)}
              className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-indigo-500/50 text-left text-sm text-zinc-300 hover:text-white transition-all group cursor-pointer shadow-sm"
            >
              <span className="truncate pr-3 font-mono text-xs">{item}</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 shrink-0 transition-colors"/>
            </button>
          ))}
        </div>
      </div>

      <ArchitectureSection/>
    </div>
  );
}

export default LandingState;