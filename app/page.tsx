"use client";

import React, { useState, useCallback } from "react";
import PlasmaGlobe from "@/components/PlasmaGlobe";
import { PlasmaParams } from "@/types";
//import { generateNewTheme } from './services/gemini';

const INITIAL_PARAMS: PlasmaParams = {
  timeScale: 0.8,
  rotationSpeedX: 0.001,
  rotationSpeedY: 0.003,
  plasmaScale: 0.15,
  plasmaBrightness: 1.5,
  voidThreshold: 0.08,
  colorDeep: "#001433",
  colorMid: "#0084ff",
  colorBright: "#00ffe1",
  shellColor: "#0066ff",
  shellOpacity: 0.4,
  bloomStrength: 1.5,
  bloomRadius: 0.4,
  bloomThreshold: 0.1,
};

const ControlGroup: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="mb-6">
    <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
      <span className="h-px flex-1 bg-cyan-400/20" />
      {title}
    </h4>
    <div className="space-y-4">{children}</div>
  </div>
);

const RangeInput: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
}> = ({ label, value, min, max, step = 0.01, onChange }) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
      <span>{label}</span>
      <span className="text-cyan-300">{value.toFixed(2)}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full accent-cyan-500 cursor-pointer"
    />
  </div>
);

const ColorInput: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
}> = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-[10px] text-gray-400 font-mono">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-[9px] text-gray-600 font-mono">
        {value.toUpperCase()}
      </span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-6 h-6 rounded-md border-0 p-0 overflow-hidden bg-transparent cursor-pointer hover:scale-110 transition-transform"
      />
    </div>
  </div>
);

export default function Home() {
  const [params, setParams] = useState<PlasmaParams>(INITIAL_PARAMS);

  // HUD Visibility State
  const [showControls, setShowControls] = useState(true);
  const [showGemini, setShowGemini] = useState(true);

  const handleParamsChange = useCallback((newParams: Partial<PlasmaParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none text-white">
      <PlasmaGlobe params={params} onParamsChange={handleParamsChange} />

      {/* Main HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none flex p-8 gap-8 overflow-hidden">
        {/* Left Side: Branding & AI Prompt */}
        <div className="flex flex-col justify-between w-96 shrink-0 h-full">
          <header
            className={`pointer-events-auto transition-all duration-1000 transform ${
              showGemini
                ? "translate-x-0 opacity-100"
                : "-translate-x-12 opacity-0"
            }`}
          >
            <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-white via-cyan-200 to-blue-500">
              PLASMA CORE
            </h1>
            <p className="text-[10px] text-cyan-400/60 uppercase tracking-[0.3em] font-mono mt-1">
              SYSTEM RE-SYNTHESIS v3.0
            </p>
          </header>
          <div />

          {/* Center Space: Interaction Hints */}
          <div className="flex-1 flex items-end justify-center pb-4 opacity-30">
            <p className="text-[9px] font-mono tracking-widest text-white/40 uppercase">
              Drag to Revolve &bull; Scroll to Scale &bull; Double click to
              reset
            </p>
          </div>

          {/* Right Side: Control Deck */}
          <div
            className={`w-80 shrink-0 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) transform h-full ${
              showControls
                ? "translate-x-0 opacity-100"
                : "translate-x-[110%] opacity-0"
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
                onClick={() => setParams(INITIAL_PARAMS)}
                className="w-full mt-4 border border-white/10 hover:bg-white/5 py-3 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-colors"
              >
                Initialize Default
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
