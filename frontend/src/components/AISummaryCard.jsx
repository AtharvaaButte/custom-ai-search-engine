import { Sparkles, Copy, Check } from 'lucide-react';
import { useState } from 'react';

function cleanThinkTags(text) {
  if (!text) return '';
  const cleaned = text.replace(/<think>[\s\S]*?(?:<\/think>|$)/g, '').trim();
  if (cleaned) return cleaned;
  return text.replace(/<\/?think>/gi, '').trim();
}

export default function AISummaryCard({ summary, content, isStreaming = false }) {
  const [copied, setCopied] = useState(false);

  const rawText = summary || content || '';
  const cleanText = cleanThinkTags(rawText);

  if (!cleanText && !isStreaming) return null;

  const handleCopy = () => {
    if (!cleanText) return;
    navigator.clipboard.writeText(cleanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderFormattedSummary = (text) => {
    if (!text) return null;
    const lines = text.split('\n');

    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-2" />;
      }

      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-semibold text-indigo-300 text-sm mt-3 mb-1">
            {trimmed.replace('### ', '')}
          </h4>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={idx} className="font-bold text-indigo-200 text-base mt-3 mb-1">
            {trimmed.replace('## ', '')}
          </h3>
        );
      }

      // Bullet points
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
        const bulletText = trimmed.replace(/^([-*]|\d+\.)\s+/, '');
        return (
          <li key={idx} className="ml-4 list-disc text-slate-300 my-1 pl-1">
            {renderInlineMarkdown(bulletText)}
          </li>
        );
      }

      return (
        <p key={idx} className="my-1 text-slate-200 leading-relaxed">
          {renderInlineMarkdown(trimmed)}
        </p>
      );
    });
  };

  const renderInlineMarkdown = (text) => {
    const parts = text.split(/(`[^`]+`|\[\d+\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-300 font-mono text-xs border border-slate-800">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (/^\[\d+\]$/.test(part)) {
        return (
          <span key={i} className="inline-flex items-center justify-center font-mono text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-1 py-0.2 rounded border border-indigo-500/20 mx-0.5">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <section className="bg-slate-900/90 backdrop-blur-md border border-indigo-500/30 rounded-xl p-5 shadow-2xl shadow-indigo-500/5 relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            AI Direct Answer
          </span>
          {cleanText && (
            <span className="text-xs font-mono text-slate-500">
              {cleanText.length} chars
            </span>
          )}
        </div>

        {cleanText && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-md bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition-colors cursor-pointer"
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
        )}
      </div>

      {/* Formatted Content */}
      <div className="text-sm text-slate-200 leading-relaxed font-sans relative z-10 space-y-1">
        {cleanText ? (
          renderFormattedSummary(cleanText)
        ) : isStreaming ? (
          <div className="flex items-center gap-2 text-slate-400 py-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span className="text-xs font-mono animate-pulse">Generating AI Summary...</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}