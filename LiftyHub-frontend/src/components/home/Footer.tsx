import XIcon from "@mui/icons-material/X";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import type { SvgIconComponent } from "@mui/icons-material";

const SOCIAL: { Icon: SvgIconComponent; href: string }[] = [
  { Icon: XIcon, href: "#" },
  { Icon: FacebookIcon, href: "#" },
  { Icon: InstagramIcon, href: "#" },
  { Icon: LinkedInIcon, href: "#" },
];

export default function Footer() {
    const COLS = [
    {
      title: "Producto",
      links: ["Funciones", "Planes", "Opiniones", "FAQ", "Descargar"],
      hrefs: ["#funciones", "#planes", "#opiniones", "#faq", "#"],
    },
    {
      title: "Empresa",
      links: ["Sobre nosotros", "Blog", "Prensa", "Trabaja con nosotros"],
      hrefs: ["#", "#", "#", "#"],
    },
    {
      title: "Legal",
      links: ["Política de privacidad", "Términos de servicio", "Cookies"],
      hrefs: ["/politica-de-privacidad", "#", "#"],
    },
  ];

  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "60px 40px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>

          {/* Brand col */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <img src="/logo.jpg" alt="LiftyHub" style={{ height: 42, borderRadius: 10 }} />
              <span style={{ color: "white", fontWeight: 800, fontSize: 20, letterSpacing: "-0.5px" }}>LiftyHub</span>
            </div>
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
              La app de fitness para atletas serios. Crea rutinas, registra progreso y alcanza tus metas.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {SOCIAL.map(({ Icon, href }, i) => (
                <a key={i} href={href} style={{
                  width: 36, height: 36, borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  textDecoration: "none", color: "#64748b",
                  transition: "background .2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#3B82F6"; e.currentTarget.style.color = "white"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
                ><Icon sx={{ fontSize: 16 }} /></a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {COLS.map(col => (
            <div key={col.title}>
              <h4 style={{ color: "white", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>{col.title}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((l, li) => (
                  <li key={l}>
                    <a href={col.hrefs[li]} style={{ color: "#64748b", fontSize: 14, textDecoration: "none", transition: "color .2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#3B82F6")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
                    >{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, textAlign: "center", color: "#374151", fontSize: 13 }}>
          © {new Date().getFullYear()} LiftyHub. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
