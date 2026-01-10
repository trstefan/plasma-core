import React from "react";

interface HudTogglesProps {
  isSpectator: boolean;
  showControls: boolean;
  showGemini: boolean;
  toggleControls: () => void;
  toggleGemini: () => void;
}

const HudToggles: React.FC<HudTogglesProps> = ({
  isSpectator,
  showControls,
  showGemini,
  toggleControls,
  toggleGemini,
}) => {
  if (isSpectator || (showControls && showGemini)) return null;

  return (
    <div className="absolute top-8 right-8 flex flex-col gap-4 pointer-events-auto">
      {!showGemini && (
        <button
          onClick={toggleGemini}
          className="group bg-black/60 backdrop-blur-xl border border-white/10 w-12 h-12 rounded-full flex items-center justify-center hover:bg-cyan-900/40 transition-all shadow-xl animate-in fade-in zoom-in duration-300"
          title="Show Gemini Engine"
        >
          <svg
            className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </button>
      )}
      {!showControls && (
        <button
          onClick={toggleControls}
          className="group bg-black/60 backdrop-blur-xl border border-white/10 w-12 h-12 rounded-full flex items-center justify-center hover:bg-cyan-900/40 transition-all shadow-xl animate-in fade-in zoom-in duration-300"
          title="Show Control Deck"
        >
          <svg
            className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default HudToggles;
