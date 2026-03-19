import { Box, Typography, IconButton } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

export default function PlansTable({ plans, onEdit, onDelete }: any) {

return (

<Box
sx={{
background:"#202940",
borderRadius:"16px",
p:3,
color:"white"
}}
>

<Typography variant="h6" mb={2}>
Todos los planes
</Typography>

<Box
sx={{
display:"grid",
gridTemplateColumns:"1fr 2fr 1fr 1fr",
fontWeight:"bold",
borderBottom:"1px solid #2d3561",
pb:1
}}
>
<Typography>Nombre</Typography>
<Typography>Descripción</Typography>
<Typography>Precio</Typography>
<Typography>Acciones</Typography>
</Box>

{plans.map((plan:any)=>(

<Box
key={plan.id}
sx={{
display:"grid",
gridTemplateColumns:"1fr 2fr 1fr 1fr",
py:2,
borderBottom:"1px solid #2d3561",
alignItems:"center"
}}
>

<Typography>{plan.name}</Typography>
<Typography>{plan.description}</Typography>
<Typography>${plan.price}</Typography>

<Box display="flex" gap={2}>

<IconButton
sx={{color:"#60a5fa"}}
onClick={()=>onEdit(plan)}
>
<EditIcon/>
</IconButton>

<IconButton
sx={{color:"#f87171"}}
onClick={()=>onDelete(plan.id)}
>
<DeleteIcon/>
</IconButton>

</Box>

</Box>

))}

</Box>

)

}