"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { PlasmaParams } from "@/types";
import PlasmaGlobe from "@/components/PlasmaGlobe";
import ControlGroup from "@/components/ControlGroup";
import RangeInput from "@/components/RangeInput";
import ColorInput from "@/components/ColorInput";

const INITIAL_PARAMS: PlasmaParams = {
  timeScale: 0.8,
  rotationSpeedX: 0.001,
  rotationSpeedY: 0.003,
  plasmaScale: 0.15,
  plasmaBrightness: 1.5,
  voidThreshold: 0.08,
  colorDeep: "#001433",
  colorMid: "#0084ff",
  colorBright: "#00ffe1",
  shellColor: "#0066ff",
  shellOpacity: 0.4,
  bloomStrength: 1.5,
  bloomRadius: 0.4,
  bloomThreshold: 0.1,
};

const BUILT_IN_PRESETS: Record<string, PlasmaParams> = {
  "Solar Flare": {
    ...INITIAL_PARAMS,
    colorDeep: "#440000",
    colorMid: "#ff4400",
    colorBright: "#ffff00",
    shellColor: "#ff8800",
    plasmaScale: 0.25,
    timeScale: 1.2,
  },
  "Deep Nebula": {
    ...INITIAL_PARAMS,
    colorDeep: "#110022",
    colorMid: "#6600ff",
    colorBright: "#ff00ff",
    shellColor: "#aa00ff",
    plasmaScale: 0.1,
    voidThreshold: 0.2,
  },
  "Frozen Heart": {
    ...INITIAL_PARAMS,
    colorDeep: "#001122",
    colorMid: "#00ffff",
    colorBright: "#ffffff",
    shellColor: "#88ffff",
    plasmaScale: 0.05,
    timeScale: 0.4,
  },
  "Emerald Core": {
    ...INITIAL_PARAMS,
    colorDeep: "#002200",
    colorMid: "#00ff44",
    colorBright: "#aaffaa",
    shellColor: "#00ff88",
    plasmaScale: 0.2,
    plasmaBrightness: 2.5,
  },
};

