import { useEffect } from "react";
import { Link } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";

const SECTIONS = [
  {
    title: "1. Información que recopilamos",
    content: `Al usar LiftyHub recopilamos los siguientes datos:

• Información de cuenta: nombre, dirección de correo electrónico y contraseña encriptada.
• Perfil físico: peso, altura, edad, género, somatotipo y objetivos fitness que el usuario ingresa voluntariamente.
• Datos de entrenamiento: rutinas creadas, ejercicios registrados, sesiones completadas, series y repeticiones.
• Datos de uso: pantallas visitadas, frecuencia de uso y preferencias dentro de la app.
• Foto de perfil: imagen cargada voluntariamente por el usuario.
• Información de pago: procesada de forma segura a través de PayPal. LiftyHub no almacena datos de tarjetas de crédito.`,
  },
  {
    title: "2. Cómo usamos tu información",
    content: `Utilizamos tus datos exclusivamente para:

• Crear y administrar tu cuenta en LiftyHub.
• Personalizar tu experiencia de entrenamiento y nutrición.
• Mostrarte estadísticas y progreso dentro de la app.
• Conectarte con nutriólogos certificados si contratas un plan con ese servicio.
• Procesar pagos de suscripción de forma segura.
• Enviarte correos relacionados con tu cuenta (bienvenida, confirmación de pago, recuperación de contraseña).
• Mejorar la plataforma a partir de patrones de uso anónimos y agregados.`,
  },
  {
    title: "3. Compartición de datos con terceros",
    content: `LiftyHub no vende, renta ni comparte tu información personal con terceros con fines comerciales o publicitarios.

Únicamente compartimos datos con:

• PayPal: para procesar pagos de suscripción de forma segura. Consulta la política de privacidad de PayPal en paypal.com.
• Google: si usas el inicio de sesión con Google, Google comparte tu nombre y correo con nosotros según sus propios términos.
• Nutriólogos de la plataforma: si contratas un plan con nutriólogo, tu perfil físico y cuestionario nutricional serán visibles para el nutriólogo asignado.`,
  },
  {
    title: "4. Seguridad de los datos",
    content: `Tomamos la seguridad de tu información muy en serio:

• Todas las comunicaciones entre la app y nuestros servidores están cifradas con HTTPS/TLS.
• Las contraseñas se almacenan con hashing seguro (bcrypt) y nunca en texto plano.
• Los tokens de autenticación tienen expiración y se invalidan al cerrar sesión.
• Los datos de pago son procesados directamente por PayPal y nunca pasan por nuestros servidores.
• El acceso a la base de datos está restringido y protegido por credenciales seguras.`,
  },
  {
    title: "5. Retención de datos",
    content: `Conservamos tu información mientras tu cuenta esté activa. Si decides eliminar tu cuenta:

• Todos tus datos personales, rutinas, estadísticas y fotos serán eliminados permanentemente de nuestros servidores en un plazo máximo de 30 días.
• Los registros de transacciones pueden conservarse durante el período requerido por las leyes fiscales aplicables.

Puedes solicitar la eliminación de tu cuenta en cualquier momento escribiendo a liftyhubofficial@gmail.com.`,
  },
  {
    title: "6. Derechos del usuario",
    content: `Como usuario de LiftyHub tienes derecho a:

• Acceso: solicitar una copia de los datos personales que tenemos sobre ti.
• Rectificación: corregir información inexacta o incompleta desde tu perfil o contactándonos.
• Eliminación: solicitar que eliminemos tu cuenta y todos tus datos asociados.
• Portabilidad: solicitar tus datos en formato legible para uso personal.
• Oposición: oponerte al procesamiento de tus datos para fines distintos a los descritos en esta política.

Para ejercer cualquiera de estos derechos, escríbenos a liftyhubofficial@gmail.com.`,
  },
  {
    title: "7. Cookies y almacenamiento local",
    content: `La app móvil de LiftyHub utiliza almacenamiento local seguro (AsyncStorage / SecureStore) para guardar tu sesión y preferencias de forma local en tu dispositivo.

La plataforma web utiliza localStorage del navegador exclusivamente para mantener tu sesión activa. No utilizamos cookies de rastreo, publicidad ni analíticas de terceros.`,
  },
  {
    title: "8. Menores de edad",
    content: `LiftyHub no está dirigida a personas menores de 13 años. No recopilamos conscientemente información personal de menores de 13 años.

Si eres padre o tutor y crees que tu hijo ha creado una cuenta, por favor contáctanos a liftyhubofficial@gmail.com para eliminar la información correspondiente.`,
  },
  {
    title: "9. Cambios a esta política",
    content: `Podemos actualizar esta Política de Privacidad ocasionalmente. Cuando lo hagamos:

• Actualizaremos la fecha de "Última actualización" al inicio de este documento.
• Si los cambios son significativos, te notificaremos por correo electrónico o mediante un aviso dentro de la app.

Te recomendamos revisar esta página periódicamente para mantenerte informado.`,
  },
  {
    title: "10. Contacto",
    content: `Si tienes preguntas, comentarios o solicitudes relacionadas con esta Política de Privacidad o con el manejo de tus datos personales, puedes contactarnos en:`,
    email: "liftyhubofficial@gmail.com",
    contentAfter: `Responderemos tu solicitud en un plazo máximo de 5 días hábiles.`,
  },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: "#0b0f14", color: "white", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Navbar mínimo */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(11,15,20,0.9)",
        backdropFilter: "blur(12px)",
        padding: "0 40px",
        display: "flex", alignItems: "center", height: 64,
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/logo.jpg" alt="LiftyHub" style={{ height: 36, borderRadius: 9 }} />
          <span style={{ color: "white", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px", marginLeft: 10 }}>LiftyHub</span>
        </Link>
      </header>

      {/* Contenido */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 32px 100px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <span style={{
            display: "inline-block", background: "rgba(59,130,246,0.12)",
            border: "1px solid rgba(59,130,246,0.3)", color: "#3B82F6",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
            padding: "5px 14px", borderRadius: 999, textTransform: "uppercase", marginBottom: 20,
          }}>Legal</span>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, marginBottom: 12, letterSpacing: "-0.5px" }}>
            Política de Privacidad
          </h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            Última actualización: {new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Intro */}
        <div style={{
          background: "#0f1623", border: "1px solid #1e2a3a",
          borderRadius: 14, padding: "24px 28px", marginBottom: 40,
        }}>
          <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.8, margin: 0 }}>
            En <strong style={{ color: "white" }}>LiftyHub</strong> nos tomamos muy en serio la privacidad de nuestros usuarios. Esta Política de Privacidad describe qué información recopilamos, cómo la usamos y qué derechos tienes sobre ella cuando usas nuestra aplicación móvil y plataforma web.
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {SECTIONS.map((s, i) => (
            <div key={i} style={{
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              padding: "32px 0",
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "white" }}>
                {s.title}
              </h2>
              <div style={{ color: "#94a3b8", fontSize: 14, lineHeight: 2, whiteSpace: "pre-line" }}>
                {s.content}
              </div>
              {"email" in s && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px 0", color: "#3B82F6", fontWeight: 600, fontSize: 14 }}>
                  <EmailIcon sx={{ fontSize: 18 }} />
                  <a href={`mailto:${s.email}`} style={{ color: "#3B82F6", textDecoration: "none" }}>{s.email}</a>
                </div>
              )}
              {"contentAfter" in s && (
                <div style={{ color: "#94a3b8", fontSize: 14, lineHeight: 2 }}>{s.contentAfter}</div>
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{
          marginTop: 48, background: "rgba(59,130,246,0.06)",
          border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "20px 24px",
        }}>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: 14, lineHeight: 1.7 }}>
            Al usar LiftyHub aceptas los términos descritos en esta Política de Privacidad. Si no estás de acuerdo con alguna parte de esta política, te pedimos que no utilices nuestros servicios.
          </p>
        </div>

        <div style={{ marginTop: 32, textAlign: "center" }}>
          <Link to="/" style={{
            color: "#3B82F6", fontSize: 14, textDecoration: "none", fontWeight: 600,
          }}>← Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
