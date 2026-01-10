"use client";

import React, { useMemo } from "react";
import PlasmaGlobe from "@/components/PlasmaGlobe";
import SpectatorOverlay from "@/components/SpectatorOverlay";
import GeminiPanel from "@/components/GeminiPanel";
import ControlDeck from "@/components/ControlDeck";
import HudToggles from "@/components/HudToggles";
import InteractionsHints from "@/components/InteractionsHints";

import { usePlasmaParams } from "@/hooks/usePlasmaParams";
import { useHudState } from "@/hooks/useHudState";
import { usePresets } from "@/hooks/usePresets";
import { useShare } from "@/hooks/useShare";
import { useThemeGenerator } from "@/hooks/useThemeGenerator";
import { decodeShareData } from "@/services/share";

import INITIAL_PARAMS from "@/constants/initialParams";

export default function Home() {
  const {
    initialParams,
    initialIsSpectator,
    initialSharedMessage,
    initialThemeDesc,
  } = // eslint-disable-next-line react-hooks/preserve-manual-memoization
    useMemo(() => {
    if (typeof window === "undefined") {
      return {
        initialParams: INITIAL_PARAMS,
        initialIsSpectator: false,
        initialSharedMessage: "",
        initialThemeDesc: "Default Singularity",
      };
    }
    const urlParams = new URLSearchParams(window.location.search);
    const sharedCore = urlParams.get("core");
    if (sharedCore) {
      const decoded = decodeShareData(sharedCore);
      if (decoded) {
        return {
          initialParams: decoded.params,
          initialIsSpectator: true,
          initialSharedMessage: decoded.message || "",
          initialThemeDesc: decoded.description || "Shared Singularity",
        };
      }
    }
    return {
      initialParams: INITIAL_PARAMS,
      initialIsSpectator: false,
      initialSharedMessage: "",
      initialThemeDesc: "Default Singularity",
    };
  }, []);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const { params, setParams, handleParamsChange, resetParams } = usePlasmaParams(initialParams);
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const { showControls, showGemini, toggleControls, toggleGemini } = useHudState(initialIsSpectator);
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const { userPresets, presetName, setPresetName, savePreset, deletePreset } = usePresets(params);

  const {
    moodInput,
    setMoodInput,
    isGenerating,
    lastThemeDesc,
    handleGenerateTheme,
  } = useThemeGenerator(initialThemeDesc, (newParams) => {
    handleParamsChange(newParams);
  });

  const {
    shareMessageInput,
    setShareMessageInput,
    copyStatus,
    isSpectator,
    sharedMessage,
    handleShare,
    exitSpectatorMode,
  } = useShare(params, lastThemeDesc, initialIsSpectator, initialSharedMessage, () => {
    toggleGemini(true);
  });

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none text-white">
      <PlasmaGlobe params={params} onParamsChange={handleParamsChange} />

      <SpectatorOverlay
        isSpectator={isSpectator}
        showControls={showControls}
        showGemini={showGemini}
        sharedMessage={sharedMessage}
        lastThemeDesc={lastThemeDesc}
        onAccessLab={exitSpectatorMode}
      />

      {/* Main HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none flex p-8 gap-8 overflow-hidden">
        {/* Left Side: Branding & AI Prompt */}
        <div className="flex flex-col justify-between w-96 shrink-0 h-full">
          <header
            className={`pointer-events-auto transition-all duration-1000 transform ${
              showGemini ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
            }`}
          >
            <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-white via-cyan-200 to-blue-500">
              PLASMA CORE
            </h1>
            <p className="text-[10px] text-cyan-400/60 uppercase tracking-[0.3em] font-mono mt-1">
              SYSTEM RE-SYNTHESIS v3.0
            </p>
          </header>

          <GeminiPanel
            showGemini={showGemini}
            setShowGemini={toggleGemini}
            moodInput={moodInput}
            setMoodInput={setMoodInput}
            isGenerating={isGenerating}
            handleGenerateTheme={handleGenerateTheme}
            lastThemeDesc={lastThemeDesc}
            shareMessageInput={shareMessageInput}
            setShareMessageInput={setShareMessageInput}
            handleShare={handleShare}
            copyStatus={copyStatus}
          />
        </div>

        <InteractionsHints
          isSpectator={isSpectator}
          showGemini={showGemini}
          showControls={showControls}
        />

        <ControlDeck
          showControls={showControls}
          setShowControls={toggleControls}
          params={params}
          setParams={setParams}
          handleParamsChange={handleParamsChange}
          userPresets={userPresets}
          presetName={presetName}
          setPresetName={setPresetName}
          savePreset={savePreset}
          deletePreset={deletePreset}
          resetParams={resetParams}
        />

        <HudToggles
          isSpectator={isSpectator}
          showControls={showControls}
          showGemini={showGemini}
          toggleControls={toggleControls}
          toggleGemini={toggleGemini}
        />
      </div>
    </div>
  );
}
