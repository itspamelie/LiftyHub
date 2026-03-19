import { Dialog, DialogContent, Box, Typography, TextField, Button, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

export default function EditPlanModal({
open,
onClose,
plan,
onChange,
onUpdate
}: any) {

return (

<Dialog
open={open}
onClose={onClose}
maxWidth="sm"
fullWidth
PaperProps={{
sx:{
background:"#1a2035",
color:"white",
borderRadius:"16px"
}
}}
>

<DialogContent>

<IconButton
onClick={onClose}
sx={{
position:"absolute",
right:10,
top:10,
color:"white"
}}
>
<CloseIcon/>
</IconButton>

<Typography variant="h6" mb={3}>
Editar Plan
</Typography>

<Box display="flex" flexDirection="column" gap={2}>

<TextField
name="name"
value={plan?.name || ""}
onChange={onChange}
placeholder="Nombre del plan"
sx={{ background:"white", borderRadius:"10px" }}
/>

<TextField
name="description"
value={plan?.description || ""}
onChange={onChange}
placeholder="Descripción"
multiline
rows={3}
sx={{ background:"white", borderRadius:"10px" }}
/>

<TextField
name="price"
type="number"
value={plan?.price || ""}
onChange={onChange}
placeholder="Precio"
sx={{ background:"white", borderRadius:"10px" }}
/>

<Button
variant="contained"
onClick={onUpdate}
sx={{ background:"#3b82f6", mt:2 }}
>
Actualizar plan
</Button>

</Box>

</DialogContent>
</Dialog>

)

}