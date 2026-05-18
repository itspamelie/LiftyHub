import { useState } from "react";

function getSession() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp < Date.now() / 1000) { localStorage.clear(); return null; }
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user;
  } catch { return null; }
}

function getDashboardPath(role: string) {
  if (role === "nutritionist") return "/DashboardForExperts/";
  if (role === "admin") return "/dashboard";
  return null;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const session = getSession();
  const dashboardPath = session ? getDashboardPath(session.role) : null;

  const links = [
    { href: "#funciones", label: "Funciones" },
    { href: "#como-funciona", label: "Cómo funciona" },
    { href: "#opiniones", label: "Opiniones" },
    { href: "#planes", label: "Planes" },
    { href: "#faq", label: "FAQ" },
    { href: "/Liftyhub-Experts", label: "Únete a nosotros" },
  ];

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50, width: "100%",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(11,15,20,0.85)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px", display: "flex", height: 64, alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <a href="#" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/logo.jpg" alt="LiftyHub" style={{ height: 38, borderRadius: 10 }} />
          <span style={{ color: "white", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px", marginLeft: 10 }}>LiftyHub</span>
        </a>

        {/* Nav desktop */}
        <nav style={{ display: "flex", gap: 28 }} className="d-none d-md-flex">
          {links.map(l => (
            <a key={l.href} href={l.href} style={{
              color: "#94a3b8", fontSize: 15, fontWeight: 500, textDecoration: "none",
              transition: "color .2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#3B82F6")}
            onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}
            >{l.label}</a>
          ))}
        </nav>

        {/* Buttons desktop */}
        <div className="d-none d-md-flex" style={{ gap: 12, display: "flex", alignItems: "center" }}>
          {dashboardPath ? (
            <a href={dashboardPath} style={{
              color: "#94a3b8", fontSize: 14, fontWeight: 500, textDecoration: "none",
              padding: "8px 18px", borderRadius: 8, transition: "background .2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >Mi dashboard</a>
          ) : (
            <a href="/login" style={{
              color: "#94a3b8", fontSize: 14, fontWeight: 500, textDecoration: "none",
              padding: "8px 18px", borderRadius: 8, transition: "background .2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >Iniciar sesión</a>
          )}
          <a href="#descarga" style={{
            background: "#3B82F6", color: "#fff", fontSize: 14, fontWeight: 700,
            padding: "9px 22px", borderRadius: 8, textDecoration: "none",
            transition: "background .2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#2563EB")}
          onMouseLeave={e => (e.currentTarget.style.background = "#3B82F6")}
          >Descargar</a>
        </div>

        {/* Hamburger */}
        <button className="d-md-none" onClick={() => setMenuOpen(!menuOpen)} style={{
          background: "none", border: "none", color: "white", fontSize: 24, cursor: "pointer", padding: 4,
        }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: "#0f1419", borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "16px 24px 24px",
        }}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{
              display: "block", color: "#94a3b8", fontSize: 16, fontWeight: 500,
              textDecoration: "none", padding: "12px 0",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}>{l.label}</a>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
            <a href={dashboardPath ?? "/login"} style={{
              textAlign: "center", background: "rgba(255,255,255,0.06)", color: "white",
              padding: "11px", borderRadius: 8, textDecoration: "none", fontWeight: 500,
            }}>{dashboardPath ? "Mi dashboard" : "Iniciar sesión"}</a>
            <a href="#descarga" style={{
              textAlign: "center", background: "#3B82F6", color: "white",
              padding: "11px", borderRadius: 8, textDecoration: "none", fontWeight: 700,
            }}>Descargar gratis</a>
          </div>
        </div>
      )}
    </header>
  );
}
