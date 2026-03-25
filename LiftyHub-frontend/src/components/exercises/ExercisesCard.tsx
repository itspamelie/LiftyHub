import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getImageUrl } from "../../services/api";


export default function ExercisesCard({ data, onDelete, onEdit }: any){

  return (
    <Box
      sx={{
        width: "100%",
maxWidth: 400,
        height:500,
        maxHeight:500,
        borderRadius: "20px",
        overflow: "hidden",
        background: "rgba(255,255,255,0.05)",
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
              rgba(168, 85, 247, 0.7),
              rgba(59, 130, 246, 0.7)
            ),
  url(${getImageUrl(data.file, "exercises")})
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
           {data.muscle}
        </Typography>

         <Typography
          variant="body2"
          sx={{ color: "#cbd5e1", lineHeight: 1.6, mb:2 }}
        >
           {data.technique}
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