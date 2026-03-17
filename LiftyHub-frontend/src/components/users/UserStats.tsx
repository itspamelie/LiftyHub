import { Card, CardContent, Typography, Box } from "@mui/material"

export default function UserStats({ stats }: any) {

return (

<Box
sx={{
display:"grid",
gridColumn:"span 4",
gridTemplateColumns:"repeat(4,1fr)",
gap:3
}}
>

<Card sx={{background:"#202940",color:"white",borderRadius:"16px"}}>
<CardContent>
<Typography variant="body2" sx={{color:"#8f9bb3"}}>
Usuarios registrados
</Typography>
<Typography variant="h5" fontWeight="bold">
{stats?.total_users}
</Typography>
</CardContent>
</Card>

<Card sx={{background:"#202940",color:"white",borderRadius:"16px"}}>
<CardContent>
<Typography variant="body2" sx={{color:"#8f9bb3"}}>
Usuarios nuevos este mes
</Typography>
<Typography variant="h5" fontWeight="bold">
{stats?.new_users_this_month}
</Typography>
</CardContent>
</Card>

<Card sx={{background:"#202940",color:"white",borderRadius:"16px"}}>
<CardContent>
<Typography variant="body2" sx={{color:"#8f9bb3"}}>
Entrenaron hoy
</Typography>
<Typography variant="h5" fontWeight="bold">
{stats?.trained_today}
</Typography>
</CardContent>
</Card>

<Card sx={{background:"#202940",color:"white",borderRadius:"16px"}}>
<CardContent>
<Typography variant="body2" sx={{color:"#8f9bb3"}}>
Peso promedio
</Typography>
<Typography variant="h5" fontWeight="bold">
{stats?.average_weight} kg
</Typography>
</CardContent>
</Card>

</Box>

)
}