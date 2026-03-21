import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { apiFetch } from "../services/api";
import TopNavbar from "../components/dashboard/TopNavbar";
import SearchIcon from "@mui/icons-material/Search";

export default function ExercisesDashboard() {
  // ================== STATES ==================
  const [exercises, setExercises] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ================== GET EXERCISES ==================
  useEffect(() => {
    const getExercises = async () => {
      try {
        const data = await apiFetch("/exercises");
        setExercises(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        Swal.close();
      }
    };

    getExercises();
  }, []);

  // ================== LOADING ==================
  useEffect(() => {
    if (loading) {
      Swal.fire({
        title: "Cargando ejercicios...",
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

  // ================== SEARCH ==================
  const searchExercises = async (value: string) => {
    setSearch(value);

    try {
      let endpoint = "/exercises";

      if (value.trim() !== "") {
        endpoint = `/exercises?search=${value}`;
      }

      const data = await apiFetch(endpoint);
      setExercises(data.data || []);
    } catch (error) {
      console.error("Error buscando ejercicios", error);
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
        placeholder="Buscar ejercicio..."
        variant="outlined"
        value={search}
        onChange={(e) => searchExercises(e.target.value)}
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
        {/* Aquí puedes meter tabla o cards */}
        {exercises.map((exercise) => (
          <Box
            key={exercise.id}
            sx={{
              background: "#202940",
              color: "white",
              p: 2,
              borderRadius: "12px",
              mb: 2
            }}
          >
            <h3>{exercise.name}</h3>
            <p>Músculo: {exercise.muscle}</p>
            <p>Técnica: {exercise.technique}</p>
          </Box>
        ))}
      </Box>
    </Box>
  );
}