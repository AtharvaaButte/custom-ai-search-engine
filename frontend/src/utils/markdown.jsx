import { Terminal } from 'lucide-react';

export function renderStreamMarkdown(content) {
  if (!content) return null;

  // Split into paragraphs / code blocks
  const blocks = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 text-sm leading-relaxed text-zinc-300">
      {blocks.map((block, i) => {
        if (block.startsWith('```')) {
          const lines = block.slice(3, -3).trim().split('\n');
          const language = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : '';
          const code = language ? lines.slice(1).join('\n') : lines.join('\n');

          return (
            <div key={i} className="my-3 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-zinc-400">
                <span className="flex items-center gap-1.5 text-zinc-400 font-semibold uppercase">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400"/>
                  {language || 'code'}
                </span>
              </div>
              <pre className="p-3 overflow-x-auto text-indigo-200">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // Standard text line formatting
        const formattedLines = block.split('\n').map((line, lineIdx) => {
          if (!line.trim()) return <br key={lineIdx} />;
          const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);

          return (
            <p key={lineIdx} className="mb-2">
              {parts.map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={pIdx} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('`') && part.endsWith('`')) {
                  return <code key={pIdx} className="px-1.5 py-0.5 rounded bg-zinc-800 text-cyan-300 font-mono text-xs">{part.slice(1, -1)}</code>;
                }
                return part;
              })}
            </p>
          );
        });

        return <div key={i}>{formattedLines}</div>;
      })}
    </div>
  );
}