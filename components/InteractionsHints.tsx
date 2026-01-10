import React from "react";

interface InteractionsHintsProps {
  isSpectator: boolean;
  showGemini: boolean;
  showControls: boolean;
}

const InteractionsHints: React.FC<InteractionsHintsProps> = ({
  isSpectator,
  showGemini,
  showControls,
}) => {
  if (isSpectator) return null;

  return (
    <div
      className={`flex-1 flex items-end justify-center pb-4 transition-opacity duration-1000 ${
        showGemini || showControls ? "opacity-30" : "opacity-0"
      }`}
    >
      <p className="text-[9px] font-mono tracking-widest text-white/40 uppercase">
        Drag to Revolve &bull; Scroll to Scale &bull; Double click to
        reset
      </p>
    </div>
  );
};

export default InteractionsHints;
