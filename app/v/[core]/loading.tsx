"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-6 overflow-hidden">
      {/* Central Pulsing Core */}
      <div className="relative">
        <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full animate-pulse" />
        <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center relative bg-black/40 backdrop-blur-xl">
          <div className="w-8 h-8 rounded-full border-t-2 border-cyan-500 animate-spin" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-[10px] text-cyan-400 font-mono tracking-[0.5em] uppercase animate-pulse">
          Initializing Singularity
        </p>
        <div className="w-48 h-px bg-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-cyan-500/40 w-1/3 animate-[loading_1.5s_infinite_ease-in-out]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
}
