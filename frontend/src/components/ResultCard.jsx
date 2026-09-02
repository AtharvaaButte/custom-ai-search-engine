import { useState } from 'react';
import { ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { cleanText } from '../utils/textUtils.js';

export function ResultCard({ result }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { title, content, rrf_score, bm25_score, vector_score, tags = [] } = result;

  const cleanTitle = cleanText(title);
  const cleanContent = cleanText(content, title);

  const isLongContent = content && content.length > 180;

  return (
    <article className="bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 rounded-xl p-5 transition-all duration-200 flex flex-col gap-3 group">
      {/* Header & Title */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-indigo-300 group-hover:text-indigo-200 transition-colors cursor-pointer leading-snug">
          {cleanTitle}
        </h3>
      </div>

      {/* Content Body */}
      <div className="text-sm text-slate-300 leading-relaxed font-sans">
        <p className={!isExpanded && isLongContent ? 'line-clamp-3' : ''}>
          {cleanContent}
        </p>

        {isLongContent && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'Show Less' : 'Show Full Content'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Score Badges Container */}
      <div className="flex flex-wrap items-center gap-2 mt-2 pt-3 border-t border-slate-800/80 text-xs font-mono">
        {/* BM25 Score */}
        {bm25_score !== undefined && (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            BM25: {Number(bm25_score).toFixed(2)}
          </span>
        )}

        {/* Vector/FAISS Score */}
        {vector_score !== undefined && (
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Vector: {Number(vector_score).toFixed(2)}
          </span>
        )}

        {/* RRF Score */}
        {rrf_score !== undefined && (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
            RRF: {Number(rrf_score).toFixed(4)}
          </span>
        )}
      </div>

      {/* Tags Footer */}
      {tags.length > 0 && (
        <footer className="flex items-center gap-2 flex-wrap pt-1">
          <Tag className="w-3 h-3 text-slate-500 shrink-0" />
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-950/80 text-slate-400 border border-slate-800/80"
            >
              #{tag}
            </span>
          ))}
        </footer>
      )}
    </article>
  );
}

export default ResultCard;