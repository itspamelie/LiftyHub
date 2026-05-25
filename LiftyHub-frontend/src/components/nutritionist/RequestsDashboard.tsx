import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  Avatar,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import { apiFetch } from "../../services/api";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import InboxIcon from "@mui/icons-material/Inbox";
import Swal from "sweetalert2";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:     { label: "Pendiente",     color: "#FBBF24" },
  in_progress: { label: "En progreso",   color: "#3B82F6" },
  completed:   { label: "Completado",    color: "#22c55e" },
  cancelled:   { label: "Cancelado",     color: "#94a3b8"    },
  paid:        { label: "Pagado",        color: "#a78bfa" },
};

const MONTH_NAMES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

type NutritionProfile = {
  weight: number;
  age: number;
  height: number;
  meal_schedule: string | null;
  favorite_foods: string | null;
  disliked_foods: string | null;
  allergies: string | null;
  medical_restrictions: string | null;
  favorite_meal: string | null;
  can_cook_sunday: boolean;
};

type DietRequest = {
  id: number;
  status: string;
  year: number;
  month: number;
  created_at: string;
  user: { id: number; name: string; email: string } | null;
  dietPlan: any | null;
};

export default function RequestsDashboard() {
  const [requests, setRequests] = useState<DietRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [questionnaire, setQuestionnaire] = useState<NutritionProfile | null>(null);
  const [questPatientName, setQuestPatientName] = useState("");
  const [questOpen, setQuestOpen] = useState(false);

  const loadRequests = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const profilesRes = await apiFetch("/nutritionistProfiles");
      const profile = profilesRes.data.find(
        (p: any) => Number(p.user_id) === Number(user.id)
      );
      if (profile) {
        const res = await apiFetch(`/dietRequests/nutritionist/${profile.id}`);
        setRequests(res.data ?? []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRequests(); }, []);

  const handleStatus = async (id: number, status: string) => {
    setActionLoading(id);
    try {
      await apiFetch(`/dietRequests/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
      Swal.fire({
        icon: "success",
        title: status === "in_progress" ? "Solicitud aceptada" : "Solicitud rechazada",
        background: "#141d2b",
        color: "#fff",
        confirmButtonColor: "#3B82F6",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({ icon: "error", title: "Error al actualizar", background: "#141d2b", color: "#fff", confirmButtonColor: "#3B82F6" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewQuestionnaire = async (req: DietRequest) => {
    if (!req.user) return;
    try {
      const res = await apiFetch(`/nutritionProfiles/user/${req.user.id}`);
      if (res.data) {
        setQuestionnaire(res.data);
        setQuestPatientName(req.user.name);
        setQuestOpen(true);
      } else {
        Swal.fire({
          icon: "info",
          title: "Sin cuestionario",
          text: `${req.user.name} aún no ha llenado el cuestionario nutricional.`,
          background: "#141d2b",
          color: "#fff",
          confirmButtonColor: "#3B82F6",
        });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error al cargar cuestionario", background: "#141d2b", color: "#fff", confirmButtonColor: "#3B82F6" });
    }
  };

  const handleDischarge = async (req: DietRequest) => {
    const result = await Swal.fire({
      title: "¿Dar de baja a este paciente?",
      html: `<span style="color:#94a3b8;font-size:14px">${req.user?.name ?? "Este paciente"} dejará de estar en tu lista de pacientes activos.</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, dar de baja",
      cancelButtonText: "Cancelar",
      background: "#141d2b",
      color: "#fff",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#334155",
    });
    if (!result.isConfirmed) return;
    setActionLoading(req.id);
    try {
      // Cancel ALL open requests from this user (in_progress, pending, completed)
      // so the mobile app stops showing stale states
      const toCancel = requests.filter(
        (r) => r.user?.id === req.user?.id && r.status !== "cancelled"
      );
      await Promise.all(
        toCancel.map((r) =>
          apiFetch(`/dietRequests/${r.id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status: "cancelled" }),
          })
        )
      );

      // Delete nutrition profile so user can fill it again with a new nutritionist
      if (req.user?.id) {
        const profileRes = await apiFetch(`/nutritionProfiles/user/${req.user.id}`);
        if (profileRes?.data?.id) {
          await apiFetch(`/nutritionProfiles/${profileRes.data.id}`, { method: "DELETE" });
        }
      }
      setRequests((prev) =>
        prev.map((r) =>
          toCancel.some((c) => c.id === r.id) ? { ...r, status: "cancelled" } : r
        )
      );
      Swal.fire({
        icon: "success",
        title: "Paciente dado de baja",
        background: "#141d2b",
        color: "#fff",
        confirmButtonColor: "#3B82F6",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({ icon: "error", title: "Error al actualizar", background: "#141d2b", color: "#fff", confirmButtonColor: "#3B82F6" });
    } finally {
      setActionLoading(null);
    }
  };

  const pending    = requests.filter((r) => r.status === "pending" || r.status === "paid");
  const active     = requests.filter((r) => r.status === "in_progress");
  const historical = requests.filter((r) => r.status === "completed" || r.status === "cancelled");

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress sx={{ color: "#3B82F6" }} size={32} />
      </Box>
    );
  }

  return (
    <Box p={4} sx={{ color: "white" }}>
      {/* HEADER */}
      <Box mb={5}>
        <Typography fontSize={13} color="#94a3b8" mb={0.5} letterSpacing="0.05em" textTransform="uppercase">
          Gestión
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
          Solicitudes
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* COLUMNA PRINCIPAL */}
        <Grid xs={12} lg={8}>

          {/* PENDIENTES */}
          {pending.length > 0 && (
            <Box mb={4}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <Typography fontSize={12} color="#FBBF24" letterSpacing="0.06em" textTransform="uppercase" fontWeight={600}>
                  Pendientes de respuesta
                </Typography>
                <Box
                  sx={{
                    px: 1.2, py: 0.2, borderRadius: "6px",
                    bgcolor: "rgba(251,191,36,0.08)",
                    color: "#FBBF24", fontSize: 11, fontWeight: 700,
                  }}
                >
                  {pending.length}
                </Box>
              </Box>

              <Box display="flex" flexDirection="column" gap={2}>
                {pending.map((req) => (
                  <RequestCard
                    key={req.id}
                    req={req}
                    actionLoading={actionLoading}
                    onAccept={() => handleStatus(req.id, "in_progress")}
                    onReject={() => handleStatus(req.id, "cancelled")}
                    onViewQuestionnaire={() => handleViewQuestionnaire(req)}
                    showActions
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* EN PROGRESO */}
          {active.length > 0 && (
            <Box mb={4}>
              <Typography fontSize={12} color="#3B82F6" letterSpacing="0.06em" textTransform="uppercase" fontWeight={600} mb={2}>
                En progreso
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                {active.map((req) => (
                  <RequestCard
                    key={req.id}
                    req={req}
                    actionLoading={actionLoading}
                    onAccept={() => {}}
                    onReject={() => {}}
                    onViewQuestionnaire={() => handleViewQuestionnaire(req)}
                    onDischarge={() => handleDischarge(req)}
                    showActions={false}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* HISTORIAL */}
          {historical.length > 0 && (
            <Box>
              <Typography fontSize={12} color="#94a3b8" letterSpacing="0.06em" textTransform="uppercase" fontWeight={600} mb={2}>
                Historial
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                {historical.map((req) => (
                  <RequestCard
                    key={req.id}
                    req={req}
                    actionLoading={actionLoading}
                    onAccept={() => {}}
                    onReject={() => {}}
                    onViewQuestionnaire={() => handleViewQuestionnaire(req)}
                    onDischarge={req.status === "completed" ? () => handleDischarge(req) : undefined}
                    showActions={false}
                  />
                ))}
              </Box>
            </Box>
          )}

          {requests.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                py: 12,
                borderRadius: "16px",
                border: "1px dashed rgba(255,255,255,0.06)",
              }}
            >
              <InboxIcon sx={{ color: "#222", fontSize: 44, mb: 1.5 }} />
              <Typography color="#64748b" fontSize={14}>
                No hay solicitudes todavía
              </Typography>
            </Box>
          )}
        </Grid>

        {/* PANEL LATERAL — RESUMEN */}
        <Grid xs={12} lg={4}>
          <Box
            sx={{
              p: 3,
              borderRadius: "16px",
              background: "#141d2b",
              border: "1px solid rgba(59,130,246,0.25)",
              position: "sticky",
              top: 80,
            }}
          >
            <Typography fontSize={12} color="#94a3b8" letterSpacing="0.06em" textTransform="uppercase" mb={2}>
              Resumen
            </Typography>
            <Divider sx={{ borderColor: "rgba(59,130,246,0.22)", mb: 2 }} />

            {[
              { label: "Pendientes",   value: pending.length,    color: "#FBBF24" },
              { label: "En progreso",  value: active.length,     color: "#3B82F6" },
              { label: "Completados",  value: historical.filter((r) => r.status === "completed").length, color: "#22c55e" },
              { label: "Cancelados",   value: historical.filter((r) => r.status === "cancelled").length, color: "#94a3b8" },
            ].map((item) => (
              <Box key={item.label} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: item.color }} />
                  <Typography fontSize={13} color="#888">{item.label}</Typography>
                </Box>
                <Typography fontSize={20} fontWeight={700} color="#fff">{item.value}</Typography>
              </Box>
            ))}

            <Divider sx={{ borderColor: "rgba(59,130,246,0.22)", mb: 2 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography fontSize={12} color="#94a3b8">Total</Typography>
              <Typography fontSize={12} color="#888" fontWeight={600}>{requests.length} solicitudes</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* DIALOG: CUESTIONARIO */}
      <Dialog
        open={questOpen}
        onClose={() => setQuestOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "#141d2b",
            borderRadius: "20px",
            border: "1px solid rgba(59,130,246,0.25)",
            color: "white",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
          <Box>
            <Typography fontSize={16} fontWeight={700}>Cuestionario nutricional</Typography>
            <Typography fontSize={12} color="#94a3b8">{questPatientName}</Typography>
          </Box>
          <IconButton onClick={() => setQuestOpen(false)} sx={{ color: "#94a3b8", "&:hover": { color: "#94a3b8" } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: "rgba(59,130,246,0.22)" }}>
          {questionnaire && (
            <Box display="flex" flexDirection="column" gap={0}>
              <QRow label="Peso" value={`${questionnaire.weight} kg`} />
              <QRow label="Edad" value={`${questionnaire.age} años`} />
              <QRow label="Estatura" value={`${questionnaire.height} cm`} />
              <QRow label="Horario de comidas" value={questionnaire.meal_schedule} />
              <QRow label="Alimentos favoritos" value={questionnaire.favorite_foods} />
              <QRow label="Alimentos menos favoritos" value={questionnaire.disliked_foods} />
              <QRow label="Alergias" value={questionnaire.allergies} />
              <QRow label="Restricciones médicas" value={questionnaire.medical_restrictions} />
              <QRow label="Comida favorita" value={questionnaire.favorite_meal} />
              <QRow label="Cocina los domingos" value={questionnaire.can_cook_sunday ? "Sí" : "No"} />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

function QRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <Box py={1.5} sx={{ borderBottom: "1px solid rgba(59,130,246,0.22)" }}>
      <Typography fontSize={11} color="#94a3b8" mb={0.3} letterSpacing="0.04em" textTransform="uppercase">
        {label}
      </Typography>
      <Typography fontSize={13} color={value ? "#ccc" : "#64748b"}>
        {value ?? "—"}
      </Typography>
    </Box>
  );
}

function RequestCard({
  req,
  actionLoading,
  onAccept,
  onReject,
  onViewQuestionnaire,
  onDischarge,
  showActions,
}: {
  req: DietRequest;
  actionLoading: number | null;
  onAccept: () => void;
  onReject: () => void;
  onViewQuestionnaire: () => void;
  onDischarge?: () => void;
  showActions: boolean;
}) {
  const st = STATUS_MAP[req.status] ?? STATUS_MAP.pending;
  const isLoading = actionLoading === req.id;

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: "16px",
        background: "#141d2b",
        border: "1px solid rgba(59,130,246,0.25)",
        transition: "border-color 0.2s",
        "&:hover": { borderColor: "rgba(59,130,246,0.22)" },
      }}
    >
      <Box display="flex" alignItems="flex-start" gap={2}>
        <Avatar
          sx={{ width: 38, height: 38, bgcolor: "#3B82F614", color: "#60a5fa", fontSize: 14, fontWeight: 700, flexShrink: 0 }}
        >
          {req.user?.name?.[0] ?? "?"}
        </Avatar>
        <Box flex={1} minWidth={0}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
            <Typography fontSize={14} fontWeight={600} color="#ddd" noWrap>
              {req.user?.name ?? `Usuario #${req.id}`}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: st.color, flexShrink: 0 }} />
              <Typography fontSize={12} color={st.color} fontWeight={500}>
                {st.label}
              </Typography>
            </Box>
          </Box>
          <Typography fontSize={12} color="#64748b" mt={0.3}>
            {MONTH_NAMES[(req.month ?? 1) - 1]} {req.year} · {req.user?.email ?? ""}
          </Typography>
        </Box>
      </Box>

      <Box display="flex" gap={1.5} mt={2} flexWrap="wrap">
        <Button
          size="small"
          startIcon={<AssignmentIcon sx={{ fontSize: "14px !important" }} />}
          onClick={onViewQuestionnaire}
          sx={{
            fontSize: 12,
            textTransform: "none",
            color: "#60a5fa",
            bgcolor: "rgba(59,130,246,0.06)",
            borderRadius: "8px",
            px: 1.5,
            py: 0.6,
            "&:hover": { bgcolor: "rgba(59,130,246,0.18)" },
          }}
        >
          Ver cuestionario
        </Button>

        {showActions && (
          <>
            <Button
              size="small"
              startIcon={isLoading ? <CircularProgress size={12} color="inherit" /> : <CheckIcon sx={{ fontSize: "14px !important" }} />}
              onClick={onAccept}
              disabled={isLoading}
              sx={{ fontSize: 12, textTransform: "none", color: "#22c55e", bgcolor: "rgba(34,197,94,0.06)", borderRadius: "8px", px: 1.5, py: 0.6, "&:hover": { bgcolor: "rgba(34,197,94,0.12)" } }}
            >
              Aceptar
            </Button>
            <Button
              size="small"
              startIcon={<CloseIcon sx={{ fontSize: "14px !important" }} />}
              onClick={onReject}
              disabled={isLoading}
              sx={{ fontSize: 12, textTransform: "none", color: "#ef4444", bgcolor: "rgba(239,68,68,0.06)", borderRadius: "8px", px: 1.5, py: 0.6, "&:hover": { bgcolor: "rgba(239,68,68,0.12)" } }}
            >
              Rechazar
            </Button>
          </>
        )}

        {onDischarge && (
          <Button
            size="small"
            startIcon={isLoading ? <CircularProgress size={12} color="inherit" /> : <PersonRemoveIcon sx={{ fontSize: "14px !important" }} />}
            onClick={onDischarge}
            disabled={isLoading}
            sx={{ fontSize: 12, textTransform: "none", color: "#ef4444", bgcolor: "rgba(239,68,68,0.06)", borderRadius: "8px", px: 1.5, py: 0.6, "&:hover": { bgcolor: "rgba(239,68,68,0.12)" }, ml: "auto" }}
          >
            Dar de baja
          </Button>
        )}
      </Box>
    </Box>
  );
}
