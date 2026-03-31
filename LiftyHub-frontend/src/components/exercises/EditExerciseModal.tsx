import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  MenuItem
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { useState, useEffect } from "react"
import { apiFetch } from "../../services/api"
import Swal from "sweetalert2";

export default function EditExerciseModal({ open, onClose, exercise, onUpdated }: any) {

  const [name, setName] = useState("")
  const [muscle, setMuscle] = useState("")
  const [technique, setTechnique] = useState("")
  const [categorie, setCategorie] = useState("")

  // ARGAR DATOS
  useEffect(() => {
    if (exercise) {
      setName(exercise.name || "")
      setMuscle(exercise.muscle || "")
      setTechnique(exercise.technique || "")
      setCategorie(exercise.categorie || "")
    }
  }, [exercise])

  const handleSubmit = async () => {
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("muscle", muscle)
      formData.append("technique", technique)
      formData.append("categorie", categorie)

   
      formData.append("_method", "PUT")

      const res = await apiFetch(`/exercises/${exercise.id}`, {
        method: "POST",
        body: formData
      })

      onUpdated(res.data)
      onClose()

      Swal.fire({
        icon: "success",
        title: "Ejercicio actualizado",
        background: "#0f172a",
        color: "#fff"
      })

    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        background: "#0f172a",
        color: "#fff"
      })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent
        sx={{
          background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
          color: "white",
          p: 4,
          position: "relative",
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

          {/* NOMBRE */}
          <TextField
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "#fff",
                borderRadius: "10px"
              }
            }}
          />

          {/* MUSCULO */}
          <TextField
            select
            value={muscle}
            onChange={(e) => setMuscle(e.target.value)}
            fullWidth
            SelectProps={{ displayEmpty: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "#fff",
                borderRadius: "10px"
              }
            }}
          >
            <MenuItem value=""><em>Selecciona músculo</em></MenuItem>
            <MenuItem value="Gluteo">Glúteo</MenuItem>
            <MenuItem value="Pantorrilla">Pantorrilla</MenuItem>
            <MenuItem value="Triceps">Tríceps</MenuItem>
            <MenuItem value="Biceps">Bíceps</MenuItem>
            <MenuItem value="Hombro">Hombro</MenuItem>
            <MenuItem value="Espalda">Espalda</MenuItem>
            <MenuItem value="Cuadriceps">Cuádriceps</MenuItem>
            <MenuItem value="Femoral">Femoral</MenuItem>
            <MenuItem value="Abdomen">Abdomen</MenuItem>
            <MenuItem value="Pecho">Pecho</MenuItem>
          </TextField>

          {/* TECNICA */}
          <TextField
            placeholder="Técnica"
            value={technique}
            onChange={(e) => setTechnique(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "#fff",
                borderRadius: "10px"
              }
            }}
          />

          {/* CATEGORIA */}
          <TextField
            select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            fullWidth
            SelectProps={{ displayEmpty: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "#fff",
                borderRadius: "10px"
              }
            }}
          >
            <MenuItem value=""><em>Selecciona categoría</em></MenuItem>
            <MenuItem value="Cardio">Cardio</MenuItem>
            <MenuItem value="Hipertrofia">Hipertrofia</MenuItem>
            <MenuItem value="Fuerza">Fuerza</MenuItem>
            <MenuItem value="Resistencia">Resistencia</MenuItem>
            <MenuItem value="Movilidad">Movilidad</MenuItem>
            <MenuItem value="Funcional">Funcional</MenuItem>
          </TextField>


          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              mt: 2,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              py: 1.2
            }}
          >
            Actualizar
          </Button>

        </Box>
      </DialogContent>
    </Dialog>
  )
}