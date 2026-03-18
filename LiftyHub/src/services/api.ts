const API_URL = process.env.EXPO_PUBLIC_API_URL;

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

// 👤 OBTENER USUARIO
export const getUser = async (id: number, token: string) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  return res.json();
};

// 📊 OBTENER PROPIEDADES DEL USUARIO
export const getUserProperties = async (id: number, token: string) => {
  const res = await fetch(`${API_URL}/userProperties/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  return res.json();
};