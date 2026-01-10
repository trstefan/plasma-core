import { useState, useCallback, useMemo } from "react";
import { PlasmaParams } from "@/types";

export function usePresets(params: PlasmaParams) {
  const [userPresets, setUserPresets] = useState<Record<string, PlasmaParams>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("plasma_presets");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse presets", e);
        }
      }
    }
    return {};
  });
  const [presetName, setPresetName] = useState("");

  const savePreset = useCallback(() => {
    if (!presetName.trim()) return;
    const updated = { ...userPresets, [presetName]: { ...params } };
    setUserPresets(updated);
    localStorage.setItem("plasma_presets", JSON.stringify(updated));
    setPresetName("");
  }, [userPresets, presetName, params]);

  const deletePreset = useCallback((name: string) => {
    const updated = { ...userPresets };
    delete updated[name];
    setUserPresets(updated);
    localStorage.setItem("plasma_presets", JSON.stringify(updated));
  }, [userPresets]);

  return useMemo(() => ({
    userPresets,
    presetName,
    setPresetName,
    savePreset,
    deletePreset,
  }), [userPresets, presetName, savePreset, deletePreset]);
}
