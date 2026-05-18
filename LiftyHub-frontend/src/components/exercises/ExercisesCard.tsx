import { Box, Typography, IconButton, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import CreateExerciseFileModal from "./CreateExerciseFileModal";
import { useNavigate } from "react-router-dom";

export default function ExercisesCard({ data, onDelete, onEdit }: any) {
  const [selectedExercise] = useState<any>(null);
  const [openUpload, setOpenUpload] = useState(false);
  const navigate = useNavigate();

  return (
    <Box sx={{
      borderRadius: "20px",
      overflow: "hidden",
      background: "linear-gradient(135deg, #13141c 0%, #0f1117 100%)",
      border: "1px solid rgba(255,255,255,0.07)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      color: "white",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* CONTENIDO */}
      <Box sx={{ p: 2.5, flex: 1 }}>

        {/* Nombre */}
        <Typography fontWeight={700} fontSize={15} mb={1.5} sx={{
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {data.name}
        </Typography>

        {/* Chips de muscle y categoria */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
          {data.muscle && (
            <Chip label={data.muscle} size="small" sx={{
              background: "rgba(59,130,246,0.15)", color: "#60a5fa",
              border: "1px solid rgba(59,130,246,0.3)", fontSize: 11, fontWeight: 600,
            }} />
          )}
          {data.categorie && (
            <Chip label={data.categorie} size="small" sx={{
              background: "rgba(139,92,246,0.15)", color: "#a78bfa",
              border: "1px solid rgba(139,92,246,0.3)", fontSize: 11, fontWeight: 600,
            }} />
          )}
        </Box>

        {/* Técnica truncada */}
        {data.technique && (
          <Typography fontSize={12} sx={{
            color: "#64748b", lineHeight: 1.6,
            display: "-webkit-box", WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {data.technique}
          </Typography>
        )}
      </Box>

      {/* FOOTER ACCIONES */}
      <Box sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        px: 1.5, py: 1,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "linear-gradient(180deg, #131416 0%, #232327 100%)",
        gap: 0.5,
      }}>
        <IconButton size="small" onClick={() => navigate(`/dashboard/exercise/${data.id}`)}
          sx={{ color: "#34d399", "&:hover": { background: "rgba(52,211,153,0.1)" } }}>
          <VisibilityIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onEdit(data)}
          sx={{ color: "#60a5fa", "&:hover": { background: "rgba(96,165,250,0.1)" } }}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(data.id)}
          sx={{ color: "#f87171", "&:hover": { background: "rgba(248,113,113,0.1)" } }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>

      <CreateExerciseFileModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        exercise={selectedExercise}
        onCreated={() => setOpenUpload(false)}
      />
    </Box>
  );
}
