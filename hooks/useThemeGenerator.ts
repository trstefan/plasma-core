import { useState, useMemo, useCallback } from "react";
import { PlasmaParams } from "@/types";

export function useThemeGenerator(
  initialDesc: string,
  onThemeGenerated: (params: Partial<PlasmaParams>, description: string) => void
) {
  const [moodInput, setMoodInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastThemeDesc, setLastThemeDesc] = useState(initialDesc);

  const handleGenerateTheme = useCallback(async (e: React.FormEvent) => {
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

      onThemeGenerated(
        {
          colorDeep: theme.colorDeep,
          colorMid: theme.colorMid,
          colorBright: theme.colorBright,
          shellColor: theme.shellColor,
          plasmaScale: theme.plasmaScale,
          plasmaBrightness: theme.plasmaBrightness,
          voidThreshold: theme.voidThreshold,
        },
        theme.description
      );

      setLastThemeDesc(theme.description);
      setMoodInput("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, [moodInput, isGenerating, onThemeGenerated]);

  return useMemo(() => ({
    moodInput,
    setMoodInput,
    isGenerating,
    lastThemeDesc,
    setLastThemeDesc,
    handleGenerateTheme,
  }), [moodInput, isGenerating, lastThemeDesc, handleGenerateTheme]);
}
