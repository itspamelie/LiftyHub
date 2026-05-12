import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Switch,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { apiFetch } from "../../services/api";
import Swal from "sweetalert2";
import SaveIcon from "@mui/icons-material/Save";
import BadgeIcon from "@mui/icons-material/Badge";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function ConfigDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileId, setProfileId] = useState<number | null>(null);
  const [form, setForm] = useState({
    user_id: 0,
    license_number: "",
    profile_pic: "",
    specialty: "",
    location: "",
    bio: "",
    rating: 0,
    is_active: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const res = await apiFetch("/nutritionistProfiles");
        const profile = res.data.find((p: any) => Number(p.user_id) === Number(user.id));
        if (profile) {
          setProfileId(profile.id);
          setForm({
            user_id: profile.user_id,
            license_number: profile.license_number ?? "",
            profile_pic: profile.profile_pic ?? "",
            specialty: profile.specialty ?? "",
            location: profile.location ?? "",
            bio: profile.bio ?? "",
            rating: profile.rating ?? 0,
            is_active: !!profile.is_active,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!profileId) return;
    setSaving(true);
    try {
      await apiFetch(`/nutritionistProfiles/${profileId}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      Swal.fire({
        icon: "success",
        title: "Guardado",
        text: "Tu perfil fue actualizado correctamente",
        background: "#141d2b",
        color: "#fff",
        confirmButtonColor: "#3B82F6",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar. Intenta de nuevo.",
        background: "#141d2b",
        color: "#fff",
        confirmButtonColor: "#3B82F6",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress sx={{ color: "#3B82F6" }} size={32} />
      </Box>
    );
  }

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#090f18",
      color: "#e2e8f0",
      borderRadius: "10px",
      fontSize: 14,
      "& fieldset": { borderColor: "rgba(59,130,246,0.22)" },
      "&:hover fieldset": { borderColor: "rgba(59,130,246,0.3)" },
      "&.Mui-focused fieldset": { borderColor: "#3B82F6" },
    },
    "& .MuiInputLabel-root": { color: "#64748b", fontSize: 13 },
    "& .MuiInputLabel-root.Mui-focused": { color: "#3B82F6" },
  };

  return (
    <Box p={4} sx={{ color: "white" }}>
      {/* HEADER */}
      <Box mb={5}>
        <Typography fontSize={13} color="#555" mb={0.5} letterSpacing="0.05em" textTransform="uppercase">
          Configuración
        </Typography>
        <Typography
          fontSize={36}
          fontWeight={700}
          letterSpacing="-0.5px"
          sx={{
            background: "linear-gradient(135deg, #fff 40%, #555)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Ajustes del perfil
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* COLUMNA IZQUIERDA — Formulario */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box
            sx={{
              p: 4,
              borderRadius: "20px",
              background: "#141d2b",
              border: "1px solid rgba(59,130,246,0.25)",
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5} mb={3}>
              <Box sx={{ color: "#3B82F6", display: "flex" }}>
                <BadgeIcon fontSize="small" />
              </Box>
              <Typography fontSize={12} color="#555" letterSpacing="0.06em" textTransform="uppercase">
                Información profesional
              </Typography>
            </Box>

            <Box display="flex" flexDirection="column" gap={2.5}>
              <Box display="flex" gap={2}>
                <TextField
                  label="Especialidad"
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Ubicación"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  fullWidth
                  sx={fieldSx}
                />
              </Box>

              <TextField
                label="Número de licencia"
                value={form.license_number}
                onChange={(e) => setForm({ ...form, license_number: e.target.value })}
                fullWidth
                sx={fieldSx}
              />

              <TextField
                label="Biografía"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                fullWidth
                multiline
                rows={5}
                sx={fieldSx}
              />

              <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />

              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography fontSize={14} color="#ccc" fontWeight={500}>
                    Perfil visible
                  </Typography>
                  <Typography fontSize={12} color="#555" mt={0.3}>
                    Los usuarios pueden encontrar tu perfil en la app
                  </Typography>
                </Box>
                <Switch
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#3B82F6" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#3B82F6" },
                    "& .MuiSwitch-track": { bgcolor: "#222" },
                  }}
                />
              </Box>

              <Button
                variant="contained"
                startIcon={
                  saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon fontSize="small" />
                }
                onClick={handleSave}
                disabled={saving}
                sx={{
                  alignSelf: "flex-start",
                  px: 3.5,
                  py: 1.1,
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 13,
                  background: "#3B82F6",
                  boxShadow: "0 0 20px rgba(59,130,246,0.25)",
                  "&:hover": { background: "#2563eb", boxShadow: "0 0 28px rgba(59,130,246,0.35)" },
                  "&:disabled": { opacity: 0.4 },
                }}
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* COLUMNA DERECHA — Tips */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Visibilidad */}
            <Box
              sx={{
                p: 3,
                borderRadius: "16px",
                background: "#141d2b",
                border: "1px solid rgba(59,130,246,0.25)",
              }}
            >
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <Box sx={{ color: "#3B82F6", display: "flex" }}>
                  <VisibilityIcon fontSize="small" />
                </Box>
                <Typography fontSize={13} fontWeight={600} color="#888">
                  Visibilidad
                </Typography>
              </Box>
              <Divider sx={{ borderColor: "rgba(59,130,246,0.22)", mb: 2 }} />
              <Box display="flex" flexDirection="column" gap={1.5}>
                {[
                  { label: "Perfil", value: form.is_active ? "Público" : "Oculto", active: form.is_active },
                  { label: "Especialidad", value: form.specialty || "—", active: !!form.specialty },
                  { label: "Ubicación", value: form.location || "—", active: !!form.location },
                ].map((item) => (
                  <Box key={item.label} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontSize={12} color="#555">{item.label}</Typography>
                    <Typography fontSize={12} color={item.active ? "#22c55e" : "#444"} fontWeight={500}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Tips */}
            <Box
              sx={{
                p: 3,
                borderRadius: "16px",
                background: "#141d2b",
                border: "1px solid rgba(59,130,246,0.25)",
              }}
            >
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <Box sx={{ color: "#FBBF24", display: "flex" }}>
                  <InfoOutlinedIcon fontSize="small" />
                </Box>
                <Typography fontSize={13} fontWeight={600} color="#888">
                  Consejos
                </Typography>
              </Box>
              <Divider sx={{ borderColor: "rgba(59,130,246,0.22)", mb: 2 }} />
              <Box display="flex" flexDirection="column" gap={1.5}>
                {[
                  "Una biografía completa aumenta tu visibilidad en la app.",
                  "Agrega tu especialidad para atraer pacientes específicos.",
                  "Mantén tu perfil activo para recibir nuevas solicitudes.",
                ].map((tip, i) => (
                  <Box key={i} display="flex" gap={1.5} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        bgcolor: "#FBBF2466",
                        mt: "6px",
                        flexShrink: 0,
                      }}
                    />
                    <Typography fontSize={12} color="#555" lineHeight={1.6}>
                      {tip}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
