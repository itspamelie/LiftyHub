import { Card, CardContent, Typography } from "@mui/material"
import { Pie } from "react-chartjs-2"

export default function UserCharts({ genderChart, somatotypeChart }: any){

if(!genderChart || !somatotypeChart) return null

return(

<>

<Card sx={{background: "linear-gradient(135deg, #13141c 0%, #0f1117 100%)",color:"white",borderRadius: "20px", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)"}}>
<CardContent>

<Typography variant="h6">
Distribución por género
</Typography>

<Pie data={genderChart} />

</CardContent>
</Card>


<Card sx={{background: "linear-gradient(135deg, #13141c 0%, #0f1117 100%)",color:"white",borderRadius: "20px", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)"}}>
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