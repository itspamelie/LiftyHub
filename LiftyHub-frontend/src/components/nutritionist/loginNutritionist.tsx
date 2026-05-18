import { useState } from "react"
import React from "react"
import Swal from "sweetalert2"
import { Navigate, useNavigate, Link } from "react-router-dom"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"

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
  const [email, setEmail] = useState("nutriologo@example.com")
  const [password, setPassword] = useState("123")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem("token")
  const API_URL = import.meta.env.VITE_API_URL

  if (token && !isTokenExpired(token)) {
    const stored = localStorage.getItem("user")
    const role = stored ? JSON.parse(stored).role : null
    if (role === "nutritionist") return <Navigate to="/DashboardForExperts/" replace />
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
        if (data.user.role === "nutritionist") {
          navigate("/DashboardForExperts/")
        } else {
          navigate("/Liftyhub-Experts")
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Credenciales inválidas",
          text: "El correo o la contraseña no son correctos",
          background: "#141d2b",
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
        borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: -200, left: -200, width: 600, height: 600,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)",
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
        <Link to="/Liftyhub-Experts" style={{
          marginLeft: "auto", display: "flex", alignItems: "center", gap: 6,
          color: "#94a3b8", fontSize: 14, fontWeight: 500, textDecoration: "none",
          padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)",
          transition: "background .2s",
        }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = "transparent")}
        >← Volver</Link>
      </header>

      {/* Main */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 24px", position: "relative", zIndex: 1,
      }}>
        <div style={{
          width: "100%", maxWidth: 420,
          background: "#141d2b",
          border: "1px solid rgba(59,130,246,0.22)",
          borderRadius: 20,
          padding: "40px 36px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}>

          {/* Badge */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span style={{
              display: "inline-block",
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.25)",
              color: "#10B981",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
              padding: "4px 14px", borderRadius: 999, textTransform: "uppercase",
              marginBottom: 20,
            }}>Acceso Experts</span>

            <div style={{
              width: 64, height: 64, borderRadius: 16, overflow: "hidden",
              margin: "0 auto 14px",
              border: "1px solid rgba(59,130,246,0.25)",
            }}>
              <img src="/logo.jpg" alt="LiftyHub" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.5px" }}>
              Portal de Nutriólogos
            </h1>
            <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>
              Accede a tu panel profesional de LiftyHub
            </p>
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
            <div style={{ marginBottom: 22 }}>
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", background: loading ? "#1d4ed8" : "#3B82F6",
                border: "none", borderRadius: 10, padding: "13px",
                color: "white", fontWeight: 700, fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background .2s", opacity: loading ? 0.8 : 1,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#2563EB" }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#3B82F6" }}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <p style={{ textAlign: "center", color: "#475569", fontSize: 13, marginTop: 20, marginBottom: 0 }}>
            ¿Eres usuario de LiftyHub?{" "}
            <Link to="/login" style={{ color: "#3B82F6", textDecoration: "none", fontWeight: 600 }}>
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
