import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@liftyhub_calendar_plan";

export type DayPlan =
  | { type: "routine"; routineId: string; routineName: string; isUserRoutine: boolean }
  | { type: "rest" }
  | null; // null = not configured yet

// dayIndex: 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
export type WeekPlan = { [dayIndex: number]: DayPlan };

export async function loadWeekPlan(): Promise<WeekPlan> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function saveWeekPlan(plan: WeekPlan): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(plan));
  } catch {}
}

export async function setDayPlan(dayIndex: number, plan: DayPlan): Promise<void> {
  const current = await loadWeekPlan();
  current[dayIndex] = plan;
  await saveWeekPlan(current);
}
