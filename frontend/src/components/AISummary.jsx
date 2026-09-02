import AISummaryCard from './AISummaryCard';

export default function AISummary({ summary, content, isStreaming }) {
  return (
    <aside className="w-full lg:w-96 shrink-0 space-y-3">
      <AISummaryCard summary={summary} content={content} isStreaming={isStreaming} />
    </aside>
  );
}

export { AISummary, AISummaryCard };