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
import { useState, useEffect } from "react"
import { apiFetch } from "../../services/api"
import Swal from "sweetalert2";

export default function EditSomatotypeModal({ open, onClose, somatotype, onUpdated }: any) {

  const [type, setType] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<any>(null)

  // CARGAR DATOS AL ABRIR
  useEffect(() => {
    if (somatotype) {
      setType(somatotype.type || "")
      setDescription(somatotype.description || "")
      setFile(null) // importante, no cargamos imagen aquí
    }
  }, [somatotype])

const handleSubmit = async () => {
  try {
    const formData = new FormData()
    formData.append("type", type)
    formData.append("description", description)

    if (file) {
      formData.append("file", file)
    }

    formData.append("_method", "PUT")

    const res = await apiFetch(`/somatotypes/${somatotype.id}`, {
      method: "POST",
      body: formData
    })

    onUpdated(res.data)
    onClose()

    Swal.fire({
      icon: "success",
      title: "Somatotipo actualizado",
      background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
                    confirmButtonColor:"#60a5fa",

      color: "#fff"
    })

  } catch (error) {
    console.error(error)

    Swal.fire({
      icon: "error",
      title: "Error al actualizar",
      background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
                    confirmButtonColor:"#60a5fa",

      color: "#fff"
    })
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
>         <DialogContent
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
          Editar Somatotipo
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>

          <TextField
            placeholder="Tipo"
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

          <Box
            sx={{
              border: "2px dashed #2d3561",
              borderRadius: "12px",
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              "&:hover": {
                borderColor: "#6366f1",
                background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)"
              }
            }}
            component="label"
          >
            <UploadFileIcon sx={{ fontSize: 30, color: "#94a3b8" }} />

            <Typography variant="body2" sx={{ color: "#94a3b8", mt: 1 }}>
              {file ? file.name : "Cambiar imagen (opcional)"}
            </Typography>

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e:any) => setFile(e.target.files[0])}
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              mt: 2,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: "bold",
              background:  "#60a5fa",
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