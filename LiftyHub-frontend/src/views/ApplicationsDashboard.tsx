import { useEffect, useState } from "react";
import { Box, Avatar, Chip, IconButton, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import BadgeIcon from "@mui/icons-material/Badge";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import Swal from "sweetalert2";
import { apiFetch } from "../services/api";
import TopNavbar from "../components/dashboard/TopNavbar";

export default function ApplicationsDashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await apiFetch("/nutritionistProfiles");
      const pending = (data.data || []).filter((n: any) => !n.is_active);
      setApplications(pending);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (loading) {
      Swal.fire({
        title: "Cargando solicitudes...",
        background: "#0f1117",
        color: "#fff",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
    } else {
      Swal.close();
    }
  }, [loading]);

  const approve = async (n: any) => {
    const confirm = await Swal.fire({
      title: `¿Aprobar a ${n.user.name}?`,
      text: "Se activará su cuenta como nutriólogo certificado.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, aprobar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#10B981",
      background: "#0f1117",
      color: "#fff",
    });
    if (!confirm.isConfirmed) return;

    try {
      // Activate profile
      await apiFetch(`/nutritionistProfiles/${n.id}`, {
        method: "PUT",
        body: JSON.stringify({
          user_id: n.user_id,
          license_number: n.license_number,
          profile_pic: n.profile_pic || "default.jpg",
          specialty: n.specialty,
          location: n.location,
          bio: n.bio,
          rating: n.rating ?? 0,
          is_active: true,
        }),
      });

      // Change user role to nutritionist
      await apiFetch(`/users/${n.user_id}`, {
        method: "PUT",
        body: JSON.stringify({ role: "nutritionist" }),
      });

      Swal.fire({
        icon: "success",
        title: "Nutriólogo aprobado",
        text: `${n.user.name} ya puede acceder al portal de nutriólogos.`,
        background: "#0f1117",
        color: "#fff",
        confirmButtonColor: "#10B981",
      });
      setApplications(prev => prev.filter(a => a.id !== n.id));
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo aprobar la solicitud.", background: "#0f1117", color: "#fff" });
    }
  };

  const reject = async (n: any) => {
    const confirm = await Swal.fire({
      title: `¿Rechazar a ${n.user.name}?`,
      text: "Se eliminará su solicitud. El usuario podrá volver a aplicar.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, rechazar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
      background: "#0f1117",
      color: "#fff",
    });
    if (!confirm.isConfirmed) return;

    try {
      await apiFetch(`/nutritionistProfiles/${n.id}`, { method: "DELETE" });
      Swal.fire({
        icon: "success", title: "Solicitud rechazada",
        text: "El perfil ha sido eliminado.",
        background: "#0f1117", color: "#fff", confirmButtonColor: "#3B82F6",
      });
      setApplications(prev => prev.filter(a => a.id !== n.id));
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo rechazar la solicitud.", background: "#0f1117", color: "#fff" });
    }
  };

  if (loading) return null;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "linear-gradient(180deg, #0b0e15 0%, #0f1117 100%)", width: "100%" }}>
      <TopNavbar />

      <Box sx={{ px: 5, pt: 3, pb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Typography fontSize={22} fontWeight={800} color="white">
            Solicitudes de nutriólogos
          </Typography>
          <Chip
            label={applications.length}
            size="small"
            sx={{ background: applications.length > 0 ? "#f59e0b" : "#374151", color: "white", fontWeight: 700, fontSize: 12 }}
          />
        </Box>
        <Typography fontSize={13} color="#64748b">
          Revisa las credenciales y aprueba o rechaza cada solicitud.
        </Typography>
      </Box>

      {applications.length === 0 ? (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, color: "#374151" }}>
          <BadgeIcon sx={{ fontSize: 56 }} />
          <Typography fontSize={16} fontWeight={600} color="#475569">Sin solicitudes pendientes</Typography>
          <Typography fontSize={13} color="#374151">Cuando un nutriólogo se registre aparecerá aquí.</Typography>
        </Box>
      ) : (
        <Box sx={{ p: 5, pt: 2, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 3 }}>
          {applications.map(n => (
            <Box key={n.id} sx={{
              background: "linear-gradient(135deg, #13141c 0%, #0f1117 100%)",
              borderRadius: "20px", overflow: "hidden",
              border: "1px solid rgba(245,158,11,0.25)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-2px)" }
            }}>
              {/* Header */}
              <Box sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 2 }}>
                  <Avatar sx={{ width: 52, height: 52, background: "#1e293b", fontSize: 20, fontWeight: 700, color: "#10B981" }}>
                    {n.user?.name?.[0]?.toUpperCase() ?? "N"}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={700} fontSize={15} color="white">{n.user?.name}</Typography>
                    <Typography fontSize={12} color="#64748b">{n.user?.email}</Typography>
                  </Box>
                  <Chip label="Pendiente" size="small" sx={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)", fontSize: 11, fontWeight: 700 }} />
                </Box>

                {/* Info rows */}
                {[
                  { Icon: BadgeIcon, label: "Cédula profesional", value: n.license_number },
                  { Icon: SchoolIcon, label: "Especialidad", value: n.specialty },
                  { Icon: LocationOnIcon, label: "Ubicación", value: n.location },
                ].map(row => (
                  <Box key={row.label} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", mb: 1.2 }}>
                    <row.Icon sx={{ fontSize: 15, color: "#475569", mt: "2px", flexShrink: 0 }} />
                    <Box>
                      <Typography fontSize={11} color="#475569">{row.label}</Typography>
                      <Typography fontSize={13} color="#cbd5e1" fontWeight={500}>{row.value}</Typography>
                    </Box>
                  </Box>
                ))}

                {/* Bio */}
                <Box sx={{ mt: 1.5, p: 1.5, background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <Typography fontSize={11} color="#475569" mb={0.5}>Descripción</Typography>
                  <Typography fontSize={13} color="#94a3b8" lineHeight={1.6}
                    sx={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {n.bio}
                  </Typography>
                </Box>
              </Box>

              {/* Footer actions */}
              <Box sx={{
                display: "flex", justifyContent: "space-around",
                background: "linear-gradient(180deg, #131416 0%, #232327 100%)",
                py: 1.5, gap: 1, px: 2,
              }}>
                <Box sx={{ textAlign: "center" }}>
                  <IconButton onClick={() => reject(n)} sx={{ background: "rgba(239,68,68,0.12)", color: "#ef4444", mb: 0.5, "&:hover": { background: "rgba(239,68,68,0.25)" } }}>
                    <CloseIcon />
                  </IconButton>
                  <Typography fontSize={12} color="#94a3b8">Rechazar</Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <IconButton onClick={() => approve(n)} sx={{ background: "rgba(16,185,129,0.12)", color: "#10B981", mb: 0.5, "&:hover": { background: "rgba(16,185,129,0.25)" } }}>
                    <CheckIcon />
                  </IconButton>
                  <Typography fontSize={12} color="#94a3b8">Aprobar</Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
