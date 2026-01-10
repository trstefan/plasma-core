import { useState, useCallback, useMemo } from "react";
import { PlasmaParams } from "@/types";
import { encodeShareData } from "@/services/share";

export function useShare(
  params: PlasmaParams,
  lastThemeDesc: string,
  initialIsSpectator: boolean,
  initialSharedMessage: string,
  onAccessLab: () => void
) {
  const [shareMessageInput, setShareMessageInput] = useState("");
  const [copyStatus, setCopyStatus] = useState(false);
  const [isSpectator, setIsSpectator] = useState(initialIsSpectator);
  const [sharedMessage] = useState(initialSharedMessage);

  const handleShare = useCallback(() => {
    const data = {
      params,
      message: shareMessageInput || "Someone wanted to send you a cute core",
      description: lastThemeDesc,
    };
    const encoded = encodeShareData(data);
    const url = new URL(window.location.origin);
    url.pathname = `/v/${encoded}`;

    navigator.clipboard.writeText(url.toString());
    setCopyStatus(true);
    setShareMessageInput("");
    setTimeout(() => setCopyStatus(false), 2000);
  }, [params, lastThemeDesc, shareMessageInput]);

  const exitSpectatorMode = useCallback(() => {
    window.history.pushState({}, "", window.location.pathname);
    setIsSpectator(false);
    onAccessLab();
  }, [onAccessLab]);

  return useMemo(() => ({
    shareMessageInput,
    setShareMessageInput,
    copyStatus,
    isSpectator,
    sharedMessage,
    handleShare,
    exitSpectatorMode,
  }), [
    shareMessageInput,
    copyStatus,
    isSpectator,
    sharedMessage,
    handleShare,
    exitSpectatorMode,
  ]);
}
