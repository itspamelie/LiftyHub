import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "workout_sessions";

export type WorkoutSession = {
  date: string;       // "YYYY-MM-DD"
  routineName: string;
  durationMinutes?: number;
};

export async function getSessions(): Promise<WorkoutSession[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function logSession(session: WorkoutSession): Promise<void> {
  const sessions = await getSessions();
  sessions.push(session);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export async function getSessionMap(): Promise<Record<string, WorkoutSession[]>> {
  const sessions = await getSessions();
  const map: Record<string, WorkoutSession[]> = {};
  for (const s of sessions) {
    if (!map[s.date]) map[s.date] = [];
    map[s.date].push(s);
  }
  return map;
}

// Retorna los últimos N días como array de fechas "YYYY-MM-DD"
export function getLastNDays(n: number): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}
