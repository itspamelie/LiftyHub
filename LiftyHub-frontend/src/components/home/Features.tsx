import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import BarChartIcon from "@mui/icons-material/BarChart";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import type { SvgIconComponent } from "@mui/icons-material";

const FEATURES: { icon: SvgIconComponent; title: string; desc: string }[] = [
  { icon: FitnessCenterIcon, title: "Rutinas personalizadas", desc: "Crea y organiza tus rutinas de entrenamiento con ejercicios, series y repeticiones a tu medida." },
  { icon: MenuBookIcon, title: "Catálogo de ejercicios", desc: "Accede a cientos de ejercicios con guías visuales, músculos trabajados y variantes." },
  { icon: RestaurantIcon, title: "Plan de dieta", desc: "Conéctate con un nutriólogo certificado que diseñe tu plan alimenticio personalizado." },
  { icon: BarChartIcon, title: "Estadísticas y progreso", desc: "Visualiza tu racha, peso levantado, tiempo de entrenamiento y evolución semana a semana." },
  { icon: QrCodeScannerIcon, title: "Compartir por QR", desc: "Comparte tus rutinas con amigos en segundos escaneando un código QR único." },
  { icon: PersonOutlineIcon, title: "Perfil físico completo", desc: "Registra tu peso, altura, somatotipo y metas para un seguimiento real de tu transformación." },
];

export default function Features() {
  return (
    <section id="funciones" style={{ padding: "90px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{
            display: "inline-block", background: "rgba(59,130,246,0.12)",
            border: "1px solid rgba(59,130,246,0.3)", color: "#3B82F6",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
            padding: "5px 14px", borderRadius: 999, textTransform: "uppercase", marginBottom: 16,
          }}>Funciones</span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, marginBottom: 14, letterSpacing: "-0.5px" }}>
            Todo lo que necesitas en una app
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 17, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            Diseñada para atletas, construida para resultados reales.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {FEATURES.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} style={{
                background: "#0f1623", border: "1px solid #1e2a3a",
                borderRadius: 16, padding: "28px 24px",
                transition: "border-color .2s, transform .2s", cursor: "default",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#3B82F6"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1e2a3a"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
                }}>
                  <Icon sx={{ fontSize: 26, color: "#3B82F6" }} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
