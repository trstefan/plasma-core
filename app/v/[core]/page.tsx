"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function ViewerPage() {
  const { core } = useParams();
  const router = useRouter();
  const [isGlobeReady, setIsGlobeReady] = useState(false);

  const { initialParams, initialSharedMessage, initialThemeDesc } =
    useMemo(() => {
      const decoded = decodeShareData(core as string);
      if (decoded) {
        return {
          initialParams: decoded.params,
          initialSharedMessage: decoded.message || "",
          initialThemeDesc: decoded.description || "Shared Singularity",
        };
      }
      // Fallback if decode fails (though loading.tsx should ideally handle this or we redirect)
      return {
        initialParams: null,
        initialSharedMessage: "",
        initialThemeDesc: "",
      };
    }, [core]);

  const { params, setParams, handleParamsChange } = usePlasmaParams(
    initialParams || undefined
  );

  const { showControls, showGemini, toggleGemini } = useHudState(true);

  const { lastThemeDesc } = useThemeGenerator(initialThemeDesc, (newParams) => {
    handleParamsChange(newParams);
  });

  const { isSpectator, sharedMessage } = useShare(
    params,
    lastThemeDesc,
    true,
    initialSharedMessage,
    () => {
      toggleGemini(true);
    }
  );

  const handleAccessLab = () => {
    router.push("/");
  };

  if (!initialParams) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center text-cyan-500 font-mono text-xs tracking-widest">
        STATION OFFLINE: INVALID CORE DATA
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none text-white">
      <div
        className={`transition-opacity duration-1000 ${
          isGlobeReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <PlasmaGlobe
          params={params}
          onParamsChange={handleParamsChange}
          onReady={() => setIsGlobeReady(true)}
        />
      </div>

      <SpectatorOverlay
        isSpectator={isSpectator}
        showControls={showControls}
        showGemini={showGemini}
        sharedMessage={sharedMessage}
        lastThemeDesc={lastThemeDesc}
        onAccessLab={handleAccessLab}
      />
    </div>
  );
}
