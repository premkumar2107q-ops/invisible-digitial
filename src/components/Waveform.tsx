interface WaveformProps {
  data: number[];
  height?: number;
  className?: string;
}

// A live oscilloscope-style waveform that renders the simulation's current sample buffer.
export function Waveform({ data, height = 120, className = '' }: WaveformProps) {
  const width = 320;
  const mid = height / 2;
  const max = 0.5; // expected amplitude ceiling for scaling
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = mid - (v / max) * (mid - 6);
      return `${x.toFixed(1)},${Math.max(4, Math.min(height - 4, y)).toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className={`relative overflow-hidden tech-border rounded bg-ink-950 ${className}`}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
        {/* grid */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={(i / 8) * width} y1={0} x2={(i / 8) * width} y2={height} stroke="rgba(120,150,190,0.06)" strokeWidth="1" />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={(i / 4) * height} x2={width} y2={(i / 4) * height} stroke="rgba(120,150,190,0.06)" strokeWidth="1" />
        ))}
        <line x1={0} y1={mid} x2={width} y2={mid} stroke="rgba(120,150,190,0.15)" strokeWidth="1" strokeDasharray="2 4" />
        {/* glow */}
        <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.3" style={{ filter: 'blur(3px)' }} />
        <polyline points={points} fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
