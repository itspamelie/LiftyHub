import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getImageUrl } from "../../services/api";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility"


export default function RoutinesCard({ data, onDelete, onEdit }: any){
const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100%",
maxWidth: 400,
        height:500,
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
      {/* IMAGEN + GRADIENT */}
      <Box
        sx={{
          height: 300,
          backgroundImage: `
            linear-gradient(
              to bottom,
              rgba(58, 141, 255, 0.7),
              rgba(93, 168, 255, 0.6)
            ),
  url(${getImageUrl(data.img, "routines")})
            `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* CONTENIDO */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={1}>
           {data.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#cbd5e1", lineHeight: 1.6, mb:2 }}
        >
           Objetivo: {data.objective}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#cbd5e1", lineHeight: 1.6, mb:2 }}
        >
           Nivel: {data.level}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#cbd5e1", lineHeight: 1.6, mb:2 }}
        >
           Duracion: {data.duration} minutos
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#cbd5e1", lineHeight: 1.6, mb:2 }}
        >
           Plan: {data.plan.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#cbd5e1", lineHeight: 1.6, mb:2 }}
        >
           Somatotipo: {data.somatotype.type}
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

    </Box>
  );
}