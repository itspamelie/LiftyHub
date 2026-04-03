import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Función centralizada — si el token es inválido, limpia y manda al login
const apiFetch = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, options);
  const data = await res.json();

  if (data.error === "Unauthorized" || res.status === 401) {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/auth/login");
    return null;
  }

  return data;
};

// 🔐 LOGIN
export const loginRequest = async (email: string, password: string) => {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("RESPUESTA DEL BACKEND:", data);
    return data;

  } catch (error) {
    console.log("Error en loginRequest:", error);
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
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(data),
    });
    const text = await res.text();
    console.log("REGISTER RESPONSE:", text);
    return JSON.parse(text);
  } catch (error) {
    console.log("Error en registerRequest:", error);
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
  return apiFetch(`${API_URL}/exercise-routines/${routineId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

// 📋 OBTENER EJERCICIOS DE UNA RUTINA DE USUARIO
export const getUserRoutineExercises = async (routineId: number, token: string) => {
  return apiFetch(`${API_URL}/userRoutineExercises/${routineId}`, {
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
