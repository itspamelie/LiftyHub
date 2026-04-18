import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility"
import { useState } from "react"
import CreateExerciseFileModal from "./CreateExerciseFileModal"
import { useNavigate } from "react-router-dom";

export default function ExercisesCard({ data, onDelete, onEdit }: any){
const [selectedExercise] = useState<any>(null)
const [openUpload, setOpenUpload] = useState(false)
const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: "100%",
maxWidth: 400,
        maxHeight:500,
        borderRadius: "20px",
        overflow: "hidden",
        background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
   
      {/* CONTENIDO */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={1}>
           {data.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#cbd5e1", lineHeight: 1.6, mb:2 }}
        >
           Musculo: {data.muscle}
        </Typography>

         <Typography
          variant="body2"
          sx={{ color: "#cbd5e1", lineHeight: 1.6, mb:2 }}
        >
           Tecnica: {data.technique}
        </Typography>
         <Typography
          variant="body2"
          sx={{ color: "#cbd5e1", lineHeight: 1.6, mb:2 }}
        >
          Categoria: {data.categorie}
        </Typography>
      </Box>

      {/* ACCIONES */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          pb: 2,
          borderTop: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <Typography variant="caption" sx={{ color: "#94a3b8", mt:2 }}>
          Acciones
        </Typography>

        <Box>

             {/* VISUALIZAR */}
<IconButton
  onClick={() => navigate(`/dashboard/exercise/${data.id}`)}
  sx={{
    color: "#34d399",
    "&:hover": { backgroundColor: "rgba(52,211,153,0.1)" }
  }}
>
  <VisibilityIcon />
</IconButton>

  
          <IconButton
  onClick={() => onEdit(data)}
  sx={{
    color: "#60a5fa",
    "&:hover": { backgroundColor: "rgba(96,165,250,0.1)", mt:2 }
  }}
>
  <EditIcon />
</IconButton>

          <IconButton  onClick={() => onDelete(data.id)}
            sx={{
              color: "#f87171",
              "&:hover": { backgroundColor: "rgba(248,113,113,0.1)" , mt:2}
            }}
          >
            <DeleteIcon />
          </IconButton>


        </Box>
      </Box>


<CreateExerciseFileModal
  open={openUpload}
  onClose={() => setOpenUpload(false)}
  exercise={selectedExercise}
  onCreated={() => {
    setOpenUpload(false)
  }}
/>
    </Box>
  );
}