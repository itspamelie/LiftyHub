export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top navbar-custom">
      <div className="container">

        <a className="navbar-brand fw-bold d-flex align-items-center gap-2">
          <span style={{color:"#3B82F6"}}>✕</span>
          LiftyHub
        </a>

        <div className="ms-auto d-flex align-items-center gap-4">

          <a className="nav-link-custom" href="#funciones">Funciones</a>
          <a className="nav-link-custom" href="#entrenamientos">Entrenamientos</a>
          <a className="nav-link-custom" href="#la-app">La App</a>

          <button className="hero-btn-primary" style={{padding:"10px 24px", fontSize:"14px"}}>
            Descargar App
          </button>

        </div>
      </div>
    </nav>
  )
}