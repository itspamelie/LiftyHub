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
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch, getImageUrl } from "../../services/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import EditExerciseRoutineModal from "./EditExerciseRoutineModal";
import LabelIcon from '@mui/icons-material/Label';


export default function RoutineDetail() {
      const [loading, setLoading] = useState(true);

  const { id } = useParams();
const navigate = useNavigate();
const [routine, setRoutine] = useState<any>(null);
const [exercises, setExercises] = useState<any[]>([]);
const [openEditModal, setOpenEditModal] = useState(false);
const [selectedExercise, setSelectedExercise] = useState<any>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await apiFetch(`/routines/${id}/exercises`);

const routineData = res.routine;
const exercisesData = res.exercises || res.data || [];
setRoutine(routineData);

if (exercisesData.length > 0) {
const mapped = exercisesData.map((item: any) => {

  const exercise = item.exercise || item;

  const files = exercise.exercise_files;

  const randomImg =
    files && files.length > 0
      ? files[Math.floor(Math.random() * files.length)].file_path
      : null;

  return {
    id: item.id,
    exercise_id: exercise.id,
    name: exercise.name,
    img: randomImg,
    reps: item.repetitions,
    series: item.sets,
    rest: item.seconds_rest,
    technique: exercise.technique
  };
});

  setExercises(mapped);
} else {
  setExercises([]);
}
      
      setLoading(false);
      Swal.close();

    } catch (error) {
      console.error("ERROR:", error);
      setLoading(false);
      Swal.close();
    }
  };

  fetchData();
}, [id]);


    // LOADING ALERT
    useEffect(() => {
      if (loading) {
        Swal.fire({
          title: "Cargando rutinas...",
          text: "Obteniendo información",
          background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
          color: "#fff",
                confirmButtonColor:"#60a5fa",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
      }
    }, [loading]);
  
    if (loading) return null;


const handleDelete = async (id: number) => {
  try {

    const confirm = await Swal.fire({
      title: "¿Eliminar ejercicio de la rutina?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
      color: "#fff"
    });

    if (!confirm.isConfirmed) return;

    await apiFetch(`/exerciseRoutines/${id}`, {
      method: "DELETE"
    });

    //quitar de la vista
    setExercises(prev => prev.filter(ex => ex.id !== id));

    Swal.fire({
      icon: "success",
      title: "Ejercicio eliminado de la rutina",
      confirmButtonColor: "#60a5fa",
      background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
      color: "#fff"
    });

  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Error al eliminar el ejercicio",
      confirmButtonColor: "#60a5fa",
      background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
      color: "#fff"
    });
  }
};
  return (
    <Box sx={{ background: "#000", width:"100%", color: "white" }}>

      {/* HEADER FULL WIDTH */}
      <Box
        sx={{
          width: "100%",
          height: 280,
          backgroundImage: `
            linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.9)),
           url(${getImageUrl(routine.img, "routines")})
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
            <Typography>Plan: {routine.plan?.name}</Typography>
          </Box>

          <Box display="flex" gap={1} alignItems="center">
            <MonitorWeightIcon />
            <Typography> Somatotipo: {routine.somatotype?.type}</Typography>
          </Box>

          <Box display="flex" gap={1} alignItems="center">
            <LabelIcon></LabelIcon>
            <Typography>Categoria: {routine.category}</Typography>
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
  onClick={() => navigate(`/dashboard/routine/${id}/add-exercise`)}
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
{exercises.length === 0 ? (
  <Typography sx={{ px: 4, color: "#cbd5e1" }}>
    No tienes ejercicios! Agrega uno a tu rutina.
  </Typography>
) : (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)", // 2 por fila
      gap: 2,
      px: 2
    }}
  >
    {exercises.map((ex) => (
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
              backgroundImage: `url(${getImageUrl(ex.img, "exercises")})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />

          <Box>
            <Typography fontWeight="bold">{ex.name}</Typography>
            <Typography>Repeticiones: {ex.reps}</Typography>
            <Typography>Series: {ex.series}</Typography>
            <Typography>Descanso: {ex.rest}s entre serie</Typography>

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
          {/* VISUALIZAR */}
          <IconButton
            onClick={() => navigate(`/dashboard/exercise/${ex.id}`)}
            sx={{
              color: "#34d399",
              "&:hover": { backgroundColor: "rgba(52,211,153,0.1)" }
            }}
          >
            <VisibilityIcon />
          </IconButton>

     <IconButton
  sx={{ color: "#60a5fa" }}
  onClick={() => {
    setSelectedExercise(ex);
    setOpenEditModal(true);
  }}
>
  <EditIcon />
</IconButton>

          <IconButton
            sx={{ color: "#f87171" }}
            onClick={() => handleDelete(ex.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      
    ))}
  </Box>

)}

      </Box> {/* CONTENIDO */}
      <EditExerciseRoutineModal
  open={openEditModal}
  onClose={() => setOpenEditModal(false)}
  exerciseRoutine={selectedExercise}
  routineId={id}
  onUpdated={() => {
    // vuelve a cargar ejercicios
    window.location.reload(); // (temporal fácil)
  }}
/>
    </Box>  
  );
}