import { useState } from "react";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);

    // aquí luego conectarías con tu API
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      
      <div className="card p-4 shadow" style={{width:"400px"}}>
        
        <h3 className="text-center mb-4">Login</h3>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              className="form-control"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="********"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100">
            Iniciar sesión
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;