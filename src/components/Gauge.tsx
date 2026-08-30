interface GaugeProps {
  value: number; // 0..100
  max?: number;
  label: string;
  unit: string;
  display: string;
  warning?: boolean;
  danger?: boolean;
  size?: number;
}

// A semicircular gauge that sweeps from -90deg to +90deg.
export function Gauge({ value, max = 100, label, unit, display, warning, danger, size = 160 }: GaugeProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const r = 70;
  const circumference = Math.PI * r; // semicircle arc length
  const offset = circumference - (pct / 100) * circumference;

  const color = danger ? '#ef4444' : warning ? '#f59e0b' : '#3b82f6';
  const trackColor = 'rgba(120,150,190,0.12)';

  return (
    <div className="flex flex-col items-center" role="meter" aria-label={`${label}: ${display} ${unit}`} aria-valuenow={value} aria-valuemax={max}>
      <svg width={size} height={size / 2 + 24} viewBox="0 0 160 104">
        {/* track */}
        <path
          d="M 15 90 A 70 70 0 0 1 145 90"
          fill="none"
          stroke={trackColor}
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* value arc */}
        <path
          d="M 15 90 A 70 70 0 0 1 145 90"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          className="gauge-arc"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: warning || danger ? `drop-shadow(0 0 6px ${color})` : 'none' }}
        />
        {/* ticks */}
        {[0, 25, 50, 75, 100].map((t) => {
          const angle = Math.PI - (t / 100) * Math.PI;
          const x1 = 80 + Math.cos(angle) * 62;
          const y1 = 90 - Math.sin(angle) * 62;
          const x2 = 80 + Math.cos(angle) * 56;
          const y2 = 90 - Math.sin(angle) * 56;
          return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(120,150,190,0.3)" strokeWidth="1" />;
        })}
      </svg>
      <div className="-mt-6 text-center">
        <div className="font-mono text-xl md:text-2xl font-semibold text-ink-50 tabular-nums">{display}</div>
        <div className="font-mono text-[10px] tracking-techy text-ink-300 mt-0.5">{unit}</div>
      </div>
      <div className="mt-2 font-mono text-[10px] tracking-techy text-ink-200 uppercase">{label}</div>
    </div>
  );
}
