import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import { useState } from "react"
import { apiFetch } from "../../services/api"
import Swal from "sweetalert2";

export default function CreateExerciseFileModal({ open, onClose, onCreated, exercise }: any) {

  const [file, setFile] = useState<any>(null)

  const handleSubmit = async () => {
    try {
      const formData = new FormData()

      formData.append("exercise_id", exercise.id)
      if (file) {
        formData.append("file", file)
      }

      const res = await apiFetch("/exerciseFiles", {
        method: "POST",
        body: formData
      })

      onCreated(res.data)
      onClose()
      setFile(null)

      Swal.fire({
        icon: "success",
        title: "Archivo subido",
        background:  "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
        confirmButtonColor:"#60a5fa",
        color: "#fff"
      });

    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: "error",
        title: "Error al subir archivo",
        background:  "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
        confirmButtonColor:"#60a5fa",
        color: "#fff"
      });
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
          Subir archivo
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>

          <Box
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
            component="label"
          >
            <UploadFileIcon sx={{ fontSize: 30, color: "#94a3b8" }} />

            <Typography sx={{ mt: 1 }}>
              {file ? file.name : "Seleccionar archivo"}
            </Typography>

            <input
              type="file"
              hidden
              onChange={(e:any) => setFile(e.target.files[0])}
            />
          </Box>

          <Button onClick={handleSubmit} variant="contained">
            Guardar
          </Button>

        </Box>
      </DialogContent>
    </Dialog>
  )
}