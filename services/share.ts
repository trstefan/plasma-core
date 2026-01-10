import { PlasmaParams } from "@/types";

export interface ShareData {
  params: PlasmaParams;
  message: string;
  description: string;
}

export function encodeShareData(data: ShareData): string {
  return btoa(JSON.stringify(data));
}

export function decodeShareData(encoded: string): ShareData | null {
  try {
    return JSON.parse(atob(encoded));
  } catch (e) {
    console.error("Failed to decode share data", e);
    return null;
  }
}
