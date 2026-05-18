import React from "react";
import { useNavigate } from "react-router-dom";
import PaymentsIcon from "@mui/icons-material/Payments";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PublicIcon from "@mui/icons-material/Public";
const BENEFITS: { Icon: React.ElementType; title: string; desc: string }[] = [
  {
    Icon: PaymentsIcon,
    title: "Ingresos por cada dieta",
    desc: "Recibe pago directo por cada plan alimenticio que generes para tus clientes dentro de la plataforma.",
  },
  {
    Icon: DashboardIcon,
    title: "Gestión desde la app",
    desc: "Administra tus solicitudes, planes y clientes desde el dashboard web de LiftyHub Experts.",
  },
  {
    Icon: ScheduleIcon,
    title: "Trabaja a tu ritmo",
    desc: "Sin horarios fijos ni compromisos. Acepta las solicitudes que quieras cuando quieras.",
  },
  {
    Icon: PublicIcon,
    title: "Alcance nacional",
    desc: "Llega a usuarios de toda la república que buscan un nutriólogo certificado en su app fitness.",
  },
];

const STEPS = [
  { num: "01", title: "Crea tu perfil", desc: "Regístrate y sube tus credenciales como nutriólogo certificado." },
  { num: "02", title: "Recibe solicitudes", desc: "Los usuarios del plan Meal o Pro te contactan desde la app." },
  { num: "03", title: "Diseña el plan", desc: "Elabora el plan alimenticio personalizado desde tu dashboard." },
  { num: "04", title: "Cobra y crece", desc: "Recibe tu pago automáticamente al entregar el plan." },
];

export default function NutritionistJoin() {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#0b0f14", color: "white", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", minHeight: "100vh" }}>

      {/* NAVBAR */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(11,15,20,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px", display: "flex", height: 64, alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src="/logo.jpg" alt="LiftyHub" style={{ height: 38, borderRadius: 10 }} />
            <span style={{ color: "white", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px", marginLeft: 10 }}>LiftyHub</span>
            <span style={{
              marginLeft: 10, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
              background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)",
              color: "#10B981", padding: "3px 9px", borderRadius: 999,
            }}>EXPERTS</span>
          </a>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
              onClick={() => navigate("/Liftyhub-Experts-Login")}
              style={{
                background: "none", border: "none", color: "#94a3b8", fontSize: 14,
                fontWeight: 500, cursor: "pointer", padding: "8px 18px", borderRadius: 8,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
            >Iniciar sesión</button>
            <button
              onClick={() => navigate("/Liftyhub-Experts-Register")}
              style={{
                background: "#10B981", border: "none", color: "white", fontSize: 14,
                fontWeight: 700, cursor: "pointer", padding: "9px 22px", borderRadius: 8,
                transition: "background .2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#059669")}
              onMouseLeave={e => (e.currentTarget.style.background = "#10B981")}
            >Únete ahora</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{ padding: "100px 40px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Glow */}
        <div style={{
          position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 400, background: "rgba(16,185,129,0.08)",
          filter: "blur(100px)", borderRadius: "50%", pointerEvents: "none",
        }} />
        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
          <span style={{
            display: "inline-block", background: "rgba(16,185,129,0.12)",
            border: "1px solid rgba(16,185,129,0.3)", color: "#10B981",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
            padding: "5px 14px", borderRadius: 999, textTransform: "uppercase", marginBottom: 24,
          }}>LiftyHub Experts · Para Nutriólogos</span>

          <h1 style={{
            fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 900,
            lineHeight: 1.08, letterSpacing: "-1.5px", marginBottom: 24,
          }}>
            Monetiza tu expertise<br />
            <span style={{ color: "#10B981" }}>y gana por cada dieta</span>
          </h1>

          <p style={{ color: "#94a3b8", fontSize: 18, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.65 }}>
            Únete a la red de nutriólogos certificados de LiftyHub y ayuda a miles de atletas a alcanzar sus metas mientras generas ingresos.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/Liftyhub-Experts-Register")}
              style={{
                background: "#10B981", border: "none", color: "white",
                fontWeight: 700, fontSize: 16, cursor: "pointer",
                padding: "14px 36px", borderRadius: 10, transition: "background .2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#059669")}
              onMouseLeave={e => (e.currentTarget.style.background = "#10B981")}
            >Únete como Nutriólogo</button>
            <button
              onClick={() => navigate("/Liftyhub-Experts-Login")}
              style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                color: "white", fontWeight: 600, fontSize: 16, cursor: "pointer",
                padding: "14px 36px", borderRadius: 10, transition: "background .2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
            >Ya soy miembro →</button>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section style={{ padding: "80px 40px", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{
              display: "inline-block", background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.3)", color: "#10B981",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
              padding: "5px 14px", borderRadius: 999, textTransform: "uppercase", marginBottom: 16,
            }}>Beneficios</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.5px" }}>
              ¿Por qué unirte a LiftyHub?
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {BENEFITS.map(b => (
              <div key={b.title} style={{
                background: "#0f1623", border: "1px solid #1e2a3a",
                borderRadius: 16, padding: "28px 24px",
                transition: "border-color .2s, transform .2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(16,185,129,0.4)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1e2a3a"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, marginBottom: 14,
                  background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <b.Icon sx={{ fontSize: 22, color: "#10B981" }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{b.title}</h3>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.65, margin: 0 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "80px 40px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{
              display: "inline-block", background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.3)", color: "#10B981",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
              padding: "5px 14px", borderRadius: 999, textTransform: "uppercase", marginBottom: 16,
            }}>Cómo funciona</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.5px" }}>
              Empieza en 4 pasos
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {STEPS.map((s) => (
              <div key={s.num} style={{
                display: "flex", alignItems: "flex-start", gap: 20,
                background: "#0f1623", border: "1px solid #1e2a3a",
                borderRadius: 14, padding: "22px 24px",
              }}>
                <span style={{
                  fontSize: 13, fontWeight: 800, color: "#10B981",
                  background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)",
                  borderRadius: 8, padding: "4px 10px", flexShrink: 0, letterSpacing: "0.05em",
                }}>{s.num}</span>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>{s.title}</h3>
                  <p style={{ color: "#94a3b8", fontSize: 14, margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "0 40px 80px" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          background: "linear-gradient(135deg, #0d2318 0%, #0f1623 100%)",
          border: "1px solid rgba(16,185,129,0.25)",
          borderRadius: 20, padding: "60px 48px", textAlign: "center",
          boxShadow: "0 0 60px rgba(16,185,129,0.08)",
        }}>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 800, marginBottom: 14, letterSpacing: "-0.5px" }}>
            ¿Listo para empezar?
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 16, maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.65 }}>
            Únete a la red de nutriólogos de LiftyHub y comienza a generar ingresos ayudando a personas a mejorar su alimentación.
          </p>
          <button
            onClick={() => navigate("/Liftyhub-Experts-Register")}
            style={{
              background: "#10B981", border: "none", color: "white",
              fontWeight: 700, fontSize: 16, cursor: "pointer",
              padding: "14px 40px", borderRadius: 10, transition: "background .2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#059669")}
            onMouseLeave={e => (e.currentTarget.style.background = "#10B981")}
          >Registrarme como Nutriólogo</button>
        </div>
      </section>

      {/* FOOTER */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "24px 40px", textAlign: "center", color: "#475569", fontSize: 13,
      }}>
        <a href="/" style={{ color: "#475569", textDecoration: "none", marginRight: 20 }}>← Volver a LiftyHub</a>
        © {new Date().getFullYear()} LiftyHub · Todos los derechos reservados
      </div>
    </div>
  );
}
