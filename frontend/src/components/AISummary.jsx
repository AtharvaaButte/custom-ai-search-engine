import { Sparkles } from 'lucide-react';
import { renderStreamMarkdown } from '../utils/markdown';

export default function AISummary({ summary, content }) {
  // Accepts either 'summary' or 'content' prop
  const text = summary || content;

  if (!text) return null;

  return (
    <aside className="w-full lg:w-96 shrink-0 space-y-3">
      <div className="p-5 rounded-2xl bg-zinc-900/90 border border-indigo-500/30 shadow-xl space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold uppercase text-zinc-200">
              AI Contextual Summary
            </span>
          </div>
        </div>

        <div className="min-h-[120px] text-sm text-zinc-300 leading-relaxed">
          {renderStreamMarkdown(text)}
        </div>
      </div>
    </aside>
  );
}

// Backward-compatibility export alias
export { AISummary };