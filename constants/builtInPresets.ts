import { PlasmaParams } from "@/types";
import INITIAL_PARAMS from "./initialParams";

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

export default BUILT_IN_PRESETS;