export default function Home() {
  const {
    initialParams,
    initialIsSpectator,
    initialSharedMessage,
    initialThemeDesc,
  } = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedCore = urlParams.get("core");
    if (sharedCore) {
      try {
        const decoded = JSON.parse(atob(sharedCore));
        return {
          initialParams: decoded.params as PlasmaParams,
          initialIsSpectator: true,
          initialSharedMessage: decoded.message || "",
          initialThemeDesc: decoded.description || "Shared Singularity",
        };
      } catch (e) {
        console.error("Failed to decode shared core", e);
      }
    }
    return {
      initialParams: INITIAL_PARAMS,
      initialIsSpectator: false,
      initialSharedMessage: "",
      initialThemeDesc: "Default Singularity",
    };
  }, []);

  const [params, setParams] = useState<PlasmaParams>(initialParams);
  const [moodInput, setMoodInput] = useState("");
  const [shareMessageInput, setShareMessageInput] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [lastThemeDesc, setLastThemeDesc] = useState(initialThemeDesc);
  const [presetName, setPresetName] = useState("");
  const [userPresets, setUserPresets] = useState<Record<string, PlasmaParams>>(
    {}
  );

  // HUD Visibility State - initialized based on mode
  const [showControls, setShowControls] = useState(!initialIsSpectator);
  const [showGemini, setShowGemini] = useState(!initialIsSpectator);

  // Sharing State
  const [isSpectator, setIsSpectator] = useState(initialIsSpectator);
  const [sharedMessage, setSharedMessage] = useState(initialSharedMessage);
  const [copyStatus, setCopyStatus] = useState(false);

  // Load user presets from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("plasma_presets");
    if (saved) {
      try {
        setUserPresets(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleShare = () => {
    const data = {
      params,
      message: shareMessageInput || lastThemeDesc,
      description: lastThemeDesc,
    };
    const encoded = btoa(JSON.stringify(data));
    const url = new URL(window.location.href);
    url.searchParams.set("core", encoded);

    navigator.clipboard.writeText(url.toString());
    setCopyStatus(true);
    setShareMessageInput("");
    setTimeout(() => setCopyStatus(false), 2000);
  };

  // Load presets from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("plasma_presets");
    if (saved) {
      try {
        setUserPresets(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse presets", e);
      }
    }
  }, []);

  const savePreset = () => {
    if (!presetName.trim()) return;
    const updated = { ...userPresets, [presetName]: { ...params } };
    setUserPresets(updated);
    localStorage.setItem("plasma_presets", JSON.stringify(updated));
    setPresetName("");
  };

  const deletePreset = (name: string) => {
    const updated = { ...userPresets };
    delete updated[name];
    setUserPresets(updated);
    localStorage.setItem("plasma_presets", JSON.stringify(updated));
  };

  const handleParamsChange = useCallback((newParams: Partial<PlasmaParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  const handleGenerateTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moodInput || isGenerating) return;

    setIsGenerating(true);

    try {
      const res = await fetch("/api/generate-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: moodInput }),
      });

      if (!res.ok) {
        throw new Error("Theme generation failed");
      }

      const theme = await res.json();

      setParams((prev) => ({
        ...prev,
        colorDeep: theme.colorDeep,
        colorMid: theme.colorMid,
        colorBright: theme.colorBright,
        shellColor: theme.shellColor,
        plasmaScale: theme.plasmaScale,
        plasmaBrightness: theme.plasmaBrightness,
        voidThreshold: theme.voidThreshold,
      }));

      setLastThemeDesc(theme.description);

      setMoodInput("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none text-white">
      <PlasmaGlobe params={params} onParamsChange={handleParamsChange} />

      {/* Cinematic Overlay for Spectators */}
      {/* Redesigned Spectator Overlay */}
      {isSpectator && !showControls && !showGemini && (
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
                  "{lastThemeDesc}"
                </p>
              </div>

              <button
                onClick={() => {
                  window.history.pushState({}, "", window.location.pathname);
                  setIsSpectator(false);
                  setShowGemini(true);
                }}
                className="group px-8 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black tracking-[0.3em] hover:bg-cyan-500 hover:text-white hover:border-cyan-400 transition-all duration-500 uppercase flex items-center gap-4 shadow-2xl hover:shadow-cyan-500/20"
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
              </button>
            </div>
          </div>

          {/* Interaction Zone Hint */}
          <div className="hidden md:flex flex-1 items-end justify-center pb-12 animate-in fade-in duration-1000 delay-1000">
            <div className="flex items-center gap-4 opacity-20">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <p className="text-[9px] font-mono tracking-[0.4em] uppercase">
                Interactive Field Active
              </p>
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Main HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none flex p-8 gap-8 overflow-hidden">
        {/* Left Side: Branding & AI Prompt */}
        <div className="flex flex-col justify-between w-96 shrink-0 h-full">
          <header
            className={`pointer-events-auto transition-all duration-1000 transform ${
              showGemini
                ? "translate-x-0 opacity-100"
                : "-translate-x-12 opacity-0"
            }`}
          >
            <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-white via-cyan-200 to-blue-500">
              PLASMA CORE
            </h1>
            <p className="text-[10px] text-cyan-400/60 uppercase tracking-[0.3em] font-mono mt-1">
              SYSTEM RE-SYNTHESIS v3.0
            </p>
          </header>

          {/* Gemini Engine Panel */}
          <div
            className={`pointer-events-auto mt-auto transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) transform ${
              showGemini
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0"
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
                    "{lastThemeDesc}"
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
        </div>

        {/* Center Space: Interaction Hints */}
        {!isSpectator && (
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
        )}

        {/* Right Side: Control Deck */}
        <div
          className={`w-80 shrink-0 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) transform h-full ${
            showControls
              ? "translate-x-0 opacity-100"
              : "translate-x-[110%] opacity-0"
          }`}
        >
          <div className="pointer-events-auto h-full bg-black/40 backdrop-blur-3xl border-l border-white/10 p-8 shadow-2xl overflow-y-auto relative no-scrollbar">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold tracking-tighter text-white">
                CONTROL DECK
              </h2>
              <button
                onClick={() => setShowControls(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-400"
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
            </div>

            <ControlGroup title="Presets Memory">
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.keys(BUILT_IN_PRESETS).map((name) => (
                  <button
                    key={name}
                    onClick={() => setParams(BUILT_IN_PRESETS[name])}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] uppercase font-bold hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all"
                  >
                    {name}
                  </button>
                ))}
              </div>

              {Object.keys(userPresets).length > 0 && (
                <div className="grid grid-cols-1 gap-2 border-t border-white/5 pt-4 mt-2">
                  {Object.keys(userPresets).map((name) => (
                    <div key={name} className="flex gap-2">
                      <button
                        onClick={() => setParams(userPresets[name])}
                        className="flex-1 text-left px-3 py-2 bg-cyan-950/20 border border-cyan-500/10 rounded-lg text-[9px] uppercase font-mono hover:bg-cyan-500/10 transition-all truncate"
                      >
                        {name}
                      </button>
                      <button
                        onClick={() => deletePreset(name)}
                        className="px-2 text-red-400/50 hover:text-red-400 transition-colors"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                <input
                  type="text"
                  placeholder="New preset name..."
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-[10px] text-cyan-50 focus:outline-none focus:border-cyan-500/50"
                />
                <button
                  onClick={savePreset}
                  className="bg-cyan-600 hover:bg-cyan-500 px-3 rounded-lg text-[10px] font-bold"
                >
                  SAVE
                </button>
              </div>
            </ControlGroup>

            <ControlGroup title="Energy Dynamics">
              <RangeInput
                label="Flow Velocity"
                value={params.timeScale}
                min={0}
                max={3}
                onChange={(v) => handleParamsChange({ timeScale: v })}
              />
              <RangeInput
                label="Chromatic Density"
                value={params.plasmaScale}
                min={0.01}
                max={0.6}
                onChange={(v) => handleParamsChange({ plasmaScale: v })}
              />
              <RangeInput
                label="Core Luminance"
                value={params.plasmaBrightness}
                min={0.1}
                max={5}
                onChange={(v) => handleParamsChange({ plasmaBrightness: v })}
              />
              <RangeInput
                label="Internal Voids"
                value={params.voidThreshold}
                min={0}
                max={0.8}
                onChange={(v) => handleParamsChange({ voidThreshold: v })}
              />
            </ControlGroup>

            <ControlGroup title="Chromaticity">
              <ColorInput
                label="Deep Shadow"
                value={params.colorDeep}
                onChange={(v) => handleParamsChange({ colorDeep: v })}
              />
              <ColorInput
                label="Medium Tone"
                value={params.colorMid}
                onChange={(v) => handleParamsChange({ colorMid: v })}
              />
              <ColorInput
                label="Active Pulse"
                value={params.colorBright}
                onChange={(v) => handleParamsChange({ colorBright: v })}
              />
            </ControlGroup>

            <ControlGroup title="Atmospheric Aura">
              <ColorInput
                label="Rim Light"
                value={params.shellColor}
                onChange={(v) => handleParamsChange({ shellColor: v })}
              />
              <RangeInput
                label="Refraction"
                value={params.shellOpacity}
                min={0}
                max={1}
                onChange={(v) => handleParamsChange({ shellOpacity: v })}
              />
              <RangeInput
                label="Glow Strength"
                value={params.bloomStrength}
                min={0}
                max={4}
                onChange={(v) => handleParamsChange({ bloomStrength: v })}
              />
              <RangeInput
                label="Glow Radius"
                value={params.bloomRadius}
                min={0}
                max={1}
                onChange={(v) => handleParamsChange({ bloomRadius: v })}
              />
            </ControlGroup>

            <ControlGroup title="Rotational Drift">
              <RangeInput
                label="Pitch Momentum"
                value={params.rotationSpeedX}
                min={-0.01}
                max={0.01}
                step={0.0001}
                onChange={(v) => handleParamsChange({ rotationSpeedX: v })}
              />
              <RangeInput
                label="Yaw Momentum"
                value={params.rotationSpeedY}
                min={-0.01}
                max={0.01}
                step={0.0001}
                onChange={(v) => handleParamsChange({ rotationSpeedY: v })}
              />
            </ControlGroup>

            <button
              onClick={() => setParams(INITIAL_PARAMS)}
              className="w-full mt-4 border border-white/10 hover:bg-white/5 py-3 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-colors"
            >
              Initialize Default
            </button>
          </div>
        </div>

        {/* HUD Toggle Tray - Only visible when a panel is hidden */}
        {!isSpectator && (!showControls || !showGemini) && (
          <div className="absolute top-8 right-8 flex flex-col gap-4 pointer-events-auto">
            {!showGemini && (
              <button
                onClick={() => setShowGemini(true)}
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
                onClick={() => setShowControls(true)}
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
        )}
      </div>
    </div>
  );
}
