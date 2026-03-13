import { useState } from "react"
import React from "react"
import Swal from "sweetalert2"
import { Navigate } from "react-router-dom"

function isTokenExpired(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const now = Date.now() / 1000
    return payload.exp < now
  } catch {
    return true
  }
}
export default function Login(){

    

const [showPassword, setShowPassword] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("admin@example.com")
  const [password, setPassword] = useState<string>("123")
  const token = localStorage.getItem("token")

  if (token && !isTokenExpired(token)) {
    return <Navigate to="/dashboard" replace />
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

        if (data.user.role === "user" || data.user.role === "nutritionist") {
          <Navigate to="/Home" replace />
        } else {
          <Navigate to="/Dashboard" replace />
        }

      } else {
Swal.fire({
  icon: "error",
  title: "Credenciales inválidas",
  text: "El correo o la contraseña no son correctos",
  background: "#0f172a",
  color: "#ffffff",
  confirmButtonColor: "#2563eb",
  confirmButtonText: "Intentar de nuevo"
})
      }

    } catch (error) {
      console.log(error);
    }
  }

return(

<div className="login-page">

{/* HEADER */}

<header className="login-header">

<div className="logo">

<span className="logo-icon">🟦</span>
<span className="logo-text">LiftyHub</span>

</div>

</header>


{/* LOGIN CARD */}

<div className="login-container">
<div className="login-card">

<h2 className="text-center title">
Iniciar Sesión
</h2>

<p className="text-center subtitle">
¡Bienvenido de nuevo! Te hemos extrañado.
</p>


{/* BOTONES */}
<div className="social-buttons">

<button className="btn social-btn text-white w-100 d-flex align-items-center justify-content-center gap-2">

<i className="bi bi-google text-white"></i>

Iniciar con Google

</button>

<button className="btn social-btn w-100  text-white d-flex align-items-center justify-content-center gap-2">

<i className="bi bi-apple text-white"></i>

Iniciar con Apple

</button>
</div>

{/* DIVIDER */}
    <form onSubmit={submit}>

<div className="divider">
<span>O</span>
</div>


{/* EMAIL */}

<input
type="email"
className="login-input"
placeholder="correo@ejemplo.com"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>


{/* PASSWORD */}

<div className="password-box">

<input
type={showPassword ? "text":"password"}
className="login-input"
placeholder="Contraseña"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<span
className="eye"
onClick={()=>setShowPassword(!showPassword)}
>
👁
</span>


</div>


{/* OPCIONES */}

<div className="login-options">

<div className="form-check">

<input
className="form-check-input cursor-pointer"
type="checkbox"
id="recordarme"
/>

<label
className="form-check-label text-secondary "
htmlFor="recordarme"
>
Recordarme
</label>

</div>

<a className="text-primary small cursor-pointer">
¿Olvidaste tu contraseña?
</a>

</div>


<button className="login-button"  type="submit">
Iniciar Sesión
</button>
</form>


</div>

</div>

</div>

)

}