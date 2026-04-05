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

export default function NutritionistDashboard() {
  const [nutritionists, setNutritionists] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
        width: "100%" 

      }}
    >
      <TopNavbar />

      {/* 🔍 BUSCADOR */}
      <TextField
        placeholder="Buscar nutriólogo..."
        value={search}
        onChange={(e) => searchNutritionists(e.target.value)}
        sx={{
          width: "300px",
          mt: 4,
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

      {/* 🧑‍⚕️ GRID DE CARDS */}
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
              background: "#1c1c1c",
              color: "white"
            }}
          >
            <CardContent>
              {/* HEADER */}
              <Box display="flex" justifyContent="space-between">
                <Box display="flex" gap={2}>
                  <Avatar
                    src={n.profilepic}
                    sx={{ width: 60, height: 60 }}
                  />

                  <Box>
                    <Typography fontWeight="bold">
                      {n.name}
                    </Typography>
                    <Typography fontSize="12px" color="#aaa">
                      Rating: ⭐ {n.rating || "4.5"}
                    </Typography>
                  </Box>
                </Box>

                {/* 🔥 LICENCIA A LA DERECHA */}
                <Typography fontSize="12px" color="#aaa">
                  Lic. No: {n.license}
                </Typography>
              </Box>

              {/* STATUS */}
              <Box mt={2}>
                <Chip
                  label={n.active ? "Activo" : "Inactivo"}
                  size="small"
                  sx={{
                    background: n.active ? "#16a34a" : "#6b7280",
                    color: "white"
                  }}
                />
              </Box>

              {/* ACCIONES */}
              <Box
                mt={3}
                display="flex"
                justifyContent="space-around"
              >
                <IconButton sx={{ color: "#3b82f6" }}>
                  <VisibilityIcon />
                </IconButton>

                <IconButton sx={{ color: "#22c55e" }}>
                  <EditIcon />
                </IconButton>

                <IconButton sx={{ color: "#ef4444" }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}