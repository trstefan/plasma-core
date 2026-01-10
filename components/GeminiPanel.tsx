import React from "react";

interface GeminiPanelProps {
  showGemini: boolean;
  setShowGemini: (show: boolean) => void;
  moodInput: string;
  setMoodInput: (mood: string) => void;
  isGenerating: boolean;
  handleGenerateTheme: (e: React.FormEvent) => void;
  lastThemeDesc: string;
  shareMessageInput: string;
  setShareMessageInput: (msg: string) => void;
  handleShare: () => void;
  copyStatus: boolean;
}

const GeminiPanel: React.FC<GeminiPanelProps> = ({
  showGemini,
  setShowGemini,
  moodInput,
  setMoodInput,
  isGenerating,
  handleGenerateTheme,
  lastThemeDesc,
  shareMessageInput,
  setShareMessageInput,
  handleShare,
  copyStatus,
}) => {
  return (
    <div
      className={`pointer-events-auto mt-auto transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) transform ${
        showGemini ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
      }`}
    >
      <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-20" />
        {/* Panel Close Button */}
        <button
          onClick={() => setShowGemini(false)}
          className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              GEMINI ENGINE
            </h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-tighter mt-1">
              Neural Reconfiguration
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerateTheme} className="relative group">
          <input
            type="text"
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            placeholder="Define a mood..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm text-cyan-50 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
          />
          <button
            disabled={isGenerating}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-800 text-white h-10 w-16 rounded-xl text-[10px] font-black tracking-widest transition-all transform active:scale-95 flex items-center justify-center"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "SYNC"
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-6">
          <div>
            <div className="text-[9px] text-gray-600 uppercase mb-1">
              Last Transmission
            </div>
            <div className="text-sm font-light text-cyan-100 italic">
              &quot;{lastThemeDesc}&quot;
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[9px] text-gray-400 uppercase tracking-widest">
              Share Configuration
            </div>
            <textarea
              value={shareMessageInput}
              onChange={(e) => setShareMessageInput(e.target.value)}
              placeholder="Add a personal message for the recipient..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-cyan-50 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all placeholder:text-white/10 min-h-20 resize-none"
            />
            <button
              onClick={handleShare}
              className="w-full py-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[10px] font-bold tracking-widest text-cyan-400 hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              {copyStatus ? (
                <>
                  <svg
                    className="w-3 h-3 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  LINK COPIED
                </>
              ) : (
                <>
                  <svg
                    className="w-3 h-3 group-hover:rotate-12 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  SHARE CORE
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiPanel;
