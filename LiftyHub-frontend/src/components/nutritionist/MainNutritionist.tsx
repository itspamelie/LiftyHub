import { Box, Typography, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { apiFetch } from "../../services/api";
import MetricCard from "../dashboard-nutritionists/metricCard";
import FlatwareIcon from "@mui/icons-material/Flatware";
import GroupIcon from "@mui/icons-material/Group";
import StarIcon from "@mui/icons-material/Star";

export default function MainNutritionist() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  const [loading, setLoading] = useState(true);
  const [diets, setDiets] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const profilesRes = await apiFetch("/nutritionistProfiles");
        const found = profilesRes.data.find((p: any) => Number(p.user_id) === Number(user.id));
        if (found) {
          const detail = await apiFetch(`/nutritionistProfiles/${found.id}`);
          setProfile(detail.data);
          const dietsRes = await apiFetch("/dietPlans");
          setDiets(dietsRes.data.filter((d: any) => d.nutritionist_id === found.id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const active = diets.filter((d) => d.status === "active").length;
  const completed = diets.filter((d) => d.status === "completed").length;
  const uniquePatients = new Set(diets.map((d) => d.user_id)).size;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress sx={{ color: "#3B82F6" }} size={32} />
      </Box>
    );
  }

  return (
    <Box p={4} sx={{ color: "white" }}>
      {/* GREETING */}
      <Box mb={5}>
        <Typography fontSize={13} color="#555" mb={0.5} letterSpacing="0.05em" textTransform="uppercase">
          {greeting}
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
          {user?.name ?? "Nutriólogo"} 👋
        </Typography>
        <Typography color="#444" mt={0.5} fontSize={14}>
          Resumen de tu actividad profesional
        </Typography>
      </Box>

      {/* METRICS */}
      <Grid container spacing={2} mb={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            title="Planes totales"
            value={String(diets.length)}
            extra={`${active} activos · ${completed} completados`}
            icon={<FlatwareIcon fontSize="small" />}
            color="#3B82F6"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            title="Pacientes atendidos"
            value={String(uniquePatients)}
            extra="Pacientes únicos"
            icon={<GroupIcon fontSize="small" />}
            color="#22c55e"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            title="Calificación"
            value={profile?.rating ? Number(profile.rating).toFixed(1) : "—"}
            extra={`${profile?.reviews_count ?? 0} reseñas`}
            icon={<StarIcon fontSize="small" />}
            color="#FBBF24"
          />
        </Grid>
      </Grid>

      {/* CHART + ACTIVITY */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Box
            sx={{
              height: 280,
              borderRadius: "16px",
              background: "#111",
              border: "1px solid rgba(255,255,255,0.05)",
              p: 3,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Typography fontSize={13} fontWeight={600} color="#888" mb={1}>
              Distribución de planes
            </Typography>
            {/* Progress bars por estado */}
            <Box mt={3} display="flex" flexDirection="column" gap={3}>
              {[
                { label: "Activos", value: active, total: diets.length, color: "#22c55e" },
                { label: "Completados", value: completed, total: diets.length, color: "#60a5fa" },
              ].map((item) => (
                <Box key={item.label}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography fontSize={12} color="#555">{item.label}</Typography>
                    <Typography fontSize={12} color={item.color}>
                      {item.value} / {item.total}
                    </Typography>
                  </Box>
                  <Box sx={{ height: 6, borderRadius: 3, bgcolor: "#1a1a1a", overflow: "hidden" }}>
                    <Box
                      sx={{
                        height: "100%",
                        width: `${item.total ? (item.value / item.total) * 100 : 0}%`,
                        bgcolor: item.color,
                        borderRadius: 3,
                        transition: "width 0.8s ease",
                        boxShadow: `0 0 8px ${item.color}66`,
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 0, left: 0, right: 0,
                height: "40%",
                background: "linear-gradient(180deg, transparent, rgba(59,130,246,0.04))",
                pointerEvents: "none",
              }}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{
              height: 280,
              borderRadius: "16px",
              background: "#111",
              border: "1px solid rgba(255,255,255,0.05)",
              p: 3,
              overflowY: "auto",
            }}
          >
            <Typography fontSize={13} fontWeight={600} color="#888" mb={2}>
              Pacientes recientes
            </Typography>

            {diets.length === 0 ? (
              <Typography color="#333" fontSize={13}>Sin planes asignados aún</Typography>
            ) : (
              diets.slice(0, 5).map((diet, i) => {
                const isActive = diet.status === "active";
                return (
                  <Box
                    key={diet.id}
                    display="flex"
                    alignItems="center"
                    gap={2}
                    py={1.5}
                    sx={{ borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                  >
                    <Box
                      sx={{
                        width: 32, height: 32, borderRadius: "8px",
                        bgcolor: "#3B82F614",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#60a5fa", fontSize: 13, fontWeight: 700, flexShrink: 0,
                      }}
                    >
                      {diet.user?.name?.[0] ?? "?"}
                    </Box>
                    <Box flex={1} minWidth={0}>
                      <Typography fontSize={13} color="#ccc" noWrap>
                        {diet.user?.name ?? `Usuario #${diet.user_id}`}
                      </Typography>
                      <Typography fontSize={11} color="#444" noWrap>
                        {diet.goal ?? "Sin objetivo"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 6, height: 6, borderRadius: "50%",
                        bgcolor: isActive ? "#22c55e" : "#60a5fa",
                        flexShrink: 0,
                      }}
                    />
                  </Box>
                );
              })
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
