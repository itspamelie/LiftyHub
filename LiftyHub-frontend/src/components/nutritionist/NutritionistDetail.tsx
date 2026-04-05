import {
  Box,
  Typography,
  Avatar,
  Chip,
  Paper
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch, getImageUrl } from "../../services/api";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid"; 
import StarIcon from "@mui/icons-material/Star";
export default function NutritionistDetail() {
  const { id } = useParams();
  const [nutritionist, setNutritionist] = useState<any>(null);
  const navigate =useNavigate();
  useEffect(() => {
    const getNutritionist = async () => {
      try {
        const res = await apiFetch(`/nutritionistProfiles/${id}`);
        setNutritionist(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) getNutritionist();
  }, [id]);

  if (!nutritionist) return null;
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%", 
        background: "#0a0a0a",
        color: "white",
        p: 4,
        boxSizing: "border-box",
        pl:7
      }}
    >

    <Typography
  sx={{
    mb: 1,
    cursor: "pointer",
    color: "#94a3b8",
    "&:hover": { color: "#fff" }
  }}
  onClick={() => navigate(`/dashboard/nutritionists`)}
>
  ← Volver
</Typography>

      {/* HEADER */}
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Detalles del perfil:  {nutritionist.user.name}
      </Typography>

      {/* CARD PRINCIPAL */}
      <Paper
        sx={{
          p: 3,
          borderRadius: "16px",
          background: "#1c1c1c",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%"
        }}
      >
        {/* IZQUIERDA */}
        <Box display="flex" gap={3} alignItems="center">
          <Avatar  src={getImageUrl(nutritionist.profile_pic, "nutritionists")}
  sx={{ width: 80, height: 80 }}/>

          <Box>
            <Typography fontWeight="bold" fontSize="20px">
              {nutritionist.user.name}
            </Typography>

            <Typography color="#aaa" mt={1}>
              Nutricionista Clínica y Deportiva
            </Typography>

            <Box display="flex" alignItems="center" gap={1} mt={1}>
              ⭐⭐⭐⭐⭐
              <Typography>{nutritionist.rating}</Typography>
            </Box>
          </Box>

            <Chip
        label={nutritionist.active ? "Activo" : "Inactivo"}
        size="small"
        sx={{
          background: nutritionist.active ? "#22c55e" : "#6b7280",
          color: "white",
          fontSize: "16px",
          height: "30px"
        }}
      />
        </Box>

        {/* DERECHA */}
        <Box textAlign="right">
          <Typography fontWeight="bold">{nutritionist.rating} ⭐⭐⭐⭐⭐</Typography>
          <Typography color="#aaa">{nutritionist.reviews_count} reseñas</Typography>
        </Box> 
      </Paper>

      {/* GRID */}
      <Box
        mt={3}
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 3,
          width: "100%"
        }}
      >
        {/* DATOS */}
        <Paper
          sx={{
            p: 2,
            borderRadius: "12px",
            background: "#1c1c1c",
            color: "white"
          }}
        >
          <Typography fontWeight="bold">DATOS GENERALES</Typography>

          <Typography mt={1} color="#aaa">
            Licencia: {nutritionist.license_number}
          </Typography>
          <Typography color="#aaa">Ubicación: {nutritionist.location}</Typography>
          <Typography color="#aaa">Bio: {nutritionist.bio}</Typography>
        </Paper>

        {/* EDUCACIÓN */}
<Paper
  sx={{
    p: 2,
    borderRadius: "12px",
    background: "#1c1c1c",
    color: "white"
  }}
>
  <Typography fontWeight="bold">EDUCACIÓN</Typography>

  {nutritionist?.education?.length > 0 ? (
    nutritionist.education.map((edu: any) => (
      <Box key={edu.id} mt={1}>
        <Typography>{edu.degree}</Typography>
        <Typography color="#aaa">
          {edu.institution} ({edu.start_year} - {edu.end_year})
        </Typography>
      </Box>
    ))
  ) : (
    <Typography mt={1} color="#aaa">
      Sin educación registrada
    </Typography>
  )}
</Paper>
        {/* EXPERIENCIA */}
<Paper
  sx={{
    p: 2,
    borderRadius: "12px",
    background: "#1c1c1c",
    color: "white"
  }}
>
  <Typography fontWeight="bold">
    EXPERIENCIA LABORAL
  </Typography>

  {nutritionist?.experience?.length > 0 ? (
    nutritionist.experience.map((exp: any) => (
      <Box key={exp.id} mt={1}>
        <Typography>{exp.position}</Typography>
        <Typography color="#aaa">
          {exp.company} ({exp.start_year} - {exp.end_year})
        </Typography>
      </Box>
    ))
  ) : (
    <Typography mt={1} color="#aaa">
      Sin experiencia registrada
    </Typography>
  )}
</Paper>

            {/* ESPECIALIDADES */}
      <Paper
  sx={{
    p: 2,
    borderRadius: "12px",
    background: "#1c1c1c",
    color: "white"
  }}
>
  <Typography fontWeight="bold">
    ESPECIALIDADES
  </Typography>

  {nutritionist?.specialties?.length > 0 ? (
    nutritionist.specialties.map((spec: any) => (
      <Typography key={spec.id} mt={1}>
        {spec.name}
      </Typography>
    ))
  ) : (
    <Typography mt={1} color="#aaa">
      Sin especialidades
    </Typography>
  )}
</Paper>


      </Box>
      <Box>
    {/* HEADER */}
 <Typography variant="h5" fontWeight="bold" mb={3}>
  Reviews de los Usuarios
</Typography>

<Grid container spacing={2}>
  {nutritionist?.reviews?.length > 0 ? (
    nutritionist.reviews.map((review: any) => (
      <Grid item xs={12} sm={6} md={3} key={review.id}>
        <Paper
          sx={{
            p: 2,
            borderRadius: "16px",
            background: "#1c1c1c",
            color: "white",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transition: "0.3s",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0px 10px 20px rgba(0,0,0,0.4)"
            }
          }}
        >
          {/* Header usuario */}
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Avatar
              src={review.user?.profile_pic || ""}
              alt={review.user?.name}
            />
            <Typography fontWeight="bold">
              {review.user?.name}
            </Typography>
          </Box>

          {/* Estrellas */}
          <Box display="flex" mb={1}>
            {[...Array(review.rating)].map((_, i) => (
              <StarIcon key={i} sx={{ color: "#FFD700" }} />
            ))}
          </Box>

          {/* Comentario */}
          <Typography color="#aaa" fontSize="0.9rem">
            {review.comment}
          </Typography>
        </Paper>
      </Grid>
    ))
  ) : (
    <Typography mt={1} color="#aaa">
      Sin reseñas
    </Typography>
  )}
</Grid>
</Box>
    </Box>
  );
}