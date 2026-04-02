import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { apiFetch, getImageUrl } from "../../services/api";

export default function RoutineDetail() {
  const { id } = useParams();
  const [routine, setRoutine] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiFetch(`/exercise-routines/${id}`);
        setRoutine(res);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  if (!routine) return <Typography color="white">Cargando...</Typography>;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#000", // 👈 fondo negro como pediste
        color: "white",
        p: 4
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          height: 250,
          borderRadius: "20px",
          overflow: "hidden",
          mb: 4,
          backgroundImage: `
            linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.9)),
            url(${getImageUrl(routine.routine.img, "routines")})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "flex-end",
          p: 3
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {routine.routine.name}
          </Typography>
          <Typography variant="body1" color="#94a3b8">
            OBJETIVO: {routine.routine.objective}
          </Typography>
        </Box>
      </Box>

      {/* INFO GENERAL */}
      <Box sx={{ mb: 4 }}>
        <Typography>Duración: {routine.routine.duration} min</Typography>
        <Typography>Nivel: {routine.routine.level}</Typography>
        <Typography>Plan: {routine.routine.plan?.name}</Typography>
        <Typography>Somatotipo: {routine.routine.somatotype?.type}</Typography>
      </Box>

      {/* EJERCICIOS */}
      <Typography variant="h5" mb={2}>
        Ejercicios
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {routine.exercises.map((ex: any) => (
          <Box
            key={ex.id}
            sx={{
              display: "flex",
              gap: 2,
              background: "#111",
              borderRadius: "16px",
              p: 2,
              alignItems: "center"
            }}
          >
            {/* Imagen */}
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "12px",
                backgroundImage: `url(${getImageUrl(ex.img, "exercises")})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />

            {/* Info */}
            <Box>
              <Typography fontWeight="bold">{ex.name}</Typography>
              <Typography variant="body2">
                Reps: {ex.pivot.reps}
              </Typography>
              <Typography variant="body2">
                Series: {ex.pivot.series}
              </Typography>
              <Typography variant="body2">
                Descanso: {ex.pivot.rest}s
              </Typography>
              <Typography variant="body2" color="#94a3b8">
                Técnica: {ex.pivot.technique}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}