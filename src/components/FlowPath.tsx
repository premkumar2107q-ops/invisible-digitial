interface FlowPathProps {
  d: string;
  active: boolean;
  intensity?: number; // 0..1 controls flow speed/density
  stressed?: boolean;
  className?: string;
}

// A single electrical path rendered as two stacked SVG paths:
// a faint static conductor plus an animated dashed "current" overlay.
export function FlowPath({ d, active, intensity = 0.5, stressed = false, className = '' }: FlowPathProps) {
  const speed = stressed ? 'flow-dash-fast' : 'flow-dash';
  const conductorColor = stressed ? 'rgba(239,68,68,0.5)' : 'rgba(120,150,190,0.28)';
  const flowColor = stressed ? '#ef4444' : '#60a5fa';
  const flowOpacity = active ? 0.35 + intensity * 0.65 : 0;

  return (
    <g className={className}>
      <path d={d} fill="none" stroke={conductorColor} strokeWidth="2" strokeLinecap="round" />
      {active && (
        <path
          d={d}
          fill="none"
          stroke={flowColor}
          strokeWidth="2"
          strokeLinecap="round"
          className={speed}
          opacity={flowOpacity}
          style={{ filter: stressed ? `drop-shadow(0 0 4px ${flowColor})` : 'none' }}
        />
      )}
    </g>
  );
}
