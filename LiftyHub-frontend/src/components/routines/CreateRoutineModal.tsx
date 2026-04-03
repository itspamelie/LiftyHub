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
import { useEffect, useState } from "react"
import { apiFetch } from "../../services/api"
import Swal from "sweetalert2";
import MenuItem from "@mui/material/MenuItem"
import UploadFileIcon from "@mui/icons-material/UploadFile";
export default function CreateRoutineModal({ open, onClose, onCreated }: any) {

  const [name, setName] = useState("")
  const [objective, setObjective] = useState("")
  const [level, setLevel] = useState("")
  const [duration, setDuration] = useState("")
  const [plan, setPlan] = useState("")
  const [somatotype, setSomatotype] = useState("")
  const [img, setImg] = useState("")
  const [category, setCategory] = useState("")

  // NUEVOS STATES
  const [plans, setPlans] = useState<any[]>([])
  const [somatotypes, setSomatotypes] = useState<any[]>([])
  const [file, setFile] = useState<File | null>(null)
const [preview, setPreview] = useState("")

const handleFileChange = (e: any) => {
  const selected = e.target.files[0]
  if (selected) {
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }
}

  // GET PLANS Y SOMATOTYPES
  useEffect(() => {
    const fetchData = async () => {
      try {
        const plansRes = await apiFetch("/plans")
        const somatotypesRes = await apiFetch("/somatotypes")

        setPlans(plansRes.data || [])
        setSomatotypes(somatotypesRes.data || [])
      } catch (error) {
        console.error("Error cargando selects", error)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async () => {
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("objective", objective)
      formData.append("level", level)
      formData.append("duration", duration)

      formData.append("plan_id", plan)
      formData.append("somatotype_id", somatotype)
      formData.append("category", category)

if (file) {
  formData.append("img", file)
}
      const res = await apiFetch("/routines", { 
        method: "POST",
        body: formData
      })

      onCreated(res.data)
      onClose()

      setDuration("")
      setLevel("")
      setName("")
      setPlan("")
      setSomatotype("")
      setObjective("")
      setImg("")
      setCategory("")

      Swal.fire({
        icon: "success",
        title: "Rutina creada",
        background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
        confirmButtonColor: "#60a5fa",
        color: "#fff"
      });

    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: "error",
        title: "Error al crear la rutina",
        background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
        color: "#fff",
              confirmButtonColor:"#60a5fa",

      });
    }
  }

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
          Nueva rutina
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>

          {/* NOMBRE */}
          <TextField
            placeholder="Nombre de la rutina"
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

          {/* OBJECTIVE */}
          <TextField
            placeholder="Objetivo"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "#fff",
                borderRadius: "10px"
              }
            }}
          />

          {/* PLAN  */}
          <TextField
            select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "#fff",
                borderRadius: "10px"
              }
            }}
          >
            <MenuItem value=""><em>Selecciona Plan</em></MenuItem>

            {plans.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>

          {/* DURACIÓN */}
          <TextField
            placeholder="Duración"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "#fff",
                borderRadius: "10px"
              }
            }}
          />

          {/* SOMATOTIPO  */}
          <TextField
            select
            value={somatotype}
            onChange={(e) => setSomatotype(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "#fff",
                borderRadius: "10px"
              }
            }}
          >
            <MenuItem value=""><em>Selecciona somatotipo</em></MenuItem>

            {somatotypes.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.type}
              </MenuItem>
            ))}
          </TextField>


          {/*NIVEL*/}
          {/* CATEGORÍA */}
<TextField
  select
  fullWidth
              value={level}
            onChange={(e) => setLevel(e.target.value)}
  sx={{
    "& .MuiOutlinedInput-root": {
      background: "#fff",
      borderRadius: "10px"
    }
  }}
>
          <MenuItem value=""><em>Selecciona Nivel</em></MenuItem>
                      <MenuItem value="Principiante">Principiante</MenuItem>
                      <MenuItem value="Intermedio">Intermedio</MenuItem>
                      <MenuItem value="Avanzado">Avanzado</MenuItem>
          </TextField>



<TextField
  select
  fullWidth
              value={category}
            onChange={(e) => setCategory(e.target.value)}
  sx={{
    "& .MuiOutlinedInput-root": {
      background: "#fff",
      borderRadius: "10px"
    }
  }}
>
          <MenuItem value=""><em>Selecciona Categoría</em></MenuItem>
                      <MenuItem value="Todo">Todo</MenuItem>
                      <MenuItem value="Fuerza">Fuerza</MenuItem>
                      <MenuItem value="Movilidad">Movilidad</MenuItem>
                      <MenuItem value="Cardio">Cardio</MenuItem>
                      <MenuItem value="HIIT">HIIT</MenuItem>
                      <MenuItem value="Full Body">Full Body</MenuItem>
          </TextField>
{/* FILE BONITO */}
<Box
  component="label"
  sx={{
    border: "2px dashed #2d3561",
    borderRadius: "12px",
    p: 3,
    textAlign: "center",
    cursor: "pointer",
    transition: "0.3s",
    position: "relative",
    "&:hover": {
      borderColor: "#6366f1",
      background: "rgba(99,102,241,0.05)"
    }
  }}
>
  {preview ? (
    <img
      src={preview}
      alt="preview"
      style={{
        width: "100%",
        maxHeight: "180px",
        objectFit: "cover",
        borderRadius: "10px"
      }}
    />
  ) : (
    <>
      <UploadFileIcon sx={{ fontSize: 30, color: "#94a3b8" }} />

      <Typography variant="body2" sx={{ color: "#94a3b8", mt: 1 }}>
        {file ? file.name : "Seleccionar imagen"}
      </Typography>
    </>
  )}

  <input
    type="file"
    hidden
    accept="image/*"
    onChange={handleFileChange}
  />
</Box>

          {/* BOTÓN */}
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              mt: 2,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: "bold",
              background: "#60a5fa",
              py: 1.2
            }}
          >
            Guardar
          </Button>

        </Box>
      </DialogContent>
    </Dialog>
  )
}