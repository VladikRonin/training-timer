import { Plus, Minus } from "lucide-react";

interface SettingRowProps {
  label: string;
  unit: string;
  value: number;
  onChange: (val: number) => void;
  step: number;
  min: number;
}

export function SettingRow({
  label,
  unit,
  value,
  onChange,
  step,
  min,
}: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0">
        <div className="text-sm font-medium text-slate-200 truncate">
          {label}
        </div>
        <div className="text-[11px] text-slate-500">{unit}</div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 active:scale-95 border border-white/10 text-slate-200 transition cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className="w-11 text-center text-base font-bold tabular-nums text-white">
          {value}
        </span>

        <button
          onClick={() => onChange(value + step)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 active:scale-95 border border-white/10 text-slate-200 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
