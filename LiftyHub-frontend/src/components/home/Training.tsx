const TESTIMONIALS = [
  { name: "Carlos M.", role: "Entrenador personal", content: "LiftyHub cambió la forma en que llevo mis rutinas. Todo en un solo lugar y con un diseño increíble.", rating: 5 },
  { name: "Fernanda R.", role: "Atleta amateur", content: "Las estadísticas de progreso son justo lo que necesitaba. Puedo ver mi evolución semana a semana.", rating: 5 },
  { name: "Diego L.", role: "Estudiante universitario", content: "Me encanta lo fácil que es crear rutinas y compartirlas con mis amigos por QR. Súper práctico.", rating: 5 },
  { name: "Sofía G.", role: "Nutrióloga", content: "El dashboard para nutriólogos está muy bien pensado. Puedo gestionar mis pacientes desde cualquier lugar.", rating: 5 },
  { name: "Andrés T.", role: "Powerlifter", content: "El registro de peso levantado y las rachas me mantienen motivado. Ya no falto ni un día al gym.", rating: 4 },
  { name: "Valeria H.", role: "Instructora de yoga", content: "La app es intuitiva y el soporte es excelente. La recomiendo a todos mis alumnos.", rating: 5 },
];

export default function Testimonials() {
  return (
    <section id="opiniones" style={{ padding: "90px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{
            display: "inline-block", background: "rgba(59,130,246,0.12)",
            border: "1px solid rgba(59,130,246,0.3)", color: "#3B82F6",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
            padding: "5px 14px", borderRadius: 999, textTransform: "uppercase", marginBottom: 16,
          }}>Opiniones</span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, marginBottom: 14, letterSpacing: "-0.5px" }}>
            Amado por miles de atletas
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 17, maxWidth: 550, margin: "0 auto" }}>
            Mira lo que dicen nuestros usuarios sobre su experiencia con LiftyHub.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{
              background: "#0f1623", border: "1px solid #1e2a3a",
              borderRadius: 16, padding: "24px",
            }}>
              <div style={{ display: "flex", marginBottom: 12 }}>
                {[1,2,3,4,5].map(i => (
                  <span key={i} style={{ color: i <= t.rating ? "#FBBF24" : "#374151", fontSize: 16 }}>★</span>
                ))}
              </div>
              <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.7, fontStyle: "italic", marginBottom: 20 }}>
                "{t.content}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#3B82F6", fontWeight: 700, fontSize: 14,
                }}>
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                  <div style={{ color: "#94a3b8", fontSize: 12 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
