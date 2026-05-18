import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BadgeIcon from "@mui/icons-material/Badge";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const API_URL = import.meta.env.VITE_API_URL;

const SPECIALTIES = [
  "Nutrición deportiva",
  "Pérdida de peso",
  "Nutrición clínica",
  "Nutrición pediátrica",
  "Trastornos alimenticios",
  "Nutrición vegana/vegetariana",
  "Nutrición oncológica",
  "Otra",
];

const STEPS = ["Cuenta", "Credenciales", "Confirmar"];

const inputStyle: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10, padding: "11px 14px",
  color: "white", fontSize: 14, outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 13, fontWeight: 600,
  color: "#94a3b8", marginBottom: 6,
};

const fieldStyle: React.CSSProperties = { marginBottom: 16 };

export default function RegisterNutritionist() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");

  // Step 2
  const [license, setLicense] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "rgba(16,185,129,0.6)");
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "rgba(255,255,255,0.1)");

  const validateStep1 = () => {
    if (!name || !email || !password || !gender || !birthdate) return "Completa todos los campos.";
    if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
    if (password !== confirmPassword) return "Las contraseñas no coinciden.";
    return "";
  };

  const validateStep2 = () => {
    if (!license || !specialty || !location || !bio) return "Completa todos los campos.";
    if (bio.length < 30) return "La descripción debe tener al menos 30 caracteres.";
    return "";
  };

  const goNext = () => {
    setError("");
    if (step === 0) {
      const err = validateStep1();
      if (err) { setError(err); return; }
    }
    if (step === 1) {
      const err = validateStep2();
      if (err) { setError(err); return; }
    }
    setStep(s => s + 1);
  };

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Register user account
      const regRes = await fetch(API_URL + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, gender, birthdate }),
      });
      const regData = await regRes.json();
      if (!regRes.ok || !regData.token) {
        setError(regData.message || "Error al crear la cuenta. El correo puede ya estar registrado.");
        setLoading(false);
        return;
      }

      const token = regData.token;
      const userId = regData.user.id;

      // 2. Create nutritionist profile
      const profRes = await fetch(API_URL + "/nutritionistProfiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          license_number: license,
          profile_pic: "default.jpg",
          specialty,
          location,
          bio,
          rating: 0,
          is_active: false,
        }),
      });

      if (!profRes.ok) {
        setError("Cuenta creada, pero hubo un error al guardar tu perfil profesional. Contacta al soporte.");
        setLoading(false);
        return;
      }

      setDone(true);
    } catch {
      setError("Error de conexión. Verifica tu internet e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b0f14", color: "white", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: "#10B981", marginBottom: 2 }} />
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, letterSpacing: "-0.5px" }}>
            Solicitud enviada
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.65, marginBottom: 16 }}>
            Tu cuenta ha sido creada y tu solicitud está <strong style={{ color: "white" }}>pendiente de revisión</strong>. Nuestro equipo verificará tus credenciales y activará tu cuenta de nutriólogo.
          </p>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 32 }}>
            Si tu solicitud es aprobada, recibirás un correo en <strong style={{ color: "#94a3b8" }}>{email}</strong> con las instrucciones para acceder al portal.
          </p>
          <button
            onClick={() => navigate("/Liftyhub-Experts")}
            style={{
              background: "#10B981", border: "none", color: "white",
              fontWeight: 700, fontSize: 15, cursor: "pointer",
              padding: "13px 32px", borderRadius: 10,
            }}
          >Volver al inicio</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f14", color: "white", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column" }}>

      {/* Navbar */}
      <header style={{
        padding: "0 40px", display: "flex", alignItems: "center",
        height: 64, borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <Link to="/Liftyhub-Experts" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/logo.jpg" alt="LiftyHub" style={{ height: 36, borderRadius: 9 }} />
          <span style={{ color: "white", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px", marginLeft: 10 }}>LiftyHub</span>
          <span style={{
            marginLeft: 10, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)",
            color: "#10B981", padding: "3px 9px", borderRadius: 999,
          }}>EXPERTS</span>
        </Link>
      </header>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 500 }}>

          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32, gap: 0 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: i <= step ? "#10B981" : "rgba(255,255,255,0.08)",
                  border: `2px solid ${i <= step ? "#10B981" : "rgba(255,255,255,0.12)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700,
                  color: i <= step ? "white" : "#475569",
                  transition: "all .3s",
                }}>{i < step ? "✓" : i + 1}</div>
                <span style={{
                  marginLeft: 8, fontSize: 13, fontWeight: 600,
                  color: i === step ? "white" : "#475569",
                  marginRight: i < STEPS.length - 1 ? 0 : 0,
                }}>{s}</span>
                {i < STEPS.length - 1 && (
                  <div style={{
                    width: 40, height: 2, margin: "0 12px",
                    background: i < step ? "#10B981" : "rgba(255,255,255,0.1)",
                    transition: "background .3s",
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Card */}
          <div style={{
            background: "#141d2b",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: 20, padding: "36px 32px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}>

            {/* Step 1: Cuenta */}
            {step === 0 && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                  <PersonIcon sx={{ color: "#10B981", fontSize: 22 }} />
                  <div>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Datos de cuenta</h2>
                    <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>Con estos accederás al portal</p>
                  </div>
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Nombre completo</label>
                  <input style={inputStyle} placeholder="Ej. Ana García López" value={name}
                    onChange={e => setName(e.target.value)} onFocus={focusBorder} onBlur={blurBorder} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Correo electrónico</label>
                  <input style={inputStyle} type="email" placeholder="correo@ejemplo.com" value={email}
                    onChange={e => setEmail(e.target.value)} onFocus={focusBorder} onBlur={blurBorder} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>Contraseña</label>
                    <input style={inputStyle} type="password" placeholder="Mín. 6 caracteres" value={password}
                      onChange={e => setPassword(e.target.value)} onFocus={focusBorder} onBlur={blurBorder} />
                  </div>
                  <div>
                    <label style={labelStyle}>Confirmar</label>
                    <input style={inputStyle} type="password" placeholder="Repite la contraseña" value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)} onFocus={focusBorder} onBlur={blurBorder} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>Género</label>
                    <select style={{ ...inputStyle, appearance: "none" as any }} value={gender}
                      onChange={e => setGender(e.target.value)} onFocus={focusBorder} onBlur={blurBorder}>
                      <option value="" disabled>Seleccionar</option>
                      <option value="male">Masculino</option>
                      <option value="female">Femenino</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Fecha de nacimiento</label>
                    <input style={inputStyle} type="date" value={birthdate}
                      onChange={e => setBirthdate(e.target.value)} onFocus={focusBorder} onBlur={blurBorder} />
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Credenciales */}
            {step === 1 && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                  <BadgeIcon sx={{ color: "#10B981", fontSize: 22 }} />
                  <div>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Perfil profesional</h2>
                    <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>Para verificar tus credenciales</p>
                  </div>
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Cédula profesional</label>
                  <input style={inputStyle} placeholder="Ej. 12345678" value={license}
                    onChange={e => setLicense(e.target.value)} onFocus={focusBorder} onBlur={blurBorder} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Especialidad principal</label>
                  <select style={{ ...inputStyle, appearance: "none" as any }} value={specialty}
                    onChange={e => setSpecialty(e.target.value)} onFocus={focusBorder} onBlur={blurBorder}>
                    <option value="" disabled>Seleccionar especialidad</option>
                    {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}><LocationOnIcon sx={{ fontSize: 14, verticalAlign: "middle", marginRight: "4px" }} />Ciudad / Estado</label>
                  <input style={inputStyle} placeholder="Ej. Guadalajara, Jalisco" value={location}
                    onChange={e => setLocation(e.target.value)} onFocus={focusBorder} onBlur={blurBorder} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}><SchoolIcon sx={{ fontSize: 14, verticalAlign: "middle", marginRight: "4px" }} />Descripción profesional</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: 100, resize: "vertical" } as React.CSSProperties}
                    placeholder="Cuéntanos sobre tu experiencia, enfoque y por qué te unes a LiftyHub..."
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                  <span style={{ fontSize: 11, color: bio.length < 30 ? "#ef4444" : "#10B981", marginTop: 4, display: "block" }}>
                    {bio.length}/30 caracteres mínimo
                  </span>
                </div>
              </>
            )}

            {/* Step 3: Confirmar */}
            {step === 2 && (
              <>
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800 }}>Confirmar solicitud</h2>
                  <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>Revisa tu información antes de enviar</p>
                </div>

                {[
                  { label: "Nombre", value: name },
                  { label: "Correo", value: email },
                  { label: "Género", value: gender === "male" ? "Masculino" : gender === "female" ? "Femenino" : "Otro" },
                  { label: "Fecha de nacimiento", value: birthdate },
                  { label: "Cédula profesional", value: license },
                  { label: "Especialidad", value: specialty },
                  { label: "Ciudad / Estado", value: location },
                ].map(row => (
                  <div key={row.label} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
                    fontSize: 14,
                  }}>
                    <span style={{ color: "#64748b" }}>{row.label}</span>
                    <span style={{ color: "white", fontWeight: 600, maxWidth: "60%", textAlign: "right" }}>{row.value}</span>
                  </div>
                ))}

                <div style={{ marginTop: 16, padding: 14, background: "rgba(16,185,129,0.07)", borderRadius: 10, border: "1px solid rgba(16,185,129,0.2)", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
                  Tu cuenta quedará <strong style={{ color: "white" }}>pendiente de revisión</strong>. Un administrador verificará tu cédula profesional y activará tu acceso al portal de nutriólogos.
                </div>
              </>
            )}

            {/* Error */}
            {error && (
              <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, color: "#f87171", fontSize: 13 }}>
                {error}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              {step > 0 && (
                <button onClick={() => { setError(""); setStep(s => s - 1); }} style={{
                  flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "white", fontWeight: 600, fontSize: 14, cursor: "pointer",
                  padding: "12px", borderRadius: 10,
                }}>Atrás</button>
              )}
              {step < 2 ? (
                <button onClick={goNext} style={{
                  flex: 2, background: "#10B981", border: "none", color: "white",
                  fontWeight: 700, fontSize: 14, cursor: "pointer",
                  padding: "12px", borderRadius: 10, transition: "background .2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#059669")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#10B981")}
                >Continuar</button>
              ) : (
                <button onClick={submit} disabled={loading} style={{
                  flex: 2, background: loading ? "#059669" : "#10B981", border: "none",
                  color: "white", fontWeight: 700, fontSize: 14,
                  cursor: loading ? "not-allowed" : "pointer",
                  padding: "12px", borderRadius: 10, opacity: loading ? 0.8 : 1,
                }}>
                  {loading ? "Enviando..." : "Enviar solicitud"}
                </button>
              )}
            </div>

            <p style={{ textAlign: "center", color: "#475569", fontSize: 13, marginTop: 16, marginBottom: 0 }}>
              ¿Ya tienes cuenta?{" "}
              <Link to="/Liftyhub-Experts-Login" style={{ color: "#10B981", textDecoration: "none", fontWeight: 600 }}>
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
