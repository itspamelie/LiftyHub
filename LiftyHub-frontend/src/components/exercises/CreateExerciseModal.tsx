import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { useState } from "react"
import { apiFetch } from "../../services/api"
import Swal from "sweetalert2";
import MenuItem from "@mui/material/MenuItem"

export default function CreateExerciseModal({ open, onClose, onCreated }: any) {

  const [name, setName] = useState("")
  const [muscle, setMuscle] = useState("")
  const [technique, setTechnique] = useState("")
  const [categorie, setCategorie] = useState("")

  const handleSubmit = async () => {
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("muscle", muscle)
      formData.append("technique", technique)
      formData.append("categorie", categorie)


      const res = await apiFetch("/exercises", {
        method: "POST",
        body: formData
      })

      onCreated(res.data)
      onClose()

      setName("")
      setMuscle("")
      setTechnique("")
      setCategorie("")

      Swal.fire({
        icon: "success",
        title: "Ejercicio creado",
        background: "#0f172a",
        confirmButtonColor: "#60a5fa",
        color: "#fff"
      });

    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: "error",
        title: "Error al crear ejercicio",
        background: "#0f172a",
        color: "#fff"
      });
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent
        sx={{
          background: "#1a2035",
          color: "white",
          p: 4,
          position: "relative",
        }}
      >

        {/* ❌ BOTÓN CERRAR */}
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
          Nuevo ejercicio
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>

          {/* NOMBRE */}
          <TextField
            placeholder="Nombre del ejercicio"
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


          {/* MÚSCULO */}
<TextField
  select
  value={muscle}
  onChange={(e) => setMuscle(e.target.value)}
  fullWidth
  
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

{/* TÉCNICA */}
<TextField
  placeholder="Técnica"
  value={technique}
  onChange={(e) => setTechnique(e.target.value)}
  fullWidth
  multiline
  rows={4}
  sx={{
    "& .MuiOutlinedInput-root": {
      background: "#fff",
      borderRadius: "10px"
    }
  }}
/>

{/* CATEGORÍA */}
<TextField
  select
  value={categorie}
  onChange={(e) => setCategorie(e.target.value)}
  fullWidth
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

          {/* BOTÓN */}
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              mt: 2,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              py: 1.2,
              "&:hover": {
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)"
              }
            }}
          >
            Guardar
          </Button>

        </Box>
      </DialogContent>
    </Dialog>
  )
}