import {Box,Typography,TextField,Button} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch, getImageUrl } from "../../services/api";
import Swal from "sweetalert2";

export default function AddExerciseToRoutine() {
  const { id } = useParams(); // routine id
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
const [sets, setSets] = useState("");
const [reps, setReps] = useState("");
const [rest, setRest] = useState("");
  {/*PARA OBTENER LOS EJERCICIOS */}
  useEffect(() => {
    const fetchExercises = async () => {
      const res = await apiFetch("/exercises");
      console.log(res);
      setExercises(res.data || []);
    };
    fetchExercises();
  }, []);

 const filtered = Array.isArray(exercises)
  ? exercises.filter((ex) =>
      ex.name.toLowerCase().includes(search.toLowerCase())
    )
  : [];

const handleSave = async () => {
  try {
    // VALIDACIÓN
    if (!selected) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona un ejercicio",
        background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
        color: "#fff",
        confirmButtonColor: "#60a5fa"
      });
      return;
    }

    if (!sets || !reps || !rest) {
      Swal.fire({
        icon: "warning",
        title: "Completa todos los campos",
        background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
        color: "#fff",
        confirmButtonColor: "#60a5fa"
      });
      return;
    }

    // LOADING
    Swal.fire({
      title: "Agregando ejercicio...",
      allowOutsideClick: false,
      background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
      color: "#fff",
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // REQUEST
    await apiFetch("/exerciseRoutines", {
      method: "POST",
      body: JSON.stringify({
        routine_id: id,
        exercise_id: selected.id,
        sets: Number(sets),
        repetitions: Number(reps),
        seconds_rest: Number(rest)
      })
    });

    Swal.close();

    // SUCCESS
    Swal.fire({
      icon: "success",
      title: "Ejercicio agregado a la rutina",
      background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
      confirmButtonColor: "#60a5fa",
      color: "#fff"
    });

    // REDIRECT
    navigate(`/dashboard/exercise-routine/${id}`);

  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Error al agregar el ejercicio",
      background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
      color: "#fff",
      confirmButtonColor: "#60a5fa"
    });
  }
};
  const [routine, setRoutine] = useState<any>(null);

  {/*OBTENER EL NOMBRE DE LA RUTINA */}
useEffect(() => {
  const fetchRoutine = async () => {
    const res = await apiFetch(`/routines/${id}`);
    setRoutine(res.data);
  };

  fetchRoutine();
}, [id]);
return (
<Box
  sx={{
    p: 4,
    color: "white",
    background: "#000",
    minHeight: "100vh",
    width: "100%",
    maxWidth: "100%",
    pl:7,
    pr:5
  }}
>
    <Typography
  sx={{
    mb: 1,
    cursor: "pointer",
    color: "#94a3b8",
    "&:hover": { color: "#fff" }
  }}
  onClick={() => navigate(`/dashboard/exercise-routine/${id}`)}
>
  ← Volver a la Rutina
</Typography>

<Box display={"flex"} justifyContent={"space-between"}>

     {/* HEADER */}
    <Typography variant="h4" fontWeight="bold">
      Agregar un Nuevo Ejercicio
    </Typography>

    <Typography
      sx={{
        color: "#fff",
        fontSize: "28px",
        mt: 1,
        mb: 3
      }}
    >
      Rutina: {routine?.name?.toUpperCase() || "..."}
    </Typography>
</Box>
   

    <Box display="flex" gap={4}>

      {/* 🔍 IZQUIERDA */}
      <Box sx={{ width: 300 }}>

        <Typography mb={1}>Ejercicios:</Typography>

        <TextField
          fullWidth
          placeholder="Buscar ejercicio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            mb: 2,
            input: { color: "white" },
            background: "rgba(255,255,255,0.05)",
            borderRadius: "10px"
          }}
        />

        {filtered.map((ex) => (
          <Box
            key={ex.id}
            onClick={() => setSelected(ex)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1.5,
              borderRadius: "10px",
              mb: 1,
              cursor: "pointer",
              background:
                selected?.id === ex.id
                  ? "linear-gradient(90deg,#3a8dff,#5da8ff)"
                  : "rgba(255,255,255,0.05)",
              "&:hover": {
                background: "rgba(255,255,255,0.1)"
              }
            }}
          >
            <Typography>{ex.name}</Typography>
          </Box>
        ))}
      </Box>

      {/* DERECHA CARD GRANDE */}
      <Box sx={{ flex: 1 }}>

        {selected && (
          <Box
            sx={{
              p: 3,
              borderRadius: "20px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)"
            }}
          >

            {/* HEADER EJERCICIO */}
            <Box display="flex" justifyContent="space-between" alignItems="center">

              <Box>
                <Typography fontWeight="bold" fontSize="18px">
                  {selected.name}
                </Typography>

                <Typography color="#94a3b8">
                  {selected.muscle}
                </Typography>
              </Box>

              {/* IMAGEN */}
            <Box
  sx={{
    width: 200,
    height: 140,
    borderRadius: "14px",
    backgroundImage: selected.exercise_files?.[0]
      ? `url(${getImageUrl(selected.exercise_files[0].file_path, "exercises")})`
      : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "#111",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
  }}
/>
            </Box>

            {/* INFO */}
            <Box mt={2} display="flex" gap={6}>
              <Box>
                <Typography color="#94a3b8">Categoría</Typography>
                <Typography>{selected.categorie}</Typography>
              </Box>

              <Box>
                <Typography color="#94a3b8">Músculo</Typography>
                <Typography>{selected.muscle}</Typography>
              </Box>

              <Box>
                <Typography color="#94a3b8">Técnica</Typography>
                <Typography sx={ellipsis}>
                  {selected.technique}
                </Typography>
              </Box>
            </Box>

            {/* FORMULARIO */}
            <Box mt={3}>

              <Typography fontWeight="bold" mb={2}>
                Configuración
              </Typography>

              <TextField
                fullWidth
                placeholder="Series (ej. 4)"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                sx={inputStyle}
              />

              <TextField
                fullWidth
                placeholder="Repeticiones (ej. 10)"
                sx={inputStyle}
                value={reps}
                onChange={(e) => setReps(e.target.value)}
              />

              <TextField
                fullWidth
                placeholder="Descanso en segundos (ej. 90)"
                sx={inputStyle}
                value={rest}
                onChange={(e) => setRest(e.target.value)}
              />
            </Box>

            {/* BOTONES */}
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="contained"
                sx={{
                  background: "#ef4444"
                }}
                onClick={() => navigate(-1)}
              >
                CANCELAR
              </Button>

              <Button
                variant="contained"
                sx={{
                  background: "linear-gradient(90deg,#3a8dff,#5da8ff)"
                }}
                onClick={handleSave}
              >
                Guardar
              </Button>
            </Box>

          </Box>
        )}

      </Box>
    </Box>
  </Box>
);
}

const ellipsis = {
  maxWidth: 250,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
};
const inputStyle = {
  mb: 2,
  input: { color: "white" },
  background: "rgba(255,255,255,0.05)",
  borderRadius: "10px"
};