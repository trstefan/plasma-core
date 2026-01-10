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
    // Handle potential URL encoding and padding
    const normalized = decodeURIComponent(encoded).replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized));
  } catch (e) {
    console.error("Failed to decode share data", e);
    return null;
  }
}
