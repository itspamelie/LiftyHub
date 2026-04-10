import { createContext, useContext, useState, useRef, useEffect, useCallback, ReactNode } from "react";

type Phase = "exercise" | "rest" | "done";

export type WorkoutExercise = {
  id: number;
  sets?: number;
  repetitions?: number;
  seconds_rest?: number;
  exercise?: { id: number; name: string; muscle: string };
  name?: string;
  muscle?: string;
};

export interface SessionSnapshot {
  routineId: string;
  routineName: string;
  isUserRoutine: string;
  exercises: WorkoutExercise[];
  exIndex: number;
  currentSet: number;
  phase: Phase;
  restLeft: number;
  setWeights: string[][];
  currentWeight: string;
  sessionId: number | null;
  startedAt: string;
}

interface WorkoutContextType {
  isActive: boolean;
  isMinimized: boolean;
  elapsedSecs: number;
  snapshot: SessionSnapshot | null;
  startWorkout: (snapshot: SessionSnapshot) => void;
  minimizeWorkout: (snapshot: SessionSnapshot) => void;
  restoreWorkout: () => void;
  endWorkout: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive]     = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const [snapshot, setSnapshot]     = useState<SessionSnapshot | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const startWorkout = useCallback((snap: SessionSnapshot) => {
    clearTimer();
    timerRef.current = setInterval(() => setElapsedSecs((s) => s + 1), 1000);
    setSnapshot(snap);
    setIsActive(true);
    setIsMinimized(false);
    setElapsedSecs(0);
  }, []);

  const minimizeWorkout = useCallback((snap: SessionSnapshot) => {
    setSnapshot(snap);
    setIsMinimized(true);
    // timer keeps running in the background
  }, []);

  const restoreWorkout = useCallback(() => {
    setIsMinimized(false);
  }, []);

  const endWorkout = useCallback(() => {
    clearTimer();
    setIsActive(false);
    setIsMinimized(false);
    setSnapshot(null);
    setElapsedSecs(0);
  }, []);

  useEffect(() => () => clearTimer(), []);

  return (
    <WorkoutContext.Provider value={{
      isActive, isMinimized, elapsedSecs, snapshot,
      startWorkout, minimizeWorkout, restoreWorkout, endWorkout,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error("useWorkout must be used within WorkoutProvider");
  return ctx;
}
