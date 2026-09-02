import { Binary, Cpu, Layers, Database } from 'lucide-react';

const ARCHITECTURE_FEATURES = [
  {
    icon: Binary,
    title: "BM25 Lexical Search",
    tag: "Keyword Matching",
    color: "text-blue-400 border-blue-500/20 bg-blue-500/10",
    desc: "Scores documents based on exact keyword frequencies, TF-IDF weights, and field matches."
  },
  {
    icon: Cpu,
    title: "Vector Dense Indexing",
    tag: "Semantic Embeddings",
    color: "text-purple-400 border-purple-500/20 bg-purple-500/10",
    desc: "Captures deep contextual meaning using neural vector embeddings to find relevant concepts."
  },
  {
    icon: Layers,
    title: "RRF Fusion Reranking",
    tag: "Hybrid Scoring",
    color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/10",
    desc: "Combines lexical (BM25) and vector ranks via Reciprocal Rank Fusion."
  },
  {
    icon: Database,
    title: "Redis In-Memory Cache",
    tag: "Sub-5ms Latency",
    color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
    desc: "Caches frequent hybrid query signatures to bypass computation and serve instant hits."
  }
];

export default function ArchitectureSection() {
  return (
    <div className="space-y-4 pt-4 border-t border-slate-800/80">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400"/>
          Under The Hood: Search Engine Architecture
        </h3>
        <p className="text-xs text-slate-400">
          How our multi-stage pipeline computes, merges, and caches technical documentation queries in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ARCHITECTURE_FEATURES.map((feat) => {
          const IconComp = feat.icon;
          return (
            <div 
              key={feat.title}
              className="p-5 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-800 flex flex-col justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg border ${feat.color}`}>
                  <IconComp className="w-5 h-5"/>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{feat.title}</h4>
                  <span className="text-[10px] font-mono text-slate-400">{feat.tag}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}