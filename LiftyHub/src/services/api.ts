import * as Storage from "@/src/utils/storage";
import { router } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const TIMEOUT_MS = 10000;

const fetchWithTimeout = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
};

// Función centralizada — si el token es inválido, limpia y manda al login
const apiFetch = async (url: string, options: RequestInit = {}) => {
  const res = await fetchWithTimeout(url, options);
  const data = await res.json();

  if (data.error === "Unauthorized" || res.status === 401) {
    await Storage.removeItem("token");
    await Storage.removeItem("user");
    router.replace("/auth/login");
    return null;
  }

  return data;
};

// 🔐 GOOGLE LOGIN
export const googleLoginRequest = async (idToken: string) => {
  try {
    const res = await fetchWithTimeout(`${API_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ id_token: idToken }),
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
};

// 🔐 LOGIN
export const loginRequest = async (email: string, password: string) => {
  try {
    const res = await fetchWithTimeout(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    return await res.json();

  } catch (error) {
    throw error;
  }
};

// 📝 REGISTRO
export const registerRequest = async (data: {
  name: string;
  email: string;
  password: string;
  gender: string;
  birthdate: string;
}) => {
  try {
    const res = await fetchWithTimeout(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(data),
    });
    const text = await res.text();
    return JSON.parse(text);
  } catch (error) {
    throw error;
  }
};

// 🏷️ CREAR PROPIEDADES DEL USUARIO (tras registro)
export const createUserProperties = async (
  data: {
    user_id: number;
    stature?: number;
    weight?: number;
    waist?: number;
    objective: string;
    somatotype_id: number;
  },
  token: string
) => {
  return apiFetch(`${API_URL}/userProperties`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

// 🔑 VERIFICAR CONTRASEÑA ACTUAL
export const checkPassword = async (currentPassword: string, token: string) => {
  return apiFetch(`${API_URL}/check-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ current_password: currentPassword }),
  });
};

// 🗑️ ELIMINAR CUENTA
export const deleteAccount = async (id: number, token: string) => {
  return apiFetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

// ✏️ ACTUALIZAR USUARIO
export const updateUser = async (id: number, data: { name?: string; email?: string }, token: string) => {
  return apiFetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

// ✏️ ACTUALIZAR PROPIEDADES DEL USUARIO
export const updateUserProperties = async (
  propertiesId: number,
  data: {
    user_id: number;
    stature?: number;
    weight?: number;
    objective?: string;
    somatotype_id?: number;
  },
  token: string
) => {
  return apiFetch(`${API_URL}/userProperties/${propertiesId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

// 👤 OBTENER USUARIO
export const getUser = async (id: number, token: string) => {
  return apiFetch(`${API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });
};

// 🏋️ OBTENER CONTEO DE RUTINAS DEL USUARIO
export const getUserRoutinesCount = async (id: number, token: string) => {
  return apiFetch(`${API_URL}/userRoutines/${id}/count`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });
};

// 🔥 OBTENER RACHA DEL USUARIO
export const getUserStreak = async (id: number, token: string) => {
  return apiFetch(`${API_URL}/userStreak/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });
};

// 📊 OBTENER PROPIEDADES DEL USUARIO
export const getUserProperties = async (id: number, token: string) => {
  return apiFetch(`${API_URL}/userProperties/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });
};

// 🏋️ OBTENER EJERCICIOS
export const getExercises = async (token: string) => {
  return apiFetch(`${API_URL}/exercises`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });
};

// 📋 OBTENER RUTINAS GENERALES
export const getRoutines = async (token: string) => {
  return apiFetch(`${API_URL}/routines`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });
};

