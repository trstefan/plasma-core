import React from "react";

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

export default RangeInput;
