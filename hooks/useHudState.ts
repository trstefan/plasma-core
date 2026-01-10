import { useState, useCallback, useMemo } from "react";

export function useHudState(initialSpectator: boolean = false) {
  const [showControls, setShowControls] = useState(!initialSpectator);
  const [showGemini, setShowGemini] = useState(!initialSpectator);

  const toggleControls = useCallback((val?: boolean) => {
    setShowControls((prev) => (val !== undefined ? val : !prev));
  }, []);

  const toggleGemini = useCallback((val?: boolean) => {
    setShowGemini((prev) => (val !== undefined ? val : !prev));
  }, []);

  return useMemo(() => ({
    showControls,
    showGemini,
    toggleControls,
    toggleGemini,
  }), [showControls, showGemini, toggleControls, toggleGemini]);
}
