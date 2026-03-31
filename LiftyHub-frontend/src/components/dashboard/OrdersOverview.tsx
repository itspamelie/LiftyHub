import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

interface Props{
 dashboard:any
}

const OrdersOverview:React.FC<Props> = ({dashboard}) => {

const actividad = dashboard?.actividad || []

return (

<Card
sx={{
background:"linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
color:"white",
borderRadius:"16px"
}}
>

<CardContent>

<Typography variant="h6" fontWeight="bold">
Actividad reciente
</Typography>

<Typography variant="body2" sx={{color:"#8f9bb3", mb:2}}>
Últimas suscripciones registradas
</Typography>

{actividad.map((act:any,index:number)=>{

const fecha = new Date(act.created_at)

return(

<Box
key={index}
sx={{
display:"flex",
alignItems:"center",
mb:2
}}
>

<Box
sx={{
width:10,
height:10,
borderRadius:"50%",
background:"#4caf50",
mr:2
}}
/>

<Box>

<Typography variant="body2">
{act.usuario} se suscribió a {act.plan}
</Typography>

<Typography
variant="caption"
sx={{color:"#8f9bb3"}}
>
{fecha.toLocaleString()}
</Typography>

</Box>

</Box>

)

})}

</CardContent>

</Card>

)

}

export default OrdersOverview