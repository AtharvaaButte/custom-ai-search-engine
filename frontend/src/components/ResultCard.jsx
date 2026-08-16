import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu, Hash, Layers } from 'lucide-react';
import { getMatchType } from '../utils/scoreHelpers';

export default function ResultCard({ result }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { title, snippet, scores } = result;
  
  const matchType = getMatchType(scores.bm25, scores.vector);

  const isLongContent = snippet.length > 150;

  return (
    <article className="bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl p-5 transition-all shadow-md flex flex-col gap-3 group">
      {/* Header & Title */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-indigo-300 group-hover:text-indigo-200 transition-colors cursor-pointer">
          {title}
        </h3>
        
        {/* Match Source Indicator Pill */}
        <span
          className={`shrink-0 text-xs px-2.5 py-0.5 rounded-full border ${matchType.variant}`}
        >
          {matchType.label}
        </span>
      </div>

      {/* Snippet Body with Expand/Collapse */}
      <div className="text-sm text-zinc-300 leading-relaxed font-sans">
        <p className={!isExpanded && isLongContent ? 'line-clamp-2' : ''}>
          {snippet}
        </p>
        
        {isLongContent && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            <span>{isExpanded ? 'Show Less' : 'Show Full Content'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Granular Score Footer Badges */}
      <footer className="pt-3 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-3 flex-wrap">
          {/* BM25 Score Tag */}
          <span className="inline-flex items-center gap-1 text-zinc-400 bg-zinc-950/80 border border-zinc-800 px-2 py-1 rounded">
            <Hash className="w-3 h-3 text-amber-400" />
            <span>BM25: <strong className="text-zinc-200">{scores.bm25.toFixed(2)}</strong></span>
          </span>

          {/* Vector Similarity Score Tag */}
          <span className="inline-flex items-center gap-1 text-zinc-400 bg-zinc-950/80 border border-zinc-800 px-2 py-1 rounded">
            <Cpu className="w-3 h-3 text-purple-400" />
            <span>Vector: <strong className="text-zinc-200">{scores.vector.toFixed(2)}</strong></span>
          </span>

          {/* RRF Blended Score Tag */}
          <span className="inline-flex items-center gap-1 text-zinc-400 bg-zinc-950/80 border border-zinc-800 px-2 py-1 rounded">
            <Layers className="w-3 h-3 text-emerald-400" />
            <span>RRF: <strong className="text-zinc-200">{scores.rrf.toFixed(4)}</strong></span>
          </span>
        </div>
      </footer>
    </article>
  );
}