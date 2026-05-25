import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  TextField,
  InputAdornment,
  Divider,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../services/api";
import Swal from "sweetalert2";
import SearchIcon from "@mui/icons-material/Search";
import FlatwareIcon from "@mui/icons-material/Flatware";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const STATUS: Record<string, { label: string; color: string }> = {
  active:    { label: "Activo",     color: "#22c55e" },
  completed: { label: "Completado", color: "#60a5fa" },
};

const StatBox = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) => (
  <Box
    sx={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      gap: 2,
      px: 3,
      py: 2.5,
      borderRadius: "14px",
      background: "#141d2b",
      border: "1px solid rgba(59,130,246,0.25)",
    }}
  >
    <Box
      sx={{
        width: 38,
        height: 38,
        borderRadius: "10px",
        bgcolor: `${color}14`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color,
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography fontSize={26} fontWeight={700} color="#fff" lineHeight={1}>
        {value}
      </Typography>
      <Typography fontSize={11} color="#94a3b8" mt={0.3}>
        {label}
      </Typography>
    </Box>
  </Box>
);

export default function DietsDashboard() {
  const navigate = useNavigate();
  const [diets, setDiets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Eliminar plan?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#141d2b", color: "#fff",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#334155",
    });
    if (!result.isConfirmed) return;
    try {
      await apiFetch(`/dietPlans/${id}`, { method: "DELETE" });
      setDiets((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar el plan.", background: "#141d2b", color: "#fff", confirmButtonColor: "#3B82F6" });
    }
  };

  const load = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const profilesRes = await apiFetch("/nutritionistProfiles");
      const profile = profilesRes.data.find((p: any) => Number(p.user_id) === Number(user.id));
      if (profile) {
        const dietsRes = await apiFetch("/dietPlans");
        setDiets(dietsRes.data.filter((d: any) => d.nutritionist_id === profile.id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = diets.filter((d) => {
    const q = search.toLowerCase();
    return d.goal?.toLowerCase().includes(q) || d.user?.name?.toLowerCase().includes(q);
  });

  const active = diets.filter((d) => d.status === "active").length;
  const completed = diets.filter((d) => d.status === "completed").length;

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
      <Box mb={5} display="flex" alignItems="flex-end" justifyContent="space-between">
        <Box>
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
            Planes de dieta
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon fontSize="small" />}
          onClick={() => navigate("/DashboardForExperts/diets/create")}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: 13,
            px: 3,
            py: 1.1,
            borderRadius: "10px",
            background: "#3B82F6",
            boxShadow: "0 0 20px rgba(59,130,246,0.25)",
            "&:hover": { background: "#2563eb", boxShadow: "0 0 28px rgba(59,130,246,0.35)" },
          }}
        >
          Crear plan
        </Button>
      </Box>

      {/* STATS ROW */}
      <Box display="flex" gap={2} mb={4} flexWrap="wrap">
        <StatBox icon={<FlatwareIcon fontSize="small" />}        label="Total planes"  value={diets.length} color="#3B82F6" />
        <StatBox icon={<AccessTimeIcon fontSize="small" />}      label="Activos"       value={active}       color="#22c55e" />
        <StatBox icon={<CheckCircleOutlineIcon fontSize="small"/>} label="Completados" value={completed}     color="#60a5fa" />
      </Box>

      <Grid container spacing={3}>
        {/* TABLA PRINCIPAL */}
        <Grid xs={12} lg={8}>
          <TextField
            placeholder="Buscar por paciente u objetivo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            fullWidth
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#141d2b",
                color: "#cbd5e1",
                borderRadius: "10px",
                fontSize: 13,
                "& fieldset": { borderColor: "rgba(59,130,246,0.22)" },
                "&:hover fieldset": { borderColor: "rgba(59,130,246,0.3)" },
                "&.Mui-focused fieldset": { borderColor: "#3B82F6" },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#64748b", fontSize: 16 }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          {filtered.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 10,
                borderRadius: "16px",
                border: "1px dashed rgba(255,255,255,0.06)",
              }}
            >
              <FlatwareIcon sx={{ color: "#222", fontSize: 40, mb: 1.5 }} />
              <Typography color="#64748b" fontSize={14}>
                {diets.length === 0 ? "No tienes planes asignados aún" : "Sin resultados"}
              </Typography>
            </Box>
          ) : (
            <TableContainer
              sx={{
                borderRadius: "16px",
                background: "#141d2b",
                border: "1px solid rgba(59,130,246,0.25)",
                overflow: "hidden",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    {["Paciente", "Objetivo", "Duración", "Tipo", "Estado", ""].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          color: "#64748b",
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          borderBottom: "1px solid rgba(59,130,246,0.22)",
                          py: 2,
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((diet) => {
                    const st = STATUS[diet.status] ?? STATUS.active;
                    return (
                      <TableRow
                        key={diet.id}
                        sx={{
                          "&:hover td": { bgcolor: "rgba(255,255,255,0.015)" },
                          "& td": { borderBottom: "1px solid rgba(59,130,246,0.06)", py: 1.8 },
                        }}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar
                              sx={{ width: 30, height: 30, bgcolor: "#3B82F614", color: "#60a5fa", fontSize: 12, fontWeight: 700 }}
                            >
                              {diet.user?.name?.[0] ?? "?"}
                            </Avatar>
                            <Typography color="#ccc" fontSize={13}>
                              {diet.user?.name ?? `#${diet.user_id}`}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography color="#888" fontSize={13} maxWidth={180} noWrap>
                            {diet.goal ?? "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography color="#94a3b8" fontSize={13}>
                            {diet.duration_days ? `${diet.duration_days} días` : "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={diet.is_monodiet ? "Monodieta" : "Variada"}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: 11,
                              bgcolor: diet.is_monodiet ? "rgba(251,191,36,0.08)" : "rgba(139,92,246,0.08)",
                              color: diet.is_monodiet ? "#FBBF24" : "#a78bfa",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: st.color, flexShrink: 0 }} />
                            <Typography color={st.color} fontSize={13} fontWeight={500}>
                              {st.label}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ pr: 1 }}>
                          <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                            <Tooltip title="Editar plan" placement="left">
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/DashboardForExperts/diets/edit/${diet.id}`)}
                                sx={{ color: "#64748b", "&:hover": { color: "#3B82F6", bgcolor: "rgba(59,130,246,0.08)" } }}
                              >
                                <EditIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar plan" placement="left">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(diet.id)}
                                sx={{ color: "#64748b", "&:hover": { color: "#ef4444", bgcolor: "rgba(239,68,68,0.08)" } }}
                              >
                                <DeleteIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>

        {/* PANEL LATERAL */}
        <Grid xs={12} lg={4} >
          <Box
            sx={{
              p: 3,
              borderRadius: "16px",
              background: "#141d2b",
              border: "1px solid rgba(59,130,246,0.25)",
            }}
          >
            <Typography fontSize={12} color="#94a3b8" letterSpacing="0.06em" textTransform="uppercase" mb={2}>
              Resumen
            </Typography>
            <Divider sx={{ borderColor: "rgba(59,130,246,0.22)", mb: 2 }} />

            {/* Barra de progreso activos vs completados */}
            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography fontSize={12} color="#94a3b8">Activos</Typography>
                <Typography fontSize={12} color="#22c55e">{diets.length ? Math.round((active / diets.length) * 100) : 0}%</Typography>
              </Box>
              <Box sx={{ height: 4, borderRadius: 2, bgcolor: "#1e293b", overflow: "hidden" }}>
                <Box
                  sx={{
                    height: "100%",
                    width: `${diets.length ? (active / diets.length) * 100 : 0}%`,
                    bgcolor: "#22c55e",
                    borderRadius: 2,
                    transition: "width 0.6s ease",
                  }}
                />
              </Box>
            </Box>

            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography fontSize={12} color="#94a3b8">Completados</Typography>
                <Typography fontSize={12} color="#60a5fa">{diets.length ? Math.round((completed / diets.length) * 100) : 0}%</Typography>
              </Box>
              <Box sx={{ height: 4, borderRadius: 2, bgcolor: "#1e293b", overflow: "hidden" }}>
                <Box
                  sx={{
                    height: "100%",
                    width: `${diets.length ? (completed / diets.length) * 100 : 0}%`,
                    bgcolor: "#60a5fa",
                    borderRadius: 2,
                    transition: "width 0.6s ease",
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ borderColor: "rgba(59,130,246,0.22)", mb: 2 }} />

            {/* Últimos planes */}
            <Typography fontSize={12} color="#94a3b8" letterSpacing="0.06em" textTransform="uppercase" mb={2}>
              Recientes
            </Typography>
            {diets.length === 0 ? (
              <Typography color="#64748b" fontSize={12}>Sin planes aún</Typography>
            ) : (
              <Box display="flex" flexDirection="column" gap={1.5}>
                {diets.slice(0, 4).map((diet) => {
                  const st = STATUS[diet.status] ?? STATUS.active;
                  return (
                    <Box key={diet.id} display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={1.5} minWidth={0}>
                        <Avatar sx={{ width: 26, height: 26, bgcolor: "#3B82F614", color: "#60a5fa", fontSize: 11 }}>
                          {diet.user?.name?.[0] ?? "?"}
                        </Avatar>
                        <Typography fontSize={12} color="#aaa" noWrap>
                          {diet.user?.name ?? `#${diet.user_id}`}
                        </Typography>
                      </Box>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: st.color, flexShrink: 0 }} />
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

    </Box>
  );
}
