import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';

export default function AISummaryCard({ summary }) {
  const [copied, setCopied] = useState(false);

  if (!summary) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-gradient-to-br from-indigo-950/40 via-zinc-900 to-zinc-900 border border-indigo-500/25 rounded-xl p-5 shadow-xl relative overflow-hidden group">
      {/* Background Accent Glow */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Utilities Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            AI Direct Answer
          </span>
          <span className="text-xs font-mono text-zinc-500">
            {summary.length} chars
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-md bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 transition-colors cursor-pointer"
          title="Copy Summary"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Summary Content Body */}
      <p className="text-sm text-zinc-200 leading-relaxed font-sans relative z-10">
        {summary}
      </p>
    </section>
  );
}