import Link from "next/link";
import React from "react";

interface SpectatorOverlayProps {
  isSpectator: boolean;
  showControls: boolean;
  showGemini: boolean;
  sharedMessage: string;
  lastThemeDesc: string;
  onAccessLab: () => void;
}

const SpectatorOverlay: React.FC<SpectatorOverlayProps> = ({
  isSpectator,
  showControls,
  showGemini,
  sharedMessage,
  lastThemeDesc,
  onAccessLab,
}) => {
  if (!isSpectator || showControls || showGemini) return null;

  return (
    <div className="absolute inset-0 flex pointer-events-none">
      {/* Glass Side Panel */}
      <div className="w-full md:w-111.5 h-full bg-linear-to-r from-black/80 via-black/40 to-transparent backdrop-blur-xs p-12 md:p-20 flex flex-col justify-center animate-in slide-in-from-left duration-1000 ease-out">
        <div className="max-w-md pointer-events-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-cyan-400" />
            <p className="text-[10px] text-cyan-400 uppercase tracking-[0.5em] font-bold font-mono">
              Incoming Singularity
            </p>
          </div>

          <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-white leading-[1.2] mb-10 whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            {sharedMessage || "A silent echo from the core."}
          </h2>

          <div className="space-y-2 mb-12 opacity-60">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">
              Transmission Identity
            </p>
            <p className="text-xs font-light italic text-cyan-100">
              &quot;{lastThemeDesc}&quot;
            </p>
          </div>

          <Link
            href={"/"}
            className="group px-8 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black tracking-[0.3em] hover:bg-cyan-500 hover:text-white hover:border-cyan-400 transition-all duration-500 uppercase flex justify-between items-center gap-4 shadow-2xl hover:shadow-cyan-500/20"
          >
            ACCESS LAB
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <svg
                className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SpectatorOverlay;
