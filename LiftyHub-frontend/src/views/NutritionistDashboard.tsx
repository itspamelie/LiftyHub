import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { apiFetch } from "../services/api";
import TopNavbar from "../components/dashboard/TopNavbar";
import SearchIcon from "@mui/icons-material/Search";

export default function NutritionistDashboard() {
  // ================== STATES ==================
  const [nutritionists, setNutritionists] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

// ================== GET NUTRITIONISTS ==================
useEffect(() => {
  const getNutritionists = async () => {
    try {
      const data = await apiFetch("/nutritionists");
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

  // ================== LOADING ==================
  useEffect(() => {
    if (loading) {
      Swal.fire({
        title: "Cargando nutriólogos...",
        text: "Obteniendo información",
        background: "#0f172a",
        color: "#fff",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    }
  }, [loading]);

  if (loading) return null;

const searchNutritionists = async (value: string) => {
  setSearch(value);

  try {
    let endpoint = "/nutritionists";

    if (value.trim() !== "") {
      endpoint = `/nutritionists?search=${value}`;
      // 👆 esto es mejor práctica que crear otra ruta
    }

    const data = await apiFetch(endpoint);
    setNutritionists(data.data || []);
  } catch (error) {
    console.error("Error buscando nutriólogos", error);
  }
};

  // ================== UI ==================
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#1a2035"
      }}
    >
      <TopNavbar />

      {/* SEARCH */}
      <TextField
        size="medium"
        placeholder="Buscar nutriólogo..." 
        variant="outlined"
        value={search}
        onChange={(e) => searchNutritionists(e.target.value)}
        sx={{
          width: "300px",
          mb: 1,
          mt: 4,
          pl: 5,
          input: { color: "white" },
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            color: "white",
            "& fieldset": {
              borderColor: "#2d3561"
            }
          }
        }}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 3 }} />
        }}
      />

      {/* CONTENIDO */}
      <Box
        sx={{
          flexGrow: 1,
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 3,
          p: 5
        }}
      >
        {/* Aquí luego va tabla y demás */}
      </Box>
    </Box>
  );
}