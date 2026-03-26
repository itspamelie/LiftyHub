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
import UploadFileIcon from "@mui/icons-material/UploadFile"
import { useState, useEffect } from "react"
import { apiFetch } from "../../services/api"
import Swal from "sweetalert2"

export default function EditRoutinesModal({ open, onClose, routine, onUpdated }: any) {

  const [name, setName] = useState("")
  const [objective, setObjective] = useState("")
  const [level, setLevel] = useState("")
  const [duration, setDuration] = useState("")
  const [planId, setPlanId] = useState("")
  const [somatotypeId, setSomatotypeId] = useState("")
  const [file, setFile] = useState<any>(null)

  const [plans, setPlans] = useState<any[]>([]) // ✅ nunca undefined
  const [somatotypes, setSomatotypes] = useState<any[]>([])

  // 🔹 Cargar datos al abrir modal
  useEffect(() => {
    if (routine) {
      setName(routine.name || "")
      setObjective(routine.objective || "")
      setLevel(routine.level || "")
      setDuration(routine.duration || "")
      setPlanId(routine.plan_id || routine.plan?.id || "")
      setSomatotypeId(routine.somatotype_id || routine.somatotype?.id || "")
      setFile(null)
    }
  }, [routine])

  // 🔹 Cargar selects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const plansRes = await apiFetch("/plans")
        const somasRes = await apiFetch("/somatotypes")

        setPlans(plansRes.data || [])
        setSomatotypes(somasRes.data || [])
      } catch (error) {
        console.error("Error cargando selects", error)
      }
    }

    fetchData()
  }, [])

  // 🔹 Submit
  const handleSubmit = async () => {
    try {
      const formData = new FormData()

      formData.append("_method", "PUT") // 🔥 Laravel fix

      formData.append("name", name)
      formData.append("objective", objective)
      formData.append("level", level)
      formData.append("duration", duration)
      formData.append("plan_id", planId)
      formData.append("somatotype_id", somatotypeId)

      if (file) {
        formData.append("img", file)
      }

      const res = await apiFetch(`/routines/${routine.id}`, {
        method: "POST",
        body: formData
      })

      onUpdated(res.data.data) // 🔥 importante

      onClose()

      Swal.fire({
        icon: "success",
        title: "Rutina actualizada",
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

  if (!routine) return null

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

        {/* ❌ Cerrar */}
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
          Editar Rutina
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>

          {/* Nombre */}
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

          {/* Objetivo */}
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

          {/* Nivel */}
          <TextField
            select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "#fff",
                borderRadius: "10px"
              }
            }}
          >
            <MenuItem value="principiante">Principiante</MenuItem>
            <MenuItem value="intermedio">Intermedio</MenuItem>
            <MenuItem value="avanzado">Avanzado</MenuItem>
          </TextField>

          {/* Duración */}
          <TextField
            type="number"
            placeholder="Duración (min)"
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

          {/* Plan */}
          <TextField
            select
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "#fff",
                borderRadius: "10px"
              }
            }}
          >
            {plans?.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Somatotipo */}
          <TextField
            select
            value={somatotypeId}
            onChange={(e) => setSomatotypeId(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "#fff",
                borderRadius: "10px"
              }
            }}
          >
            {somatotypes?.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.type}
              </MenuItem>
            ))}
          </TextField>

          {/* Upload */}
          <Box
            component="label"
            sx={{
              border: "2px dashed #2d3561",
              borderRadius: "12px",
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              "&:hover": {
                borderColor: "#6366f1",
                background: "rgba(99,102,241,0.05)"
              }
            }}
          >
            <UploadFileIcon sx={{ fontSize: 30, color: "#94a3b8" }} />

            <Typography variant="body2" sx={{ color: "#94a3b8", mt: 1 }}>
              {file ? file.name : "Cambiar imagen (opcional)"}
            </Typography>

            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e: any) => {
                const f = e.target.files?.[0]
                if (f) setFile(f)
              }}
            />
          </Box>

          {/* Botón */}
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