import type { Phase } from "./store/useTimerStore";
import type { ReactNode } from "react";

import { useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Flame,
  Coffee,
  Trophy,
  Timer,
  BatteryCharging,
} from "lucide-react";
import { useTimerStore } from "./store/useTimerStore";
import { SettingRow } from "./components/SettingRow";

interface PhaseStyle {
  label: string;
  accent: string;
  stroke: string;
  glow: string;
  badge: string;
  icon: ReactNode;
}

const phaseStyles: Record<Phase, PhaseStyle> = {
  idle: {
    label: "Готов к старту",
    accent: "text-slate-200",
    stroke: "stroke-slate-500",
    glow: "from-slate-800/40",
    badge: "bg-slate-800/80 text-slate-300 border-slate-700",
    icon: <Timer className="w-4 h-4" />,
  },
  prepare: {
    label: "Приготовься",
    accent: "text-amber-400",
    stroke: "stroke-amber-400",
    glow: "from-amber-500/25",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    icon: <Timer className="w-4 h-4 animate-pulse" />,
  },
  work: {
    label: "Работа",
    accent: "text-emerald-400",
    stroke: "stroke-emerald-400",
    glow: "from-emerald-500/25",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    icon: <Flame className="w-4 h-4 animate-bounce" />,
  },
  rest: {
    label: "Отдых",
    accent: "text-sky-400",
    stroke: "stroke-sky-400",
    glow: "from-sky-500/25",
    badge: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    icon: <Coffee className="w-4 h-4" />,
  },
  cycleRest: {
    label: "Отдых (круг)",
    accent: "text-purple-400",
    stroke: "stroke-purple-400",
    glow: "from-purple-500/25",
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    icon: <BatteryCharging className="w-4 h-4" />,
  },
  finished: {
    label: "Финиш!",
    accent: "text-indigo-400",
    stroke: "stroke-indigo-400",
    glow: "from-indigo-500/30",
    badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    icon: <Trophy className="w-4 h-4" />,
  },
};

export function App() {
  const {
    workTime,
    restTime,
    totalRounds,
    totalCycles,
    cycleRestTime,
    phase,
    currentRound,
    currentCycle,
    timeLeft,
    isRunning,
    setConfig,
    start,
    pause,
    reset,
    tick,
  } = useTimerStore();

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isRunning, tick]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const totalPhaseTime =
    phase === "prepare"
      ? 5
      : phase === "rest"
        ? restTime
        : phase === "cycleRest"
          ? cycleRestTime
          : phase === "finished"
            ? 1
            : workTime;

  const progress =
    phase === "finished" || totalPhaseTime <= 0 ? 0 : timeLeft / totalPhaseTime;

  const size = 260;
  const strokeWidth = 11;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const style = phaseStyles[phase];

  return (
    <div className="relative min-h-[100dvh] w-full bg-slate-950 flex flex-col items-center justify-between sm:justify-center p-3 sm:p-6 overflow-x-hidden">
      <div
        className={`pointer-events-none absolute inset-0 bg-radial ${style.glow} via-slate-950/80 to-slate-950 transition-colors duration-700`}
      />

      <div className="relative z-10 w-full max-w-md flex-1 sm:flex-initial flex flex-col justify-between bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-7 shadow-2xl">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs sm:text-sm font-semibold transition-colors ${style.badge}`}
          >
            {style.icon}
            <span>{style.label}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 tabular-nums">
              Раунд <span className="text-white">{currentRound}</span>/
              {totalRounds}
            </div>
            <div className="px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 tabular-nums">
              Круг <span className="text-white">{currentCycle}</span>/
              {totalCycles}
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center my-4 sm:my-6">
          <svg
            className="w-56 h-56 sm:w-64 sm:h-64 -rotate-90"
            viewBox={`0 0 ${size} ${size}`}
          >
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              strokeWidth={strokeWidth}
              className="stroke-white/5"
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`${style.stroke} transition-all duration-500 ease-linear`}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`text-5xl sm:text-6xl font-black tracking-tight tabular-nums transition-colors ${style.accent}`}
            >
              {formatTime(timeLeft)}
            </span>
            <span className="text-[11px] uppercase tracking-widest text-slate-400 mt-1.5 font-medium">
              {phase === "idle"
                ? "Нажмите старт"
                : phase === "finished"
                  ? "Отличная работа"
                  : "Осталось"}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2.5">
            {!isRunning ? (
              <button
                onClick={start}
                className="col-span-3 flex items-center justify-center gap-2 bg-white text-slate-950 hover:bg-slate-200 active:scale-[0.98] h-13 sm:h-14 rounded-2xl font-bold text-base sm:text-lg shadow-lg shadow-white/10 transition cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>
                  {phase === "idle" || phase === "finished"
                    ? "Старт"
                    : "Продолжить"}
                </span>
              </button>
            ) : (
              <button
                onClick={pause}
                className="col-span-3 flex items-center justify-center gap-2 bg-amber-400 text-slate-950 hover:bg-amber-300 active:scale-[0.98] h-13 sm:h-14 rounded-2xl font-bold text-base sm:text-lg shadow-lg shadow-amber-400/20 transition cursor-pointer"
              >
                <Pause className="w-5 h-5 fill-current" />
                <span>Пауза</span>
              </button>
            )}

            <button
              onClick={reset}
              aria-label="Сбросить"
              className="col-span-1 flex items-center justify-center bg-white/10 hover:bg-white/15 active:scale-[0.96] text-white h-13 sm:h-14 rounded-2xl border border-white/10 transition cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          <div
            className={`bg-slate-950/50 rounded-2xl p-3 sm:p-3.5 border border-white/5 space-y-2.5 transition-all ${
              phase !== "idle" ? "opacity-40 pointer-events-none grayscale" : ""
            }`}
          >
            <SettingRow
              label="Работа"
              unit="сек"
              value={workTime}
              onChange={(workTime) => setConfig({ workTime })}
              step={5}
              min={5}
            />
            <div className="h-px bg-white/5" />
            <SettingRow
              label="Отдых"
              unit="сек"
              value={restTime}
              onChange={(restTime) => setConfig({ restTime })}
              step={5}
              min={0}
            />
            <div className="h-px bg-white/5" />
            <SettingRow
              label="Раунды"
              unit="в круге"
              value={totalRounds}
              onChange={(totalRounds) => setConfig({ totalRounds })}
              step={1}
              min={1}
            />
            <div className="h-px bg-white/5" />
            <SettingRow
              label="Круги"
              unit="всего"
              value={totalCycles}
              onChange={(totalCycles) => setConfig({ totalCycles })}
              step={1}
              min={1}
            />
            <div className="h-px bg-white/5" />
            <SettingRow
              label="Отдых между кругами"
              unit="сек"
              value={cycleRestTime}
              onChange={(cycleRestTime) => setConfig({ cycleRestTime })}
              step={10}
              min={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
