import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { apiFetch } from "../../services/api";

export default function EditExerciseRoutineModal({
  open,
  onClose,
  exerciseRoutine,
  onUpdated,
  routineId
}: any) {

  const [series, setSeries] = useState("");
  const [reps, setReps] = useState("");
  const [rest, setRest] = useState("");

  // cargar datos
  useEffect(() => {
    if (exerciseRoutine) {
      setSeries(exerciseRoutine.series || "");
      setReps(exerciseRoutine.reps || "");
      setRest(exerciseRoutine.rest || "");
    }
  }, [exerciseRoutine]);

  const handleSubmit = async () => {
    try {
      await apiFetch(`/exerciseRoutines/${exerciseRoutine.id}`, {
        method: "PUT",
        body: JSON.stringify({
          routine_id: routineId,
          exercise_id: exerciseRoutine.exercise_id,
          sets: series,
          repetitions: reps,
          seconds_rest: rest
        })
      });

      Swal.fire({
        icon: "success",
        title: "Ejercicio actualizado",
        confirmButtonColor: "#60a5fa",
        background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
        color: "#fff"
      });

      onUpdated();
      onClose();

    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        confirmButtonColor: "#60a5fa",
        background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
        color: "#fff"
      });
    }
  };

  if (!exerciseRoutine) return null;

  return (
<Dialog
  open={open}
  onClose={onClose}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: "20px", 
      overflow: "hidden"
    }
  }}
>    
  <DialogContent
        sx={{
          background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
          color: "white",
          p: 4,
          position: "relative"
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "#94a3b8"
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" mb={3} fontWeight="bold">
          Editar ejercicio
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>


<p>Series</p>
          <TextField
            type="number"
            value={series}
            onChange={(e) => setSeries(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "#fff",
                borderRadius: "10px"
              }
            }}
          />

<p>Repeticiones</p>
          <TextField
           
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "#fff",
                borderRadius: "10px"
              }
            }}
          />

<p>Descanso entre series (seg.)</p>

          <TextField
           
            type="number"
            value={rest}
            onChange={(e) => setRest(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "#fff",
                borderRadius: "10px"
              }
            }}
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              mt: 2,
              borderRadius: "10px",
              fontWeight: "bold",
              background: "#60a5fa",
              py: 1.2
            }}
          >
            Guardar cambios
          </Button>

        </Box>
      </DialogContent>
    </Dialog>
  );
}