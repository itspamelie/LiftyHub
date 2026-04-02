import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {apiFetch} from "../../services/api";
import TopNavbar from "../dashboard/TopNavbar";
import Grid from "@mui/material/Grid";
import { getImageUrl } from "../../services/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import CreateExerciseFileModal from "./CreateExerciseFileModal";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";



export default function ExerciseDetail() {
      const [loading, setLoading] = useState(true);
      const [openModal, setOpenModal] = useState(false);
  const { id } = useParams();
const navigate = useNavigate();
  const [files, setFiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
const [exercise, setExercise] = useState<any>(null);
  useEffect(() => {
const getData = async () => {
  try {
    const [filesRes, exerciseRes] = await Promise.all([
      apiFetch(`/exercise-files/${id}`),
      apiFetch(`/exercises/${id}`) // 👈 NUEVO
    ]);

    setFiles(filesRes.data);
    setExercise(exerciseRes.data);
    setLoading(false);
    Swal.close();

  } catch (error) {
    console.error(error);
    setLoading(false);
    Swal.close();
  }
};
    getData();
  }, [id]);

    // LOADING ALERT
    useEffect(() => {
      if (loading) {
        Swal.fire({
          title: "Cargando ejercicios...",
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

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === files.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? files.length - 1 : prev - 1
    );
  };



  const handleDelete = async () => {
  try {
    const fileToDelete = files[currentIndex];

    const confirm = await Swal.fire({
      title: "¿Eliminar archivo?",
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

    await apiFetch(`/exerciseFiles/${fileToDelete.id}`, {
      method: "DELETE"
    });

    // actualizar estado
    setFiles((prev:any) => {
      const updated = prev.filter((f:any) => f.id !== fileToDelete.id);

      // ajustar índice
      if (updated.length === 0) {
        setCurrentIndex(0);
      } else if (currentIndex >= updated.length) {
        setCurrentIndex(updated.length - 1);
      }

      return updated;
    });

    Swal.fire({
      icon: "success",
      title: "Archivo eliminado",
      confirmButtonColor: "#60a5fa",
      background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
      color: "#fff"
    });

  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Error al eliminar",
      confirmButtonColor: "#60a5fa",
      background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
      color: "#fff"
    });
  }
};
  return (

  <Box
  sx={{
    minHeight: "100vh",
    width: "100%",
    position: "relative",
    color: "#fff",
    overflow: "hidden"
  }}
>
  {/* BACKGROUND */}
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      backgroundImage: files.length
  ? `url(${getImageUrl(files[currentIndex].file_path, "exercises")})`
  : "none",
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: "blur(20px)",
      opacity: 0.25,
      zIndex: 0
    }}
  />

  {/* OVERLAY OSCURO */}
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      background: "linear-gradient(to right,180deg, #1e1f24 0%, #1e1e24 100%)",
      zIndex: 1
    }}
  />
  <Box sx={{ position: "relative", zIndex: 2, pl: 9,pr:9 }}>
    <TopNavbar />

<Button
  variant="contained"
  startIcon={<ArrowBackIcon />}
  onClick={() => navigate(`/dashboard/exercises/`)}
  sx={{
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: "bold",
    background: "linear-gradient(90deg,#3a8dff,#5da8ff)",
    mb: 5,
    ml: 1
  }}
>
  Regresar
</Button>
{/*SI NO HAY ARCHIVOS... */}
{files.length === 0 ? (

  <Box
    sx={{
      height: "60vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      gap: 3
    }}
  >
    <Typography variant="h5" fontWeight="bold">
      No tienes imágenes o videos!
    </Typography>

    <Typography sx={{ opacity: 0.7 }}>
      Agrega uno para Acceder a la vista previa
    </Typography>

   <Button
  variant="contained"
  startIcon={<AddIcon />}
  onClick={() => setOpenModal(true)}
  sx={{
    borderRadius: "12px",
    background: "linear-gradient(90deg,#3a8dff,#5da8ff)",
    px: 4
  }}
>
  Agregar archivo
</Button>

  </Box>

    
) : (


<Grid container spacing={4} >
          {/* IZQUIERDA - IMAGEN */}
<Grid item xs={12} md={6}>
<Box
  sx={{
    position: "relative", //para flechas
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
    background: "#111"
  }}
>
  <img
    src={getImageUrl(files[currentIndex].file_path, "exercises")}
    key={files[currentIndex]?.id}
    style={{
      width: "100%",
      height: "420px",
      objectFit: "cover"
    }}
  />

  {/* Overlay degradado */}
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)"
    }}
  />

  {/* Flechas */}
  <IconButton
    onClick={prevImage}
    sx={{
      position: "absolute",
      top: "50%",
      left: 12,
      transform: "translateY(-50%)",
      color: "#fff",
      backdropFilter: "blur(10px)",
      backgroundColor: "rgba(255,255,255,0.15)",
      "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" }
    }}
  >
    <ArrowBackIosIcon />
  </IconButton>

  <IconButton
    onClick={nextImage}
    sx={{
      position: "absolute",
      top: "50%",
      right: 12,
      transform: "translateY(-50%)",
      color: "#fff",
      backdropFilter: "blur(10px)",
      backgroundColor: "rgba(255,255,255,0.15)",
      "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" }
    }}
  >

    <ArrowForwardIosIcon />
  </IconButton>

   
