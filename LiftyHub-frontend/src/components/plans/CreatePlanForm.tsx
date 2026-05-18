import { Box, Typography, TextField, Button } from "@mui/material"

export default function CreatePlanForm({
name,
description,
price,
level,
max_routines,
setName,
setDescription,
setPrice,
setLevel,
setMax_routines,
onSubmit
}: any) {

return (

<Box
sx={{
background: "linear-gradient(135deg, #13141c 0%, #0f1117 100%)",
borderRadius: "20px",
border: "1px solid rgba(255,255,255,0.07)",
boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
p:3
}}
>

<Typography variant="h6" color="white" mb={2}>
Crear Plan
</Typography>

<TextField
fullWidth
placeholder="Nombre del plan"
value={name}
onChange={(e)=>setName(e.target.value)}
sx={{
mb:2,
background:"white",
borderRadius:"10px"
}}
/>

<TextField
fullWidth
placeholder="Descripción"
multiline
rows={3}
value={description}
onChange={(e)=>setDescription(e.target.value)}
sx={{
mb:2,
background:"white",
borderRadius:"10px"
}}
/>

<TextField
fullWidth
placeholder="Precio"
type="number"
value={price}
onChange={(e)=>setPrice(e.target.value)}
sx={{
mb:3,
background:"white",
borderRadius:"10px"
}}
/>


<TextField
fullWidth
placeholder="Nivel"
type="number"
value={level}
onChange={(e)=>setLevel(e.target.value)}
sx={{
mb:3,
background:"white",
borderRadius:"10px"
}}
/>

<TextField
fullWidth
placeholder="# Rutinas"
type="number"
value={max_routines}
onChange={(e)=>setMax_routines(e.target.value)}
sx={{
mb:3,
background:"white",
borderRadius:"10px"
}}
/>

<Button
variant="contained"
fullWidth
onClick={onSubmit}
sx={{
background:"#3b82f6",
borderRadius:"10px"
}}
>
CREAR PLAN
</Button>

</Box>

)

}