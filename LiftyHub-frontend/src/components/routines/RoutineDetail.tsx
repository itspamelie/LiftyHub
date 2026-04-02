import { Box, Typography, IconButton, Button } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PersonIcon from "@mui/icons-material/Person";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function RoutineDetail() {

  const routine = {
    name: "FULL BODY PRINCIPIANTE",
    objective: "Adaptación",
    duration: 40,
    level: "Principiante",
    plan: "Free",
    somatotype: "Mesomorfo",
    img: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e"
  };

  const exercises = [
    {
      id: 1,
      name: "Press de banca",
      reps: 12,
      series: 4,
      rest: 60,
      technique: "Controlar bajada",
      img: "https://i.imgur.com/8Km9tLL.png"
    },
    {
      id: 2,
      name: "Sentadilla libre",
      reps: 10,
      series: 4,
      rest: 90,
      technique: "Rodillas afuera",
      img: "https://i.imgur.com/2nCt3Sbl.jpg"
    }
  ];

  return (
    <Box sx={{ background: "#000", minHeight: "100vh", width:"100%", color: "white" }}>

      {/* HEADER FULL WIDTH */}
      <Box
        sx={{
          width: "100%",
          height: 280,
          backgroundImage: `
            linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.9)),
            url(${routine.img})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center"
        }}
      >
        <Box>
          <Typography variant="h3" fontWeight="bold">
            {routine.name}
          </Typography>
          <Typography sx={{ color: "#cbd5e1", fontSize:"1.5rem"}}>
            Objetivo: {routine.objective}
          </Typography>
        </Box>
      </Box>

      {/* CONTENIDO */}
      <Box sx={{ p: 4 }}>

        {/* DETALLES */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            pl:4,
            pr:4,
            mb:1
          }}
        >
          <Box display="flex" gap={1} alignItems="center">
            <AccessTimeIcon />
            <Typography>Duración: {routine.duration} minutos</Typography>
          </Box>

          <Box display="flex" gap={1} alignItems="center">
            <FitnessCenterIcon />
            <Typography>Nivel: {routine.level}</Typography>
          </Box>

          <Box display="flex" gap={1} alignItems="center">
            <LocalOfferIcon />
            <Typography>Plan: {routine.plan}</Typography>
          </Box>

          <Box display="flex" gap={1} alignItems="center">
            <MonitorWeightIcon />
            <Typography> Somatotipo: {routine.somatotype}</Typography>
          </Box>

          <Box display="flex" gap={1} alignItems="center">
            <PersonIcon />
            <Typography>Elaborada por: Admin</Typography>
          </Box>
        </Box>

        {/* HEADER EJERCICIOS */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} p={4}>
          <Typography variant="h5">Ejercicios</Typography>

          <Button
            startIcon={<AddIcon />}
            sx={{
              background: "linear-gradient(90deg,#3a8dff,#5da8ff)",
              color: "white",
              borderRadius: "12px",
              px: 3
            }}
          >
            AGREGAR
          </Button>
        </Box>

        {/* LISTA EJERCICIOS */}
<Box
  sx={{
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)", // 👈 2 por fila
    gap: 2,
    px: 2
  }}
>          {exercises.map((ex) => (
            <Box
              key={ex.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderRadius: "20px",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)"
              }}
            >
              {/* IZQUIERDA */}
              <Box display="flex" gap={2} alignItems="center">
                <Box
                  sx={{
                    width: 110,
                    height: 110,
                    borderRadius: "16px",
                    backgroundImage: `url(${ex.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                />

                <Box>
                  <Typography fontWeight="bold">{ex.name}</Typography>
                  <Typography>Repeticiones: {ex.reps}</Typography>
                  <Typography>Series: {ex.series}</Typography>
                  <Typography>Descanso: {ex.rest}s</Typography>

                  <Box
                    sx={{
                      mt: 1,
                      px: 2,
                      py: "3px",
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.1)",
                      display: "inline-block"
                    }}
                  >
                    <Typography variant="caption">
                      Técnica: {ex.technique}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* DERECHA (ICONOS) */}
              <Box>
                <IconButton sx={{ color: "#34d399" }}>
                  <VisibilityIcon />
                </IconButton>

                <IconButton sx={{ color: "#60a5fa" }}>
                  <EditIcon />
                </IconButton>

                <IconButton sx={{ color: "#f87171" }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>

      </Box>
    </Box>
  );
}