// 📋 OBTENER RUTINAS DEL USUARIO
export const getUserRoutines = async (userId: number, token: string) => {
  return apiFetch(`${API_URL}/userRoutines/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });
};

// ➕ CREAR RUTINA DE USUARIO
export const createUserRoutine = async (
  data: {
    user_id: number;
    name: string;
    objective: string;
    level: string;
    category: string;
    duration: number;
    img?: string;
  },
  token: string
) => {
  return apiFetch(`${API_URL}/userRoutines`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

// ➕ AGREGAR EJERCICIO A RUTINA DE USUARIO
export const createUserRoutineExercise = async (
  data: {
    user_routine_id: number;
    exercise_id: number;
    sets: number;
    repetitions: number;
    seconds_rest: number;
  },
  token: string
) => {
  return apiFetch(`${API_URL}/userRoutineExercises`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

// 🗑️ ELIMINAR RUTINA DEL USUARIO
export const deleteUserRoutine = async (routineId: number, token: string) => {
  return apiFetch(`${API_URL}/userRoutines/${routineId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

// ✏️ ACTUALIZAR RUTINA DEL USUARIO
export const updateUserRoutine = async (
  routineId: number,
  data: {
    name?: string;
    objective?: string;
    level?: string;
    category?: string;
    duration?: number;
    img?: string;
  },
  token: string
) => {
  return apiFetch(`${API_URL}/userRoutines/${routineId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

// 🗑️ ELIMINAR EJERCICIO DE RUTINA
export const deleteUserRoutineExercise = async (exerciseId: number, token: string) => {
  return apiFetch(`${API_URL}/userRoutineExercises/${exerciseId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

// 💎 OBTENER SUSCRIPCIONES
export const getSubscriptions = async (token: string) => {
  return apiFetch(`${API_URL}/subscriptions`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

// 📋 OBTENER EJERCICIOS DE UNA RUTINA (app)
export const getRoutineExercises = async (routineId: number, token: string) => {
  return apiFetch(`${API_URL}/routines/${routineId}/exercises`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

// 📋 OBTENER EJERCICIOS DE UNA RUTINA DE USUARIO
export const getUserRoutineExercises = async (routineId: number, token: string) => {
  return apiFetch(`${API_URL}/userroutines/${routineId}/exercises`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

// 🏋️ OBTENER ARCHIVOS DE UN EJERCICIO
export const getExerciseFiles = async (exerciseId: number, token: string) => {
  return apiFetch(`${API_URL}/exercise-files/${exerciseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

// 🥗 OBTENER PLANES DE DIETA
export const getDietPlans = async (token: string) => {
  return apiFetch(`${API_URL}/dietPlans`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

// 👨‍⚕️ OBTENER PERFILES DE NUTRIÓLOGOS
export const getNutritionistProfiles = async (token: string) => {
  return apiFetch(`${API_URL}/nutritionistProfiles`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

// 🏃 CREAR SESIÓN DE RUTINA
export const createUserRoutineSession = async (
  data: {
    user_id: number;
    routine_id?: number | null;
    user_routine_id?: number | null;
    started_at: string;
    finished_at?: string;
  },
  token: string
) => {
  return apiFetch(`${API_URL}/userRoutineSessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

// 🏃 ACTUALIZAR SESIÓN DE RUTINA
export const updateUserRoutineSession = async (
  id: number,
  data: { finished_at: string },
  token: string
) => {
  return apiFetch(`${API_URL}/userRoutineSessions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

// 📝 CREAR LOG DE EJERCICIO
export const createExerciseLog = async (
  data: {
    user_id: number;
    exercise_id: number;
    weight_lifted: number;
    repetitions: number;
    sets: number;
    exercise_routine_id: number;
    user_routine_session_id: number;
    workout_date: string;
  },
  token: string
) => {
  return apiFetch(`${API_URL}/exerciseLogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

// 🔥 ACTUALIZAR RACHA DEL USUARIO
export const updateUserStreak = async (
  streakId: number,
  data: {
    user_id: number;
    current_streak: number;
    longest_streak: number;
    last_training_date: string;
  },
  token: string
) => {
  return apiFetch(`${API_URL}/userStreak/${streakId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

// 📅 OBTENER SESIONES DE RUTINA DEL USUARIO
export const getUserRoutineSessions = async (token: string) => {
  return apiFetch(`${API_URL}/userRoutineSessions`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

// 📊 OBTENER LOGS DE EJERCICIO DEL USUARIO
export const getExerciseLogs = async (token: string) => {
  return apiFetch(`${API_URL}/exerciseLogs`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

// 📅 OBTENER PLAN SEMANAL DEL USUARIO
export const getUserWeekPlan = async (token: string) => {
  return apiFetch(`${API_URL}/userWeekPlan`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

// 📅 ACTUALIZAR PLAN SEMANAL DEL USUARIO
export const updateUserWeekPlan = async (
  days: { day_index: number; type: string | null; routine_id?: number | null; user_routine_id?: number | null; routine_name?: string | null }[],
  token: string
) => {
  return apiFetch(`${API_URL}/userWeekPlan`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ days }),
  });
};

// 👥 OBTENER AMIGOS
export const getFriends = async (token: string) => {
  return apiFetch(`${API_URL}/friends`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
};

// 👥 OBTENER SOLICITUDES DE AMISTAD PENDIENTES
export const getFriendRequests = async (token: string) => {
  return apiFetch(`${API_URL}/friends/requests`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
};

// 👥 ENVIAR SOLICITUD DE AMISTAD
export const sendFriendRequest = async (userId: number, token: string) => {
  return apiFetch(`${API_URL}/friends/request/${userId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
};

// 👥 ACEPTAR SOLICITUD DE AMISTAD
export const acceptFriendRequest = async (id: number, token: string) => {
  return apiFetch(`${API_URL}/friends/accept/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
};

// 👥 RECHAZAR / ELIMINAR AMISTAD
export const removeFriend = async (id: number, token: string) => {
  return apiFetch(`${API_URL}/friends/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
};

// 🔍 BUSCAR USUARIOS
export const searchUsers = async (query: string, token: string) => {
  return apiFetch(`${API_URL}/search-users?search=${encodeURIComponent(query)}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
};

// 🔥 CREAR RACHA DEL USUARIO (si no existe)
export const createUserStreak = async (
  data: {
    user_id: number;
    current_streak: number;
    longest_streak: number;
    last_training_date: string;
  },
  token: string
) => {
  return apiFetch(`${API_URL}/userStreak`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};
