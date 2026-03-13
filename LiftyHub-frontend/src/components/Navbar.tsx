export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top border-bottom border-secondary">
      <div className="container">

        <a className="navbar-brand fw-bold d-flex align-items-center gap-2">
          <span style={{color:"#3B82F6"}}>✕</span>
          LiftyHub
        </a>

        <div className="ms-auto d-flex align-items-center gap-4">

          <a className="nav-link text-light">Features</a>
          <a className="nav-link text-light">Training</a>
          <a className="nav-link text-light">App Preview</a>

          <button className="btn btn-primary px-4">
            Download App
          </button>

        </div>
      </div>
    </nav>
  )
}