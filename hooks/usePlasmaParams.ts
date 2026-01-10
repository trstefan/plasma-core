import { useState, useCallback, useMemo } from "react";
import { PlasmaParams } from "@/types";
import INITIAL_PARAMS from "@/constants/initialParams";

export function usePlasmaParams(initial: PlasmaParams = INITIAL_PARAMS) {
  const [params, setParams] = useState<PlasmaParams>(initial);

  const handleParamsChange = useCallback((newParams: Partial<PlasmaParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  const resetParams = useCallback(() => {
    setParams(INITIAL_PARAMS);
  }, []);

  return useMemo(() => ({
    params,
    setParams,
    handleParamsChange,
    resetParams,
  }), [params, setParams, handleParamsChange, resetParams]);
}
