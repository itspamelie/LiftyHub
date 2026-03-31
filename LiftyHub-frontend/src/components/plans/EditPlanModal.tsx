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

export default function EditPlanModal({
  open,
  onClose,
  plan,
  onChange,
  onUpdate
}: any) {

  const textFieldStyles = {
    "& .MuiInputLabel-root": {
      color: "white"
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#60a5fa"
    },
    "& .MuiOutlinedInput-root": {
      background: "white",
      borderRadius: "10px"
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
          background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
          color: "white",
          borderRadius: "16px"
        }
      }}
    >
      <DialogContent>

        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
            color: "white"
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" mb={3}>
          Editar Plan
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>

          <TextField
            name="name"
            label="Nombre del plan"
            variant="outlined"
            fullWidth
            value={plan?.name || ""}
            onChange={onChange}
            sx={textFieldStyles}
          />

          <TextField
            name="description"
            label="Descripción"
            variant="outlined"
            multiline
            rows={3}
            fullWidth
            value={plan?.description || ""}
            onChange={onChange}
            sx={textFieldStyles}
          />

          <TextField
            name="price"
            label="Precio"
            type="number"
            variant="outlined"
            fullWidth
            value={plan?.price || ""}
            onChange={onChange}
            sx={textFieldStyles}
          />

          <TextField
            name="level"
            label="Nivel"
            type="number"
            variant="outlined"
            fullWidth
            value={plan?.level || ""}
            onChange={onChange}
            sx={textFieldStyles}
          />

          <TextField
            name="max_routines"
            label="Cantidad de rutinas"
            type="number"
            variant="outlined"
            fullWidth
            value={plan?.max_routines || ""}
            onChange={onChange}
            sx={textFieldStyles}
          />

          <Button
            variant="contained"
            onClick={onUpdate}
            sx={{
              background: "#3b82f6",
              mt: 2,
              borderRadius: "10px",
              "&:hover": {
                background: "#2563eb"
              }
            }}
          >
            Actualizar plan
          </Button>

        </Box>

      </DialogContent>
    </Dialog>
  )
}