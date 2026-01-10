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

export default ColorInput;
