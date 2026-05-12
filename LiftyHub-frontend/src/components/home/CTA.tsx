import CheckIcon from "@mui/icons-material/Check";
import AppleIcon from "@mui/icons-material/Apple";
import AndroidIcon from "@mui/icons-material/Android";

const PLANS = [
  {
    name: "Free", price: "$0", period: "/siempre", color: "#A1A1A1",
    desc: "Para empezar tu camino fitness",
    features: ["7 rutinas propias", "Catálogo de ejercicios", "Escanear QR (1/mes)", "Músculos trabajados (7 días)"],
    popular: false, btn: "Empezar gratis",
  },
  {
    name: "Basic", price: "$79", period: "/mes", color: "#3B82F6",
    desc: "Para usuarios comprometidos",
    features: ["20 rutinas propias", "Rutinas de la app", "Escanear QR (5/mes)", "Estadísticas completas"],
    popular: false, btn: "Elegir Basic",
  },
  {
    name: "Meal", price: "$149", period: "/mes", color: "#10B981",
    desc: "Con nutriólogo y plan de dieta",
    features: ["Todo lo de Basic", "Escanear QR (10/mes)", "Nutriólogo personal", "Plan de dieta", "Suplementos"],
    popular: false, btn: "Elegir Meal",
  },
  {
    name: "Pro", price: "$229", period: "/mes", color: "#F59E0B",
    desc: "La experiencia completa sin límites",
    features: ["Rutinas ilimitadas", "QR ilimitado", "Nutriólogo personal", "Plan de dieta", "Estadísticas avanzadas"],
    popular: true, btn: "Elegir Pro",
  },
];

const FAQS = [
  { q: "¿LiftyHub es gratis?", a: "Sí, LiftyHub tiene un plan gratuito permanente con acceso a funciones básicas. Los planes de pago desbloquean rutinas ilimitadas, estadísticas, nutriólogo y más." },
  { q: "¿En qué dispositivos está disponible?", a: "LiftyHub está disponible como app para Android e iOS, y también tiene un dashboard web para nutriólogos y administradores." },
  { q: "¿Cómo funciona el plan con nutriólogo?", a: "Con los planes Meal y Pro puedes solicitar un nutriólogo certificado de nuestra plataforma. El nutriólogo diseña tu plan alimenticio personalizado directamente en la app." },
  { q: "¿Puedo compartir mis rutinas?", a: "Sí. Puedes compartir cualquier rutina generando un código QR único. Tus amigos solo tienen que escanearlo para importarla a su cuenta." },
  { q: "¿Cómo cancelo mi suscripción?", a: "Puedes cancelar tu suscripción en cualquier momento desde la sección de configuración dentro de la app. Conservas el acceso hasta el final del período pagado." },
  { q: "¿Mis datos están seguros?", a: "Sí. Toda la información se transmite encriptada y los datos personales no son compartidos con terceros bajo ninguna circunstancia." },
];

import { useState } from "react";

export default function CTA() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* PRICING */}
      <section id="planes" style={{ padding: "90px 40px", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{
              display: "inline-block", background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.3)", color: "#3B82F6",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
              padding: "5px 14px", borderRadius: 999, textTransform: "uppercase", marginBottom: 16,
            }}>Planes</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, marginBottom: 14, letterSpacing: "-0.5px" }}>
              Precios simples y transparentes
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 17, maxWidth: 550, margin: "0 auto" }}>
              Elige el plan que mejor se adapte a tu ritmo. Todos incluyen acceso a la app.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {PLANS.map(plan => (
              <div key={plan.name} style={{
                background: "#0f1623",
                border: `1px solid ${plan.popular ? plan.color : "#1e2a3a"}`,
                borderRadius: 16, padding: "28px 22px", position: "relative",
                boxShadow: plan.popular ? `0 0 30px ${plan.color}22` : "none",
              }}>
                {plan.popular && (
                  <div style={{
                    position: "absolute", top: 0, right: 0,
                    background: plan.color, color: "white",
                    fontSize: 10, fontWeight: 800, padding: "5px 12px",
                    borderRadius: "0 16px 0 8px", letterSpacing: "0.08em",
                  }}>MÁS POPULAR</div>
                )}
                <div style={{ color: plan.color, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{plan.name}</div>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 38, fontWeight: 800 }}>{plan.price}</span>
                  <span style={{ color: "#94a3b8", fontSize: 14 }}>{plan.period}</span>
                </div>
                <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 20 }}>{plan.desc}</p>
                <button style={{
                  width: "100%", padding: "11px", borderRadius: 9, border: "none",
                  background: plan.popular ? plan.color : "rgba(255,255,255,0.07)",
                  color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer",
                  marginBottom: 20, transition: "opacity .2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >{plan.btn}</button>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: "#cbd5e1" }}>
                      <CheckIcon sx={{ fontSize: 15, color: "#22c55e", marginTop: "2px", flexShrink: 0 }} /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "90px 40px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{
              display: "inline-block", background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.3)", color: "#3B82F6",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
              padding: "5px 14px", borderRadius: 999, textTransform: "uppercase", marginBottom: 16,
            }}>FAQ</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, marginBottom: 14, letterSpacing: "-0.5px" }}>
              Preguntas frecuentes
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 17, maxWidth: 500, margin: "0 auto" }}>
              Respuestas a las dudas más comunes sobre LiftyHub.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                background: "#0f1623", border: "1px solid #1e2a3a", borderRadius: 12, overflow: "hidden",
              }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: "100%", padding: "18px 20px", background: "none", border: "none",
                  color: "white", fontWeight: 600, fontSize: 15, textAlign: "left",
                  cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  {faq.q}
                  <span style={{ color: "#3B82F6", fontSize: 18, flexShrink: 0, marginLeft: 12 }}>
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 20px 18px", color: "#94a3b8", fontSize: 14, lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{
        margin: "0 40px 80px", borderRadius: 20,
        background: "linear-gradient(135deg, #1a2744 0%, #0f1623 100%)",
        border: "1px solid rgba(59,130,246,0.25)",
        boxShadow: "0 0 60px rgba(59,130,246,0.1)",
        padding: "60px 48px",
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
          <div>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 800, marginBottom: 12, letterSpacing: "-0.5px" }}>
              ¿Listo para transformarte?
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 16, maxWidth: 480, lineHeight: 1.6, margin: 0 }}>
              Únete a miles de atletas que ya usan LiftyHub para alcanzar sus metas. Descarga gratis hoy.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="#" style={{
              background: "#3B82F6", color: "white", fontWeight: 700, fontSize: 14,
              padding: "13px 28px", borderRadius: 10, textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}><AppleIcon sx={{ fontSize: 18 }} /> App Store</a>
            <a href="#" style={{
              background: "rgba(255,255,255,0.07)", color: "white", fontWeight: 700, fontSize: 14,
              padding: "13px 28px", borderRadius: 10, textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}><AndroidIcon sx={{ fontSize: 18 }} /> Google Play</a>
          </div>
        </div>
      </section>
    </>
  );
}
