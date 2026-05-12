import { useState } from "react"
import React from "react"
import Swal from "sweetalert2"
import { Navigate, useNavigate, Link } from "react-router-dom"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import GoogleIcon from "@mui/icons-material/Google"
import AppleIcon from "@mui/icons-material/Apple"

function isTokenExpired(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const now = Date.now() / 1000
    return payload.exp < now
  } catch {
    return true
  }
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [email, setEmail] = useState("admin@example.com")
  const [password, setPassword] = useState("123")
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem("token")
  const API_URL = import.meta.env.VITE_API_URL

  if (token && !isTokenExpired(token)) {
    const stored = localStorage.getItem("user")
    const role = stored ? JSON.parse(stored).role : null
    if (role === "nutritionist") return <Navigate to="/DashboardForExperts/" replace />
    if (role === "admin") return <Navigate to="/dashboard" replace />
    return <Navigate to="/" replace />
  }
  if (token && isTokenExpired(token)) {
    localStorage.clear()
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(API_URL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        if (data.user.role === "user" || data.user.role === "nutritionist") {
          navigate("/home")
        } else {
          navigate("/dashboard")
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Credenciales inválidas",
          text: "El correo o la contraseña no son correctos",
          background: "#0f1623",
          color: "#ffffff",
          confirmButtonColor: "#3B82F6",
          confirmButtonText: "Intentar de nuevo",
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0b0f14", color: "white",
      fontFamily: "'Inter', system-ui, sans-serif",
      display: "flex", flexDirection: "column",
    }}>

      {/* Gradient blobs */}
      <div style={{
        position: "fixed", top: -200, right: -200, width: 600, height: 600,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: -200, left: -200, width: 600, height: 600,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Navbar */}
      <header style={{
        position: "relative", zIndex: 10, padding: "0 40px",
        display: "flex", alignItems: "center", height: 64,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/logo.jpg" alt="LiftyHub" style={{ height: 36, borderRadius: 9 }} />
          <span style={{ color: "white", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px", marginLeft: 10 }}>LiftyHub</span>
        </Link>
      </header>

      {/* Main */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 24px", position: "relative", zIndex: 1,
      }}>
        <div style={{
          width: "100%", maxWidth: 440,
          background: "#0f1623",
          border: "1px solid rgba(59,130,246,0.15)",
          borderRadius: 20,
          padding: "40px 36px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}>

          {/* Logo en card */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, overflow: "hidden",
              margin: "0 auto 14px",
              border: "1px solid rgba(59,130,246,0.25)",
            }}>
              <img src="/logo.jpg" alt="LiftyHub" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.5px" }}>
              Bienvenido de vuelta
            </h1>
            <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
              Inicia sesión en tu cuenta de LiftyHub
            </p>
          </div>

          {/* Social buttons */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <button style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, padding: "10px 0", color: "white", fontSize: 13,
              fontWeight: 600, cursor: "pointer", transition: "background .2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            >
              <GoogleIcon sx={{ fontSize: 17 }} /> Google
            </button>
            <button style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, padding: "10px 0", color: "white", fontSize: 13,
              fontWeight: 600, cursor: "pointer", transition: "background .2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            >
              <AppleIcon sx={{ fontSize: 17 }} /> Apple
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            <span style={{ color: "#475569", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em" }}>O</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Form */}
          <form onSubmit={submit}>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: "100%", background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, padding: "11px 14px",
                  color: "white", fontSize: 14, outline: "none",
                  boxSizing: "border-box", transition: "border-color .2s",
                }}
                onFocus={e => (e.target.style.borderColor = "rgba(59,130,246,0.6)")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
                Contraseña
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10, padding: "11px 44px 11px 14px",
                    color: "white", fontSize: 14, outline: "none",
                    boxSizing: "border-box", transition: "border-color .2s",
                  }}
                  onFocus={e => (e.target.style.borderColor = "rgba(59,130,246,0.6)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", color: "#64748b", cursor: "pointer",
                    display: "flex", alignItems: "center", padding: 0,
                  }}
                >
                  {showPassword
                    ? <VisibilityOffIcon sx={{ fontSize: 18 }} />
                    : <VisibilityIcon sx={{ fontSize: 18 }} />
                  }
                </button>
              </div>
            </div>

            {/* Options */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 22, fontSize: 13,
            }}>
              <label style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", color: "#94a3b8" }}>
                <input type="checkbox" style={{ accentColor: "#3B82F6" }} />
                Recordarme
              </label>
              <a href="#" style={{ color: "#3B82F6", textDecoration: "none", fontWeight: 500 }}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", background: loading ? "#1d4ed8" : "#3B82F6",
                border: "none", borderRadius: 10, padding: "13px",
                color: "white", fontWeight: 700, fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background .2s", letterSpacing: "0.01em",
                opacity: loading ? 0.8 : 1,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#2563EB" }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#3B82F6" }}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
