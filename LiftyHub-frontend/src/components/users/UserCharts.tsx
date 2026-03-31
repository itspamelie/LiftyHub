import { Card, CardContent, Typography } from "@mui/material"
import { Pie } from "react-chartjs-2"

export default function UserCharts({ genderChart, somatotypeChart }: any){

if(!genderChart || !somatotypeChart) return null

return(

<>

<Card sx={{background:"linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",color:"white",borderRadius:"16px"}}>
<CardContent>

<Typography variant="h6">
Distribución por género
</Typography>

<Pie data={genderChart} />

</CardContent>
</Card>


<Card sx={{background:"linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",color:"white",borderRadius:"16px"}}>
<CardContent>

<Typography variant="h6">
Distribución de somatotipos
</Typography>

<Pie data={somatotypeChart} />

</CardContent>
</Card>

</>

)

}