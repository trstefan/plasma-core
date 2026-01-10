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
export default ControlGroup;
