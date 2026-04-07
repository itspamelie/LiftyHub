import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserRoutineSession,
  updateUserRoutineSession,
  createExerciseLog,
  getUserStreak,
  createUserStreak,
  updateUserStreak,
} from "@/src/services/api";

const KEY = "@liftyhub_pending_workouts";

export type PendingWorkout = {
  routineId: number | null;
  userRoutineId: number | null;
  startedAt: string;
  finishedAt: string;
  userId: number;
  logs: Array<{
    exerciseId: number;
    exerciseRoutineId: number;
    weightLifted: number;
    repetitions: number;
    sets: number;
    workoutDate: string;
  }>;
};

export const savePendingWorkout = async (data: PendingWorkout): Promise<void> => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const pending: PendingWorkout[] = raw ? JSON.parse(raw) : [];
    pending.push(data);
    await AsyncStorage.setItem(KEY, JSON.stringify(pending));
  } catch {}
};

const today = () => new Date().toISOString().split("T")[0];

export const syncPendingWorkouts = async (token: string): Promise<number> => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const pending: PendingWorkout[] = raw ? JSON.parse(raw) : [];
    if (pending.length === 0) return 0;

    const remaining: PendingWorkout[] = [];
    let synced = 0;

    for (const workout of pending) {
      try {
        // 1. Create session
        const sessionRes = await createUserRoutineSession(
          {
            user_id: workout.userId,
            routine_id: workout.routineId,
            user_routine_id: workout.userRoutineId,
            started_at: workout.startedAt,
          },
          token
        );
        const sessionId = sessionRes?.data?.id ?? null;

        if (sessionId) {
          // 2. Close session
          await updateUserRoutineSession(sessionId, { finished_at: workout.finishedAt }, token).catch(() => {});

          // 3. Save exercise logs
          for (const log of workout.logs) {
            await createExerciseLog(
              {
                user_id: workout.userId,
                exercise_id: log.exerciseId,
                weight_lifted: log.weightLifted,
                repetitions: log.repetitions,
                sets: log.sets,
                exercise_routine_id: log.exerciseRoutineId,
                user_routine_session_id: sessionId,
                workout_date: log.workoutDate,
              },
              token
            ).catch(() => {});
          }
        }

        // 4. Update streak
        const streakRes = await getUserStreak(workout.userId, token).catch(() => null);
        const streak = streakRes?.data;
        const todayStr = today();

        if (streak && streak.last_training_date !== todayStr) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];
          const newCurrent = streak.last_training_date === yesterdayStr
            ? (streak.current_streak ?? 0) + 1
            : 1;
          const newLongest = Math.max(newCurrent, streak.longest_streak ?? 0);
          await updateUserStreak(
            streak.id,
            { user_id: workout.userId, current_streak: newCurrent, longest_streak: newLongest, last_training_date: todayStr },
            token
          ).catch(() => {});
        } else if (!streak) {
          await createUserStreak(
            { user_id: workout.userId, current_streak: 1, longest_streak: 1, last_training_date: todayStr },
            token
          ).catch(() => {});
        }

        synced++;
      } catch {
        remaining.push(workout);
      }
    }

    await AsyncStorage.setItem(KEY, JSON.stringify(remaining));
    return synced;
  } catch {
    return 0;
  }
};
