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


export default function ExerciseDetail() {
      const [loading, setLoading] = useState(true);
  const { id } = useParams();
const navigate = useNavigate();
  const [files, setFiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await apiFetch(`/exercise-files/${id}`);
        setFiles(res.data);
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

  if (!files.length) return <p>Cargando...</p>;

  const exercise = files[0].exercise;

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
      backgroundImage: `url(${getImageUrl(files[currentIndex].file_path, "exercises")})`,
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
  onClick={() => navigate(`/dashboard/exercises/`)}
  sx={{
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: "bold",
    background: "linear-gradient(90deg,#3a8dff,#5da8ff)",
    mb:5,
    ml:1
  }}
>
  Regresar a Ejercicios
</Button>
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
        sx={{
          background: "#fff",
          color: "#000000",
          borderRadius: "12px",
          px: 3
        }}
      >
        Ver Video
      </Button>

      <Button
        variant="contained"
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
  </Box>
  </Box>
);

}