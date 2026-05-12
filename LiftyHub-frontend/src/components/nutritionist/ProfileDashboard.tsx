import {
  Box,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { apiFetch, getImageUrl } from "../../services/api";
import Grid from "@mui/material/Grid";
import StarIcon from "@mui/icons-material/Star";
import BadgeIcon from "@mui/icons-material/Badge";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const InfoCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <Box
    sx={{
      p: 3,
      borderRadius: "16px",
      background: "#141d2b",
      border: "1px solid rgba(59,130,246,0.25)",
      height: "100%",
      transition: "border-color 0.2s",
      "&:hover": { borderColor: "rgba(59,130,246,0.2)" },
    }}
  >
    <Box display="flex" alignItems="center" gap={1.5} mb={2}>
      <Box sx={{ color: "#3B82F6", display: "flex", alignItems: "center" }}>
        {icon}
      </Box>
      <Typography fontSize={13} fontWeight={600} color="#888" letterSpacing="0.04em" textTransform="uppercase">
        {title}
      </Typography>
    </Box>
    <Divider sx={{ borderColor: "rgba(59,130,246,0.22)", mb: 2 }} />
    {children}
  </Box>
);

export default function ProfileDashboard() {
  const [nutritionist, setNutritionist] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const res = await apiFetch("/nutritionistProfiles");
        const profile = res.data.find((p: any) => Number(p.user_id) === Number(user.id));
        if (profile) {
          const detail = await apiFetch(`/nutritionistProfiles/${profile.id}`);
          setNutritionist(detail.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress sx={{ color: "#3B82F6" }} size={32} />
      </Box>
    );
  }

  if (!nutritionist) {
    return (
      <Box p={4}>
        <Typography color="#444">No se encontró el perfil.</Typography>
      </Box>
    );
  }

  const stars = Math.round(nutritionist.rating ?? 0);

  return (
    <Box p={4} sx={{ color: "white" }}>
      {/* HEADER */}
      <Box mb={5}>
        <Typography fontSize={13} color="#555" mb={0.5} letterSpacing="0.05em" textTransform="uppercase">
          Tu perfil
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
          Perfil profesional
        </Typography>
      </Box>

      {/* HERO CARD */}
      <Box
        sx={{
          p: 3.5,
          borderRadius: "20px",
          background: "#141d2b",
          border: "1px solid rgba(59,130,246,0.25)",
          display: "flex",
          alignItems: "center",
          gap: 3,
          mb: 3,
          flexWrap: "wrap",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <Box
          sx={{
            position: "absolute",
            top: -60,
            left: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(59,130,246,0.22)",
            filter: "blur(50px)",
            pointerEvents: "none",
          }}
        />
        <Avatar
          src={getImageUrl(nutritionist.profile_pic, "nutritionists")}
          sx={{
            width: 80,
            height: 80,
            border: "2px solid rgba(59,130,246,0.4)",
            fontSize: 28,
            fontWeight: 700,
            bgcolor: "#3B82F622",
            color: "#3B82F6",
          }}
        >
          {nutritionist.user?.name?.[0]}
        </Avatar>

        <Box flex={1} minWidth={0}>
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" mb={0.5}>
            <Typography fontSize={22} fontWeight={700} color="#fff">
              {nutritionist.user?.name}
            </Typography>
            <Chip
              label={nutritionist.is_active ? "Activo" : "Inactivo"}
              size="small"
              sx={{
                height: 22,
                fontSize: 11,
                fontWeight: 600,
                bgcolor: nutritionist.is_active ? "rgba(34,197,94,0.1)" : "rgba(107,114,128,0.1)",
                color: nutritionist.is_active ? "#22c55e" : "#6b7280",
                border: `1px solid ${nutritionist.is_active ? "rgba(34,197,94,0.25)" : "rgba(107,114,128,0.25)"}`,
              }}
            />
          </Box>
          <Typography color="#555" fontSize={14} mb={1.5}>
            {nutritionist.specialty}
          </Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} sx={{ fontSize: 15, color: i < stars ? "#FBBF24" : "#2a2a2a" }} />
            ))}
            <Typography color="#555" fontSize={13} ml={0.5}>
              {nutritionist.rating} · {nutritionist.reviews_count} reseñas
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            textAlign: "right",
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
            <LocationOnIcon sx={{ fontSize: 14, color: "#64748b" }} />
            <Typography fontSize={13} color="#555">{nutritionist.location}</Typography>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
            <BadgeIcon sx={{ fontSize: 14, color: "#64748b" }} />
            <Typography fontSize={13} color="#555">{nutritionist.license_number}</Typography>
          </Box>
        </Box>
      </Box>

      {/* BIO */}
      {nutritionist.bio && (
        <Box
          sx={{
            px: 3.5,
            py: 2.5,
            borderRadius: "14px",
            background: "#141d2b",
            border: "1px solid rgba(59,130,246,0.25)",
            mb: 3,
          }}
        >
          <Typography fontSize={13} color="#555" mb={1} textTransform="uppercase" letterSpacing="0.04em">
            Sobre mí
          </Typography>
          <Typography color="#aaa" fontSize={14} lineHeight={1.7}>
            {nutritionist.bio}
          </Typography>
        </Box>
      )}

      {/* INFO GRID */}
      <Grid container spacing={2} mb={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoCard icon={<LocalOfferIcon fontSize="small" />} title="Especialidades">
            {nutritionist.specialties?.length > 0 ? (
              <Box display="flex" flexWrap="wrap" gap={1}>
                {nutritionist.specialties.map((s: any) => (
                  <Chip
                    key={s.id}
                    label={s.name}
                    size="small"
                    sx={{
                      bgcolor: "rgba(59,130,246,0.22)",
                      color: "#60a5fa",
                      border: "1px solid rgba(59,130,246,0.2)",
                      fontSize: 12,
                    }}
                  />
                ))}
              </Box>
            ) : (
              <Typography color="#333" fontSize={13}>Sin especialidades</Typography>
            )}
          </InfoCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <InfoCard icon={<SchoolIcon fontSize="small" />} title="Educación">
            {nutritionist.education?.length > 0 ? (
              <Box display="flex" flexDirection="column" gap={2}>
                {nutritionist.education.map((edu: any) => (
                  <Box key={edu.id}>
                    <Typography fontSize={13} fontWeight={600} color="#ddd">{edu.degree}</Typography>
                    <Typography fontSize={12} color="#555">{edu.institution} · {edu.year}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="#333" fontSize={13}>Sin educación registrada</Typography>
            )}
          </InfoCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <InfoCard icon={<WorkIcon fontSize="small" />} title="Experiencia">
            {nutritionist.experience?.length > 0 ? (
              <Box display="flex" flexDirection="column" gap={2}>
                {nutritionist.experience.map((exp: any) => (
                  <Box key={exp.id}>
                    <Typography fontSize={13} fontWeight={600} color="#ddd">{exp.title}</Typography>
                    <Typography fontSize={12} color="#555">
                      {exp.company} · {exp.start_year} – {exp.end_year ?? "Presente"}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="#333" fontSize={13}>Sin experiencia registrada</Typography>
            )}
          </InfoCard>
        </Grid>
      </Grid>

      {/* REVIEWS */}
      <Box mb={2}>
        <Typography fontSize={13} color="#555" letterSpacing="0.04em" textTransform="uppercase" mb={2}>
          Reseñas de usuarios
        </Typography>
        <Grid container spacing={2}>
          {nutritionist.reviews?.length > 0 ? (
            nutritionist.reviews.map((r: any) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={r.id}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: "14px",
                    background: "#141d2b",
                    border: "1px solid rgba(59,130,246,0.25)",
                    transition: "border-color 0.2s",
                    "&:hover": { borderColor: "rgba(251,191,36,0.2)" },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "#3B82F622",
                        color: "#3B82F6",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {r.user?.name?.[0] ?? "U"}
                    </Avatar>
                    <Box>
                      <Typography fontSize={13} fontWeight={600} color="#ddd">
                        {r.user?.name ?? "Usuario"}
                      </Typography>
                      <Box display="flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} sx={{ fontSize: 11, color: i < r.rating ? "#FBBF24" : "#222" }} />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                  <Typography color="#555" fontSize={13} lineHeight={1.6}>
                    {r.comment}
                  </Typography>
                </Box>
              </Grid>
            ))
          ) : (
            <Grid size={{ xs: 12 }}>
              <Typography color="#333" fontSize={13}>Sin reseñas aún</Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}
