import { Gauge, Zap, Database, Cpu } from 'lucide-react';

export function MetricsBar({ latency, source, count }) {
  const isRedis = source === 'redis_cache' || source === 'redis';

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-xl text-xs font-mono text-slate-400 shadow-sm">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Latency Indicator */}
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <Gauge className="w-4 h-4" />
          <span>Latency: <strong className="text-slate-100">{latency !== null ? `${latency}ms` : 'N/A'}</strong></span>
        </span>

        <span className="text-slate-800 hidden sm:inline">|</span>

        {/* Engine Source Badge */}
        <div className="flex items-center gap-2">
          <span>Source:</span>
          {isRedis ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              Redis Cache (Sub-5ms)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              Python RRF Engine
            </span>
          )}
        </div>
      </div>

      {/* Total Matched Count */}
      <div className="flex items-center gap-1.5 text-slate-300">
        <Zap className="w-3.5 h-3.5 text-cyan-400" />
        <span>Total Hits: <strong className="text-slate-100">{count ?? 0}</strong></span>
      </div>
    </div>
  );
}

export default MetricsBar;