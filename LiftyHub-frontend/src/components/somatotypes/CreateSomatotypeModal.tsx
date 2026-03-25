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
import UploadFileIcon from "@mui/icons-material/UploadFile"
import { useState } from "react"
import { apiFetch } from "../../services/api"
import Swal from "sweetalert2";


export default function CreateSomatotypeModal({ open, onClose, onCreated }: any) {

  const [type, setType] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<any>(null)

  const handleSubmit = async () => {
    try {
      const formData = new FormData()
      formData.append("type", type)
      formData.append("description", description)
if (file) {
  formData.append("file", file)
}
      const res = await apiFetch("/somatotypes", {
        method: "POST",
        body: formData
      })

      onCreated(res.data)
      onClose()

      setType("")
      setDescription("")
      setFile(null)

           Swal.fire({
              icon: "success",
              title: "Somatotipo creado",
              background: "#0f172a",
              confirmButtonColor:"#60a5fa",
              color: "#fff"
            });
    } catch (error) {
      console.error(error)
       Swal.fire({
              icon: "error",
              title: "Error al crear somatotipo",
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
          Nuevo Somatotipo
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>

          {/* INPUT TIPO */}
          <TextField
            placeholder="Tipo (Ej. Ectomorfo)"
            value={type}
            onChange={(e) => setType(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "#fff",
                borderRadius: "10px"
              }
            }}
          />

          {/* INPUT DESCRIPCIÓN */}
          <TextField
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "#fff",
                borderRadius: "10px"
              }
            }}
          />

          {/* FILE BONITO */}
          <Box
            sx={{
              border: "2px dashed #2d3561",
              borderRadius: "12px",
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              transition: "0.3s",
              "&:hover": {
                borderColor: "#6366f1",
                background: "rgba(99,102,241,0.05)"
              }
            }}
            component="label"
          >
            <UploadFileIcon sx={{ fontSize: 30, color: "#94a3b8" }} />

            <Typography variant="body2" sx={{ color: "#94a3b8", mt: 1 }}>
              {file ? file.name : "Seleccionar imagen"}
            </Typography>

            <input
              type="file"
              hidden
              onChange={(e:any) => setFile(e.target.files[0])}
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