import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material"

export default function TopStreaks({ topStreaks = [] }: any){

return(

<Card sx={{gridColumn:"span 2",background:"#202940",color:"white",borderRadius:"16px"}}>
<CardContent>

<Typography variant="h6">
Usuarios con mejor racha 🔥
</Typography>

<Table>

<TableHead>
<TableRow>
<TableCell sx={{ color: "#8f9bb3"}}>#</TableCell>
<TableCell sx={{ color: "#8f9bb3"}}>Usuario</TableCell>
<TableCell sx={{ color: "#8f9bb3"}}>Racha</TableCell>
</TableRow>
</TableHead>

<TableBody>

{topStreaks.map((user:any,index:number)=>(
<TableRow key={index}>
<TableCell sx={{ color: "#8f9bb3"}}>{index+1}</TableCell>
<TableCell sx={{ color: "#8f9bb3"}}>{user.name}</TableCell>
<TableCell sx={{ color: "#8f9bb3"}}>{user.streak} días</TableCell>
</TableRow>
))}

</TableBody>

</Table>

</CardContent>
</Card>

)

}