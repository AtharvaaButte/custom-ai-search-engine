export function getMatchType(bm25, vector) {
  const HIGH_BM25 = 10.0;
  const HIGH_VECTOR = 0.70;

  if (bm25 >= HIGH_BM25 && vector >= HIGH_VECTOR) {
    return {
      label: 'Hybrid Match',
      variant: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold',
    };
  }

  if (vector >= HIGH_VECTOR) {
    return {
      label: 'Semantic Match',
      variant: 'bg-purple-500/10 text-purple-400 border-purple-500/30 font-semibold',
    };
  }

  return {
    label: 'Exact Keyword',
    variant: 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-semibold',
  };
}