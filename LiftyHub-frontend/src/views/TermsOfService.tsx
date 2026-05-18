import { Link } from "react-router-dom";

const SECTIONS = [
  {
    title: "1. Aceptación de los términos",
    content: "Al descargar, instalar o usar la aplicación LiftyHub, aceptas quedar vinculado por estos Términos de Servicio. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder al servicio.",
  },
  {
    title: "2. Descripción del servicio",
    content: "LiftyHub es una plataforma de fitness que permite a los usuarios crear rutinas de ejercicio, registrar su progreso, escanear y compartir rutinas mediante códigos QR, y conectarse con nutriólogos certificados. El servicio está disponible como aplicación móvil para Android e iOS.",
  },
  {
    title: "3. Registro y cuenta",
    content: "Para acceder a las funciones de LiftyHub debes crear una cuenta proporcionando información veraz y actualizada. Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta. Debes notificarnos de inmediato ante cualquier uso no autorizado.",
  },
  {
    title: "4. Planes y suscripciones",
    content: "LiftyHub ofrece un plan gratuito permanente y planes de pago (Basic, Meal, Pro) con facturación mensual. Los cobros se procesan a través de PayPal. Puedes cancelar tu suscripción en cualquier momento desde la configuración de la app; conservarás el acceso hasta el final del período pagado. No se realizan reembolsos por períodos parciales.",
  },
  {
    title: "5. Uso aceptable",
    content: "Te comprometes a no usar LiftyHub para actividades ilegales, para distribuir contenido ofensivo, para intentar acceder sin autorización a sistemas ajenos, ni para interferir con el funcionamiento normal de la plataforma. Nos reservamos el derecho de suspender cuentas que violen estas condiciones.",
  },
  {
    title: "6. Contenido del usuario",
    content: "Al crear rutinas, planes u otro contenido en LiftyHub, nos otorgas una licencia no exclusiva para almacenar y mostrar dicho contenido dentro de la plataforma. Conservas todos los derechos sobre tu contenido. No vendemos ni cedemos tu contenido a terceros.",
  },
  {
    title: "7. Propiedad intelectual",
    content: "La marca LiftyHub, el logotipo, el diseño de la aplicación y todo el contenido generado por nosotros son propiedad exclusiva de LiftyHub. Queda prohibida su reproducción, distribución o modificación sin autorización expresa por escrito.",
  },
  {
    title: "8. Limitación de responsabilidad",
    content: "LiftyHub se proporciona 'tal cual', sin garantías de ningún tipo. No somos responsables de lesiones, daños a la salud ni cualquier otro perjuicio derivado del uso de los planes de entrenamiento o nutricionales disponibles en la plataforma. Consulta siempre a un profesional de la salud antes de iniciar cualquier programa de ejercicio o dieta.",
  },
  {
    title: "9. Modificaciones al servicio",
    content: "Nos reservamos el derecho de modificar, suspender o descontinuar cualquier parte del servicio en cualquier momento. En caso de cambios significativos te notificaremos con al menos 15 días de anticipación a través del correo registrado en tu cuenta.",
  },
  {
    title: "10. Cambios en los términos",
    content: "Podemos actualizar estos Términos de Servicio periódicamente. El uso continuado de la plataforma después de la fecha de vigencia de los nuevos términos constituye tu aceptación de los mismos. La fecha de última actualización siempre estará visible al pie de este documento.",
  },
  {
    title: "11. Contacto",
    content: "Si tienes preguntas sobre estos Términos de Servicio, escríbenos a:",
    email: "soporte@liftyhub.com",
  },
];

export default function TermsOfService() {
  return (
    <div style={{
      minHeight: "100vh", background: "#0b0f14", color: "white",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Gradient blobs */}
      <div style={{
        position: "fixed", top: -200, right: -200, width: 600, height: 600,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Navbar */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(11,15,20,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "0 40px",
        display: "flex", alignItems: "center", height: 64,
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/logo.jpg" alt="LiftyHub" style={{ height: 36, borderRadius: 9 }} />
          <span style={{ color: "white", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px", marginLeft: 10 }}>LiftyHub</span>
        </Link>
      </header>

      {/* Content */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "60px 24px 80px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <span style={{
            display: "inline-block",
            background: "rgba(59,130,246,0.12)",
            border: "1px solid rgba(59,130,246,0.3)",
            color: "#3B82F6",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
            padding: "4px 14px", borderRadius: 999, textTransform: "uppercase",
            marginBottom: 20,
          }}>Legal</span>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, marginBottom: 12, letterSpacing: "-0.5px" }}>
            Términos de Servicio
          </h1>
          <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            Última actualización: enero 2025. Al usar LiftyHub aceptas los siguientes términos.
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          {SECTIONS.map((section, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14, padding: "28px 28px",
            }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, color: "#e2e8f0", letterSpacing: "-0.2px" }}>
                {section.title}
              </h2>
              <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                {section.content}
              </p>
              {section.email && (
                <a
                  href={`mailto:${section.email}`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    color: "#3B82F6", textDecoration: "none", fontSize: 14,
                    fontWeight: 600, marginTop: 10,
                  }}
                >
                  {section.email}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Back link */}
        <div style={{ marginTop: 48 }}>
          <Link to="/" style={{
            color: "#3B82F6", textDecoration: "none", fontSize: 14,
            fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
