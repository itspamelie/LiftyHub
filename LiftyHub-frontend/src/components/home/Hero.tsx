import DownloadIcon from "@mui/icons-material/Download";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";

export default function Hero() {
  return (
    <section style={{ position: "relative", overflow: "hidden", padding: "100px 40px 80px", textAlign: "center" }}>

      <div style={{
        position: "absolute", top: -120, right: -120, width: 500, height: 500,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -120, left: -120, width: 500, height: 500,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>

        <div style={{ marginBottom: 24 }}>
          <span style={{
            display: "inline-block", background: "rgba(59,130,246,0.12)",
            border: "1px solid rgba(59,130,246,0.3)", color: "#3B82F6",
            fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
            padding: "6px 16px", borderRadius: 999, textTransform: "uppercase",
          }}>Versión 1.0 disponible</span>
        </div>

        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 20, letterSpacing: "-1px" }}>
          La app de fitness para<br />
          <span style={{ color: "#3B82F6" }}>atletas serios</span>
        </h1>

        <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 580, margin: "0 auto 36px", lineHeight: 1.7 }}>
          Crea tus rutinas, registra ejercicios, lleva tu dieta y visualiza tu progreso — todo en un solo lugar.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
          <a href="#" style={{
            background: "#3B82F6", color: "#fff", fontWeight: 700, fontSize: 15,
            padding: "14px 32px", borderRadius: 10, textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 8,
            boxShadow: "0 4px 24px rgba(59,130,246,0.35)",
          }}>
            <DownloadIcon sx={{ fontSize: 18 }} /> Descargar gratis
          </a>
          <a href="#funciones" style={{
            background: "rgba(255,255,255,0.05)", color: "#fff", fontWeight: 600, fontSize: 15,
            padding: "14px 32px", borderRadius: 10, textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.12)",
            display: "inline-flex", alignItems: "center", gap: 8,
          }}>
            Ver funciones <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </a>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 64 }}>
          <div style={{ display: "flex" }}>
            {[1,2,3,4,5].map(i => <StarIcon key={i} sx={{ fontSize: 18, color: "#FBBF24" }} />)}
          </div>
          <span style={{ color: "#94a3b8", fontSize: 14 }}>
            <strong style={{ color: "white" }}>4.9/5</strong> · Más de 10,000 usuarios activos
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          {[
            "/fotos_app/pantallaRutinas.png",
            "/fotos_app/perfil.png",
            "/fotos_app/pantallaEjercicios.png",
          ].map(src => (
            <div key={src} style={{
              borderRadius: 24, overflow: "hidden",
              border: "2px solid rgba(59,130,246,0.2)",
              boxShadow: "0 8px 40px rgba(59,130,246,0.15)",
              width: 200, flexShrink: 0,
            }}>
              <img src={src} alt="" style={{ width: "100%", display: "block" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
