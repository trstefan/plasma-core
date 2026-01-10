import React from "react";
import { PlasmaParams } from "@/types";
import ControlGroup from "./ControlGroup";
import RangeInput from "./RangeInput";
import ColorInput from "./ColorInput";
import BUILT_IN_PRESETS from "@/constants/builtInPresets";

interface ControlDeckProps {
  showControls: boolean;
  setShowControls: (show: boolean) => void;
  params: PlasmaParams;
  setParams: (params: PlasmaParams) => void;
  handleParamsChange: (newParams: Partial<PlasmaParams>) => void;
  userPresets: Record<string, PlasmaParams>;
  presetName: string;
  setPresetName: (name: string) => void;
  savePreset: () => void;
  deletePreset: (name: string) => void;
  resetParams: () => void;
}

const ControlDeck: React.FC<ControlDeckProps> = ({
  showControls,
  setShowControls,
  params,
  setParams,
  handleParamsChange,
  userPresets,
  presetName,
  setPresetName,
  savePreset,
  deletePreset,
  resetParams,
}) => {
  return (
    <div
      className={`w-80 shrink-0 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) transform h-full ${
        showControls ? "translate-x-0 opacity-100" : "translate-x-[110%] opacity-0"
      }`}
    >
      <div className="pointer-events-auto h-full bg-black/40 backdrop-blur-3xl border-l border-white/10 p-8 shadow-2xl overflow-y-auto relative no-scrollbar">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold tracking-tighter text-white">
            CONTROL DECK
          </h2>
          <button
            onClick={() => setShowControls(false)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <ControlGroup title="Presets Memory">
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(BUILT_IN_PRESETS).map((name) => (
              <button
                key={name}
                onClick={() => setParams(BUILT_IN_PRESETS[name])}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] uppercase font-bold hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all"
              >
                {name}
              </button>
            ))}
          </div>

          {Object.keys(userPresets).length > 0 && (
            <div className="grid grid-cols-1 gap-2 border-t border-white/5 pt-4 mt-2">
              {Object.keys(userPresets).map((name) => (
                <div key={name} className="flex gap-2">
                  <button
                    onClick={() => setParams(userPresets[name])}
                    className="flex-1 text-left px-3 py-2 bg-cyan-950/20 border border-cyan-500/10 rounded-lg text-[9px] uppercase font-mono hover:bg-cyan-500/10 transition-all truncate"
                  >
                    {name}
                  </button>
                  <button
                    onClick={() => deletePreset(name)}
                    className="px-2 text-red-400/50 hover:text-red-400 transition-colors"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
            <input
              type="text"
              placeholder="New preset name..."
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-[10px] text-cyan-50 focus:outline-none focus:border-cyan-500/50"
            />
            <button
              onClick={savePreset}
              className="bg-cyan-600 hover:bg-cyan-500 px-3 rounded-lg text-[10px] font-bold"
            >
              SAVE
            </button>
          </div>
        </ControlGroup>

        <ControlGroup title="Energy Dynamics">
          <RangeInput
            label="Flow Velocity"
            value={params.timeScale}
            min={0}
            max={3}
            onChange={(v) => handleParamsChange({ timeScale: v })}
          />
          <RangeInput
            label="Chromatic Density"
            value={params.plasmaScale}
            min={0.01}
            max={0.6}
            onChange={(v) => handleParamsChange({ plasmaScale: v })}
          />
          <RangeInput
            label="Core Luminance"
            value={params.plasmaBrightness}
            min={0.1}
            max={5}
            onChange={(v) => handleParamsChange({ plasmaBrightness: v })}
          />
          <RangeInput
            label="Internal Voids"
            value={params.voidThreshold}
            min={0}
            max={0.8}
            onChange={(v) => handleParamsChange({ voidThreshold: v })}
          />
        </ControlGroup>

        <ControlGroup title="Chromaticity">
          <ColorInput
            label="Deep Shadow"
            value={params.colorDeep}
            onChange={(v) => handleParamsChange({ colorDeep: v })}
          />
          <ColorInput
            label="Medium Tone"
            value={params.colorMid}
            onChange={(v) => handleParamsChange({ colorMid: v })}
          />
          <ColorInput
            label="Active Pulse"
            value={params.colorBright}
            onChange={(v) => handleParamsChange({ colorBright: v })}
          />
        </ControlGroup>

        <ControlGroup title="Atmospheric Aura">
          <ColorInput
            label="Rim Light"
            value={params.shellColor}
            onChange={(v) => handleParamsChange({ shellColor: v })}
          />
          <RangeInput
            label="Refraction"
            value={params.shellOpacity}
            min={0}
            max={1}
            onChange={(v) => handleParamsChange({ shellOpacity: v })}
          />
          <RangeInput
            label="Glow Strength"
            value={params.bloomStrength}
            min={0}
            max={4}
            onChange={(v) => handleParamsChange({ bloomStrength: v })}
          />
          <RangeInput
            label="Glow Radius"
            value={params.bloomRadius}
            min={0}
            max={1}
            onChange={(v) => handleParamsChange({ bloomRadius: v })}
          />
        </ControlGroup>

        <ControlGroup title="Rotational Drift">
          <RangeInput
            label="Pitch Momentum"
            value={params.rotationSpeedX}
            min={-0.01}
            max={0.01}
            step={0.0001}
            onChange={(v) => handleParamsChange({ rotationSpeedX: v })}
          />
          <RangeInput
            label="Yaw Momentum"
            value={params.rotationSpeedY}
            min={-0.01}
            max={0.01}
            step={0.0001}
            onChange={(v) => handleParamsChange({ rotationSpeedY: v })}
          />
        </ControlGroup>

        <button
          onClick={resetParams}
          className="w-full mt-4 border border-white/10 hover:bg-white/5 py-3 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-colors"
        >
          Initialize Default
        </button>
      </div>
    </div>
  );
};

export default ControlDeck;
