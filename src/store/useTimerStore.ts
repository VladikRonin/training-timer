import { create } from "zustand";
import { persist } from "zustand/middleware";
import { playBeep } from "../utils/sound";

export type Phase =
  "idle" | "prepare" | "work" | "rest" | "cycleRest" | "finished";

interface TimerConfig {
  workTime: number;
  restTime: number;
  totalRounds: number;
  totalCycles: number;
  cycleRestTime: number;
}

interface TimerState extends TimerConfig {
  phase: Phase;
  currentRound: number;
  currentCycle: number;
  timeLeft: number;
  isRunning: boolean;

  setConfig: (config: Partial<TimerConfig>) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
}

const DEFAULT_CONFIG: TimerConfig = {
  workTime: 40,
  restTime: 20,
  totalRounds: 4,
  totalCycles: 3,
  cycleRestTime: 60,
};

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_CONFIG,
      phase: "idle",
      currentRound: 1,
      currentCycle: 1,
      timeLeft: DEFAULT_CONFIG.workTime,
      isRunning: false,

      setConfig: (newConfig) =>
        set((state) => {
          const updated = { ...state, ...newConfig };
          return {
            workTime: updated.workTime,
            restTime: updated.restTime,
            totalRounds: updated.totalRounds,
            totalCycles: updated.totalCycles,
            cycleRestTime: updated.cycleRestTime,
            phase: "idle",
            currentRound: 1,
            currentCycle: 1,
            timeLeft: updated.workTime,
            isRunning: false,
          };
        }),

      start: () => {
        const { phase } = get();
        if (phase === "idle" || phase === "finished") {
          playBeep(440, 0.2);
          set({
            phase: "prepare",
            currentRound: 1,
            currentCycle: 1,
            timeLeft: 5,
            isRunning: true,
          });
        } else {
          set({ isRunning: true });
        }
      },

      pause: () => set({ isRunning: false }),

      reset: () =>
        set((state) => ({
          phase: "idle",
          currentRound: 1,
          currentCycle: 1,
          timeLeft: state.workTime,
          isRunning: false,
        })),

      tick: () => {
        const {
          phase,
          timeLeft,
          currentRound,
          totalRounds,
          currentCycle,
          totalCycles,
          workTime,
          restTime,
          cycleRestTime,
          isRunning,
        } = get();

        if (!isRunning) return;

        if (timeLeft <= 4 && timeLeft > 1) {
          playBeep(440, 0.1);
        }

        if (timeLeft > 1) {
          set({ timeLeft: timeLeft - 1 });
          return;
        }

        if (phase === "prepare") {
          playBeep(880, 0.3);
          set({ phase: "work", timeLeft: workTime });
        } else if (phase === "work") {
          if (currentRound < totalRounds) {
            // Обычный отдых между раундами
            if (restTime > 0) {
              playBeep(600, 0.3);
              set({ phase: "rest", timeLeft: restTime });
            } else {
              playBeep(880, 0.3);
              set({
                phase: "work",
                currentRound: currentRound + 1,
                timeLeft: workTime,
              });
            }
          } else if (currentCycle < totalCycles) {
            // Длинный отдых между кругами
            if (cycleRestTime > 0) {
              playBeep(500, 0.4);
              set({ phase: "cycleRest", timeLeft: cycleRestTime });
            } else {
              playBeep(880, 0.3);
              set({
                phase: "work",
                currentRound: 1,
                currentCycle: currentCycle + 1,
                timeLeft: workTime,
              });
            }
          } else {
            // Все раунды и круги завершены
            playBeep(1000, 0.5);
            set({ phase: "finished", timeLeft: 0, isRunning: false });
          }
        } else if (phase === "rest") {
          playBeep(880, 0.3);
          set({
            phase: "work",
            currentRound: currentRound + 1,
            timeLeft: workTime,
          });
        } else if (phase === "cycleRest") {
          playBeep(880, 0.3);
          set({
            phase: "work",
            currentRound: 1,
            currentCycle: currentCycle + 1,
            timeLeft: workTime,
          });
        }
      },
    }),
    {
      name: "workout-timer-v2",
      partialize: (state) => ({
        workTime: state.workTime,
        restTime: state.restTime,
        totalRounds: state.totalRounds,
        totalCycles: state.totalCycles,
        cycleRestTime: state.cycleRestTime,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.timeLeft = state.workTime;
        }
      },
    },
  ),
);