</Box>


<Button
  disableRipple
  variant="contained"
  startIcon={<DeleteIcon />}
  onClick={handleDelete}
  sx={{
    borderRadius: "12px",
    px: 10,
    mt: 3,
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(239,68,68,0.8)",

    "&:hover": {
      backgroundColor: "rgba(239,68,68,1)"
    },

    "&:focus": {
      outline: "none"
    }
  }}
>
  Eliminar foto
</Button>
      </Grid>
      

      {/* DERECHA - INFO */}
<Grid item xs={12} md={6}>
  <Box
    sx={{
      p: 4,
      borderRadius: "24px",
      backdropFilter: "blur(20px)",
      background: "rgba(255,255,255,0.05)",
      height:"420px",
      border: "1px solid rgba(255,255,255,0.1)",
      display:"flex",
      flexDirection:"column",
      justifyContent:"center"
    }}
  >
    <Typography variant="h4" fontWeight="bold" mb={2}>
      {exercise.name}
    </Typography>

    {/* Info rápida */}
    <Box display="flex" flexWrap="wrap"  flexDirection="column"  gap={2} mb={3}>
      <Typography sx={{ opacity: 0.8 }}>
        <strong>Categoría:</strong> {exercise.categorie}
      </Typography>

      <Typography sx={{ opacity: 0.8 }}>
        <strong>Músculo:</strong> {exercise.muscle}
      </Typography>
    </Box>


    {/* Técnica */}
    <Typography fontWeight="bold" mt={2} mb={1}>
      Técnica
    </Typography>

    <Box
      sx={{
        p: 2,
        borderRadius: "12px",
        background: "rgba(0,0,0,0.3)"
      }}
    >
      {exercise.technique?.split("\n").map((line: string, i: number) => (
        <Typography key={i} sx={{ fontSize: "0.95rem", mb: 0.5 }}>
          • {line}
        </Typography>
      ))}
    </Box>

    {/* Botones */}

    
    <Box mt={4} display="flex" gap={2}>
 <Button
  variant="outlined"
  startIcon={<AddIcon />}
  onClick={() => setOpenModal(true)}
  sx={{
    borderColor: "#fff",
    color: "#fff",
    borderRadius: "12px",
    px: 3
  }}
>
  Agregar archivo
</Button>


     <Button
  variant="contained"
  startIcon={<FitnessCenterIcon />}
  sx={{
    background: "linear-gradient(45deg, #3b82f6, #2563eb)",
    borderRadius: "12px",
    px: 3,
  }}
>
  Añadir a rutina
</Button>
    </Box>
  </Box>
</Grid>
    </Grid>
)}
  </Box>
  <CreateExerciseFileModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  onCreated={(newFile:any) => {
  setOpenModal(false);

  setFiles((prev:any) => [...prev, newFile]);
  setCurrentIndex(files.length); // ir al nuevo
}}
  exercise={exercise}
/>
  </Box>
  
);

}