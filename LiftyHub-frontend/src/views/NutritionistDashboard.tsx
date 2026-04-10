import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  IconButton
} from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { apiFetch } from "../services/api";
import TopNavbar from "../components/dashboard/TopNavbar";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getImageUrl
 } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function NutritionistDashboard() {
  const [nutritionists, setNutritionists] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate= useNavigate();

  useEffect(() => {
    const getNutritionists = async () => {
      try {
        const data = await apiFetch("/nutritionistProfiles");
        setNutritionists(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        Swal.close();
      }
    };

    getNutritionists();
  }, []);

  useEffect(() => {
    if (loading) {
      Swal.fire({
        title: "Cargando nutriólogos...",
        background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
        color: "#fff",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });
    }
  }, [loading]);

  if (loading) return null;

  const searchNutritionists = async (value: string) => {
    setSearch(value);

    try {
      let endpoint = "/nutritionistProfiles";

      if (value.trim() !== "") {
        endpoint = `/nutritionists?search=${value}`;
      }

      const data = await apiFetch(endpoint);
      setNutritionists(data.data || []);
    } catch (error) {
      console.error("Error buscando", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:"#000000",
        width: "100%",
        pl:4

      }}
    >
      <TopNavbar />

      {/* BUSCADOR */}
      <TextField
        placeholder="Buscar nutriólogo..."
        value={search}
        onChange={(e) => searchNutritionists(e.target.value)}
        sx={{
          width: "300px",
          ml: 5,
          input: { color: "white" },
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            "& fieldset": { borderColor: "#333" }
          }
        }}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 2, color: "#aaa" }} />
        }}
      />

      {/* GRID DE CARDS */}
      <Box
        sx={{
          p: 5,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 3
        }}
      >
        {nutritionists.map((n) => (
<Card
  key={n.id}
  sx={{
    borderRadius: "16px",
    background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
    color: "white",
    overflow: "hidden"
  }}
>
  {/* HEADER */}
  <Box p={2}>
    
    {/* FILA SUPERIOR (FOTO + INFO DERECHA) */}
    <Box display="flex" gap={2}>
      
      {/* FOTO */}
      <Avatar
  src={getImageUrl(n.profile_pic, "nutritionists")}
  sx={{ width: 70, height: 70 }}
/>

      {/* INFO DERECHA */}
      <Box flex={1}>
        <Typography fontSize="12px" color="#aaa">
          Lic. No: {n.license_number}
        </Typography>

        <Typography fontSize="12px" color="#aaa" mt={0.5}>
          Rating: ⭐⭐⭐⭐⭐ {n.rating || "4.5"}
        </Typography>
      </Box>

      {/* STATUS  */}
      <Chip
        label={n.active ? "Activo" : "Inactivo"}
        size="small"
        sx={{
          background: n.active ? "#22c55e" : "#6b7280",
          color: "white",
          fontSize: "11px",
          height: "24px"
        }}
      />
    </Box>

    {/* NOMBRE */}
    <Typography fontWeight="bold" mt={2}>
      {n.user.name}
    </Typography>

 
  </Box>

  {/* FOOTER */}
<Box
  sx={{
    display: "flex",
    justifyContent: "space-around",
    background: "linear-gradient(180deg, #131416 0%, #232327 100%)",
    py: 1.5
  }}
>
  {/* VISUALIZAR */}
  <Box textAlign="center">
    <IconButton
  onClick={() => navigate(`/dashboard/nutritionists/${n.id}`)}
  sx={{
    background: "#3b82f6",
    color: "white",
    mb: 0.5,
    "&:hover": { background: "#2563eb" }
  }}
>
  <VisibilityIcon />
</IconButton>
    <Typography fontSize="12px">Visualizar</Typography>
  </Box>

  {/* DESACTIVAR 
  <Box textAlign="center">
    <IconButton
      sx={{
        background: "#f59e0b", 
        color: "white",
        mb: 0.5,
        "&:hover": { background: "#d97706" }
      }}
    >
      <DeleteIcon /> 
    </IconButton>
    <Typography fontSize="12px">Desactivar</Typography>
  </Box>
  */}
</Box>

</Card>
        ))}
      </Box>
    </Box>
  );
}