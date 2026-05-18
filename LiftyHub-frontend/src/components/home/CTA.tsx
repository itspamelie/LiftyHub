import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AppleIcon from "@mui/icons-material/Apple";
import AndroidIcon from "@mui/icons-material/Android";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { Dialog, DialogContent, IconButton } from "@mui/material";

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

const PLAN_HEADERS = [
  { name: "Free",  color: "#A1A1A1" },
  { name: "Basic", color: "#3B82F6" },
  { name: "Meal",  color: "#10B981" },
  { name: "Pro",   color: "#F59E0B" },
];

const COMPARE_ROWS = [
  { label: "Rutinas propias",     values: ["7", "20", "20", "∞"] },
  { label: "Rutinas de la app",   values: [false, true, true, true] },
  { label: "Catálogo ejercicios", values: [true, true, true, true] },
  { label: "Escanear QR",         values: ["1/mes", "5/mes", "10/mes", "∞"] },
  { label: "Compartir QR",        values: ["1/mes", "5/mes", "10/mes", "∞"] },
  { label: "Estadísticas",        values: [false, true, true, true] },
  { label: "Músculos trabajados", values: ["7 días", true, true, true] },
  { label: "Nutriólogo",          values: [false, false, true, true] },
  { label: "Plan de dieta",       values: [false, false, true, true] },
  { label: "Suplementos",         values: [false, false, true,  true] },
  { label: "Generar rutina con IA", values: [false, false, false, true] },
  { label: "Hidratación",          values: [false, false, false, true] },
];

const FAQS = [
  { q: "¿LiftyHub es gratis?", a: "Sí, LiftyHub tiene un plan gratuito permanente con acceso a funciones básicas. Los planes de pago desbloquean rutinas ilimitadas, estadísticas, nutriólogo y más." },
  { q: "¿En qué dispositivos está disponible?", a: "LiftyHub está disponible como app para Android e iOS, y también tiene un dashboard web para nutriólogos y administradores." },
  { q: "¿Cómo funciona el plan con nutriólogo?", a: "Con los planes Meal y Pro puedes solicitar un nutriólogo certificado de nuestra plataforma. El nutriólogo diseña tu plan alimenticio personalizado directamente en la app." },
  { q: "¿Puedo compartir mis rutinas?", a: "Sí. Puedes compartir cualquier rutina generando un código QR único. Tus amigos solo tienen que escanearlo para importarla a su cuenta." },
  { q: "¿Cómo cancelo mi suscripción?", a: "Puedes cancelar tu suscripción en cualquier momento desde la sección de configuración dentro de la app. Conservas el acceso hasta el final del período pagado." },
  { q: "¿Mis datos están seguros?", a: "Sí. Toda la información se transmite encriptada y los datos personales no son compartidos con terceros bajo ninguna circunstancia." },
];

export default function CTA() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);

  const scrollToDownload = () => {
    document.getElementById("descarga")?.scrollIntoView({ behavior: "smooth" });
  };

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
                <button
                  onClick={scrollToDownload}
                  style={{
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

          {/* Compare button */}
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <button
              onClick={() => setCompareOpen(true)}
              style={{
                background: "transparent",
                border: "1px solid rgba(59,130,246,0.35)",
                borderRadius: 10, padding: "11px 28px",
                color: "#3B82F6", fontWeight: 600, fontSize: 14,
                cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
                transition: "background .2s, border-color .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.08)"; e.currentTarget.style.borderColor = "rgba(59,130,246,0.6)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(59,130,246,0.35)"; }}
            >
              <CompareArrowsIcon sx={{ fontSize: 17 }} /> Comparar todos los planes
            </button>
          </div>
        </div>
      </section>

      {/* COMPARE DIALOG */}
      <Dialog
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: "#0f1623",
            border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: "20px",
            color: "white",
          },
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: "-0.4px" }}>Comparar planes</h3>
              <p style={{ margin: "5px 0 0", color: "#64748b", fontSize: 13 }}>Todas las funciones en detalle</p>
            </div>
            <IconButton onClick={() => setCompareOpen(false)} sx={{ color: "#475569", "&:hover": { color: "#fff" } }}>
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "10px 16px", color: "#475569", fontSize: 12, fontWeight: 600, width: "38%" }}>
                    Función
                  </th>
                  {PLAN_HEADERS.map(p => (
                    <th key={p.name} style={{ textAlign: "center", padding: "10px 12px", minWidth: 80 }}>
                      <div style={{ color: p.color, fontSize: 13, fontWeight: 800 }}>{p.name}</div>
                      {p.name === "Pro" && (
                        <div style={{
                          display: "inline-block", marginTop: 4,
                          background: p.color, color: "white",
                          fontSize: 9, fontWeight: 800, padding: "2px 7px",
                          borderRadius: 4, letterSpacing: "0.06em",
                        }}>POPULAR</div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={i} style={{
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
                  }}>
                    <td style={{ padding: "13px 16px", fontSize: 13, color: "#cbd5e1", fontWeight: 500 }}>
                      {row.label}
                    </td>
                    {(row.values as (boolean | string)[]).map((val, vi) => (
                      <td key={vi} style={{ textAlign: "center", padding: "13px 12px" }}>
                        {val === true ? (
                          <CheckIcon sx={{ fontSize: 18, color: "#22c55e" }} />
                        ) : val === false ? (
                          <span style={{ color: "#2d3748", fontSize: 18, fontWeight: 700 }}>—</span>
                        ) : (
                          <span style={{
                            color: PLAN_HEADERS[vi].color,
                            fontSize: 12, fontWeight: 700,
                            background: `${PLAN_HEADERS[vi].color}18`,
                            padding: "3px 8px", borderRadius: 6,
                          }}>{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button
              onClick={() => { setCompareOpen(false); scrollToDownload(); }}
              style={{
                background: "#3B82F6", border: "none", borderRadius: 10,
                padding: "12px 32px", color: "white", fontWeight: 700,
                fontSize: 14, cursor: "pointer", transition: "background .2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#2563EB")}
              onMouseLeave={e => (e.currentTarget.style.background = "#3B82F6")}
            >
              Descargar LiftyHub
            </button>
          </div>
        </DialogContent>
      </Dialog>

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
      <section id="descarga" style={{
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
