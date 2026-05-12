import { useState } from "react";

const TABS = [
  {
    id: "movil",
    label: "App Móvil",
    img: "/fotos_app/pantallaRutinas.png",
    steps: [
      { title: "Descarga la app", desc: "Disponible para Android e iOS. Regístrate en segundos con tu correo o cuenta Google." },
      { title: "Crea tu perfil físico", desc: "Ingresa tu peso, altura, objetivos y somatotipo para recibir recomendaciones personalizadas." },
      { title: "Empieza a entrenar", desc: "Crea rutinas, registra sesiones y sigue tu progreso en tiempo real desde tu celular." },
    ],
  },
  {
    id: "progreso",
    label: "Tu Progreso",
    img: "/fotos_app/perfil.png",
    steps: [
      { title: "Registra cada sesión", desc: "Lleva el control de tus entrenamientos: series, repeticiones, peso levantado y tiempo de cada sesión." },
      { title: "Visualiza tu evolución", desc: "Consulta gráficas de progreso, racha de días activos y comparativas semana a semana." },
      { title: "Supera tus retos", desc: "Activa retos personales con duración personalizada y sube fotos de progreso para comparar tu transformación." },
    ],
  },
  {
    id: "nutri",
    label: "Para Nutriólogos",
    img: "/fotos_app/calendario.png",
    steps: [
      { title: "Accede al dashboard exclusivo", desc: "Los nutriólogos tienen su propio panel donde gestionan su perfil, calificaciones y pacientes." },
      { title: "Revisa solicitudes", desc: "Acepta o rechaza solicitudes de usuarios que quieren un plan de dieta personalizado." },
      { title: "Entrega planes de dieta", desc: "Diseña y entrega el plan alimenticio directamente en la plataforma para que el usuario lo reciba al instante." },
    ],
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState("movil");
  const tab = TABS.find(t => t.id === active)!;

  return (
    <section id="como-funciona" style={{ padding: "90px 40px", background: "rgba(255,255,255,0.015)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{
            display: "inline-block", background: "rgba(59,130,246,0.12)",
            border: "1px solid rgba(59,130,246,0.3)", color: "#3B82F6",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
            padding: "5px 14px", borderRadius: 999, textTransform: "uppercase", marginBottom: 16,
          }}>Cómo funciona</span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, marginBottom: 14, letterSpacing: "-0.5px" }}>
            Simple de usar, resultados reales
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 17, maxWidth: 550, margin: "0 auto", lineHeight: 1.6 }}>
            LiftyHub está diseñada para que empieces en minutos y veas resultados desde el primer día.
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", background: "#0f1623", borderRadius: 12,
          padding: 4, gap: 4, marginBottom: 40, maxWidth: 480, margin: "0 auto 40px",
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)} style={{
              flex: 1, padding: "10px 12px", borderRadius: 9, border: "none",
              background: active === t.id ? "#3B82F6" : "transparent",
              color: active === t.id ? "white" : "#94a3b8",
              fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all .2s",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>

          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {tab.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 16 }}>
                <div style={{
                  flexShrink: 0, width: 40, height: 40, borderRadius: "50%",
                  background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#3B82F6", fontWeight: 800, fontSize: 15,
                }}>{i + 1}</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{step.title}</h3>
                  <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Screenshot */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              borderRadius: 24, overflow: "hidden",
              border: "2px solid rgba(59,130,246,0.2)",
              boxShadow: "0 8px 60px rgba(59,130,246,0.2)",
              maxWidth: 260,
            }}>
              <img src={tab.img} alt="" style={{ width: "100%", display: "block" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
