import { Activity, Pause, Play, RotateCcw, Zap } from 'lucide-react';
import type { SystemStatus } from '@/sim/useSimulation';

interface HeaderProps {
  status: SystemStatus;
  running: boolean;
  reduceMotion: boolean;
  onToggleRun: () => void;
  onReset: () => void;
  onToggleReduceMotion: () => void;
  onEnter: () => void;
  entered: boolean;
}

const STATUS_META: Record<SystemStatus, { label: string; color: string }> = {
  READY: { label: 'SYSTEM READY', color: 'text-ok-400' },
  NORMAL: { label: 'SYSTEM NOMINAL', color: 'text-ok-400' },
  WARNING: { label: 'HIGH LOAD DETECTED', color: 'text-warn-400' },
  TRIPPED: { label: 'PROTECTION TRIGGERED', color: 'text-fault-400' },
};

export function Header({ status, running, reduceMotion, onToggleRun, onReset, onToggleReduceMotion, onEnter, entered }: HeaderProps) {
  const meta = STATUS_META[status];

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="panel tech-border-b border-b border-ink-700/60">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between gap-3">
          {/* Logo */}
          <button onClick={onEnter} className="flex items-center gap-2.5 group" aria-label="GRID//FLOW home">
            <span className="relative flex h-7 w-7 items-center justify-center rounded tech-border-strong bg-ink-900">
              <Zap className="h-4 w-4 text-flux-400" strokeWidth={2.2} />
            </span>
            <span className="font-mono text-sm font-semibold tracking-techy text-ink-50 group-hover:text-flux-300 transition-colors">
              GRID<span className="text-flux-400">//</span>FLOW
            </span>
          </button>

          {/* Status */}
          {entered && (
            <div className="hidden md:flex items-center gap-2.5 font-mono text-[11px] tracking-techy">
              <span className={`status-dot inline-block h-2 w-2 rounded-full ${meta.color.replace('text-', 'bg-')}`} />
              <span className={meta.color}>{meta.label}</span>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-2">
            {entered && (
              <>
                <button
                  onClick={onToggleRun}
                  className="flex items-center gap-1.5 px-2.5 h-8 rounded tech-border bg-ink-850 hover:bg-ink-700 text-ink-100 text-xs font-mono tracking-techy transition-colors"
                  aria-label={running ? 'Pause simulation' : 'Play simulation'}
                >
                  {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{running ? 'PAUSE' : 'PLAY'}</span>
                </button>
                <button
                  onClick={onReset}
                  className="flex items-center gap-1.5 px-2.5 h-8 rounded tech-border bg-ink-850 hover:bg-ink-700 text-ink-100 text-xs font-mono tracking-techy transition-colors"
                  aria-label="Reset simulation"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">RESET</span>
                </button>
                <button
                  onClick={onToggleReduceMotion}
                  className={`flex items-center gap-1.5 px-2.5 h-8 rounded tech-border text-xs font-mono tracking-techy transition-colors ${
                    reduceMotion ? 'bg-flux-500/20 text-flux-300 border-flux-400/40' : 'bg-ink-850 hover:bg-ink-700 text-ink-100'
                  }`}
                  aria-pressed={reduceMotion}
                  aria-label="Toggle reduced motion"
                >
                  <Activity className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">REDUCE MOTION</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
