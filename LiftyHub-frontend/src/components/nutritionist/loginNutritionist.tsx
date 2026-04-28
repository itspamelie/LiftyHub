import {
  Box,
  Typography,
  TextField,
  Button
} from "@mui/material";
import { useState } from "react"
import React from "react"
import Swal from "sweetalert2"
import { Navigate,useNavigate } from "react-router-dom";


function isTokenExpired(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const now = Date.now() / 1000
    return payload.exp < now
  } catch {
    return true
  }
}    
export default function LoginPage() {
       
    
    const navigate = useNavigate()
    const [email, setEmail] = useState<string>("admin@example.com")
    const [password, setPassword] = useState<string>("123")
    const token = localStorage.getItem("token")
    
      if (token && !isTokenExpired(token)) {
        return <Navigate to="/LiftyHub-Experts" replace />
      }
    
      if (token && isTokenExpired(token)) {
        localStorage.clear()
      }
    
    
    
    const submit = async (e: React.FormEvent) => {
            e.preventDefault()
        try {
          const res = await fetch("http://localhost:8000/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
    
            body: JSON.stringify({
              email: email,
              password: password
            }),
    
          });
    
          const data = await res.json()
          console.log("RESPUESTA", data);
    
          if (res.ok && data.token) {
    
            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))
    
            if (data.user.role === "user" || data.user.role === "admin") {
      navigate("/Liftyhub-Experts")
            } else {
      navigate("/DashboardForExperts/")
            }
    
          } else {
    Swal.fire({
      icon: "error",
      title: "Credenciales inválidas",
      text: "El correo o la contraseña no son correctos",
      background: "#111",
      color: "#ffffff",
      confirmButtonColor: "#3a8dff",
      confirmButtonText: "Intentar de nuevo"
    })
          }
    
        } catch (error) {
          console.log(error);
        }
      }
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Box
        sx={{
          width: 350,
          display: "flex",
          flexDirection: "column",
          gap: 3
        }}
      >
<form
  onSubmit={submit}
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  }}
>
        {/* Logo */}
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "28px",
            fontWeight: "bold",
            color: "#3a8dff",
            mb: 2
          }}
        >
          LiftyHub Experts
        </Typography>

        {/* Email */}
        <TextField
          fullWidth
          placeholder="Correo electrónico"
value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          InputProps={{
            sx: {
              bgcolor: "#111",
              color: "#fff",
              borderRadius: "10px",
              "& fieldset": {
                borderColor: "#222"
              },
              "&:hover fieldset": {
                borderColor: "#333"
              },
              "&.Mui-focused fieldset": {
                borderColor: "#3a8dff"
              }
            }
          }}
        />

        {/* Password */}
        <TextField
          fullWidth
          type="password"
value={password || ""}
           onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          variant="outlined"
          InputProps={{
            sx: {
              bgcolor: "#111",
              color: "#fff",
              borderRadius: "10px",
              "& fieldset": {
                borderColor: "#222"
              },
              "&:hover fieldset": {
                borderColor: "#333"
              },
              "&.Mui-focused fieldset": {
                borderColor: "#3a8dff"
              }
            }
          }}
        />

        {/* Button */}
        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{
            mt: 1,
            py: 1.5,
            borderRadius: "10px",
            fontWeight: "bold",
            textTransform: "none",
            background: "#3a8dff",
            "&:hover": {
              background: "#2f74d9"
            }
          }}
        >
          Iniciar sesión
        </Button>

        {/* Register */}
        <Typography
          sx={{
            textAlign: "center",
            color: "#777",
            fontSize: "14px"
          }}
        >
          ¿No tienes cuenta?{" "}
          <Box
            component="span"
            sx={{
              color: "#3a8dff",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Crear cuenta

          </Box>
        </Typography>
        </form>
      </Box>
      
    </Box>
    
  );
}