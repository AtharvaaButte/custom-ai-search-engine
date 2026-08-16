import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* AI Summary Card Skeleton */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
          <div className="h-5 w-36 bg-zinc-800 rounded-full" />
          <div className="h-4 w-16 bg-zinc-800 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-3.5 bg-zinc-800 rounded w-full" />
          <div className="h-3.5 bg-zinc-800 rounded w-11/12" />
          <div className="h-3.5 bg-zinc-800 rounded w-4/5" />
        </div>
      </div>

      {/* Document Results Skeleton Cards */}
      <div className="flex flex-col gap-4">
        <div className="h-4 w-40 bg-zinc-800/50 rounded" />
        
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-2/3 bg-zinc-800 rounded" />
              <div className="h-5 w-24 bg-zinc-800/80 rounded-full" />
            </div>
            <div className="space-y-2 py-1">
              <div className="h-3.5 bg-zinc-800 rounded w-full" />
              <div className="h-3.5 bg-zinc-800 rounded w-5/6" />
            </div>
            <div className="pt-3 border-t border-zinc-800/60 flex items-center gap-3">
              <div className="h-6 w-20 bg-zinc-800/70 rounded" />
              <div className="h-6 w-20 bg-zinc-800/70 rounded" />
              <div className="h-6 w-20 bg-zinc-800/70 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}