import {
  Box, TextField, Button
} from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { apiFetch } from "../services/api";
import TopNavbar from "../components/dashboard/TopNavbar";
import SearchIcon from "@mui/icons-material/Search";
import RoutinesCard from "../components/routines/RoutinesCard"
import CreateRoutineModal from "../components/routines/CreateRoutineModal"
import EditRoutinesModal from "../components/routines/EditRoutinesModal"; 

export default function RoutinesDashboard() {

  // STATES
  const [routines, setRoutines] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false)

  const [openEdit, setOpenEdit] = useState(false)
  const [editRoutine, setEditRoutine] = useState<any>(null)

  const openEditModal = (routine: any) => {
    setEditRoutine(routine)
    setOpenEdit(true)
  }

  const closeEditModal = () => {
    setOpenEdit(false)
    setEditRoutine(null)
  }

  // GET 
  useEffect(() => {
    apiFetch("/routines")
      .then((data) => {
        setRoutines(data.data || []);
        setLoading(false);
        Swal.close();
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        Swal.close();
      });
  }, []);

  // LOADING ALERT
  useEffect(() => {
    if (loading) {
      Swal.fire({
        title: "Cargando rutinas...",
        text: "Obteniendo información",
        background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
        color: "#fff",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    }
  }, [loading]);

  if (loading) return null;

  // SEARCH
  const searchRoutines = async (value: string) => {
    setSearch(value);

    try {
      if (value.trim() === "") {
        const data = await apiFetch("/routines");
        setRoutines(data.data || []);
        return;
      }

      const data = await apiFetch(`/search-routines?search=${value}`);
      setRoutines(data.data || []);
    } catch (error) {
      console.error("Error buscando rutinas", error);
    }
  };

  // DELETE
  const deleteRoutine = async (id: number) => {

    const result = await Swal.fire({
      title: "¿Eliminar rutina?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#e71d1d",
      background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
      color: "#fff"
    })

    if (!result.isConfirmed) return

    try {
      await apiFetch(`/routines/${id}`, {
        method: "DELETE"
      })

      setRoutines(routines.filter(r => r.id !== id))

      Swal.fire({
        icon: "success",
        title: "Rutina eliminada",
        background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
        confirmButtonColor: "#60a5fa",
        color: "#fff"
      })

    } catch (error) {
      console.error(error)

      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
        confirmButtonColor: "#60a5fa",
        color: "#fff"
      })
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#000000",
        width: "100%"
      }}
    >

      <TopNavbar />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 8,
          mt: 1
        }}
      >
        {/* BUSCADOR */}
        <TextField
          size="medium"
          placeholder="Buscar Rutina..."
          variant="outlined"
          value={search}
          onChange={(e) => searchRoutines(e.target.value)}
          sx={{
            width: "300px",
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
            startAdornment: <SearchIcon sx={{ mr: 2 }} />
          }}
        />

        {/* BOTÓN */}
        <Button
          variant="contained"
          onClick={() => setOpenCreate(true)}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "bold",
            background: "linear-gradient(90deg,#3a8dff,#5da8ff)"
          }}
        >
          + Agregar
        </Button>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 3,
          p: 5
        }}
      >

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(280px, 1fr))",
            gap: 2,
            p: 4
          }}
        >
          {routines.map((r) => (
            <RoutinesCard
              key={r.id}
              data={r}
              onEdit={openEditModal}
              onDelete={deleteRoutine}
            />
          ))}
        </Box>

      </Box>

      <CreateRoutineModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
       onCreated={async () => {
  const data = await apiFetch("/routines")
  setRoutines(data.data || [])
}}
      />

      <EditRoutinesModal
  open={openEdit}
  onClose={closeEditModal}
  routine={editRoutine}
  onUpdated={async () => {
    const data = await apiFetch("/routines")
    setRoutines(data.data || [])
  }}
/>

    </Box>
  );
}