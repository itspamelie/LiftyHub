import { Box, Typography, TextField, IconButton } from "@mui/material";
import { Card, CardContent } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import {
Button,
Select,
MenuItem,
InputLabel,
FormControl
} from "@mui/material";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Line, Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function UserDashboard() {
    const [stats, setStats] = useState<any>({})
const [loading, setLoading] = useState(true)
const [genre, setGenre] = useState<any[]>([])
const [somatotypes, setSomatotypes] = useState<any[]>([]);
const [topStreaks, setTopStreaks] = useState<any[]>([]);
const inputDark = {
mb:2,
"& .MuiInputLabel-root":{
color:"white"
},
"& .MuiInputBase-input":{
color:"white"
},
"& .MuiOutlinedInput-root":{
borderRadius:"8px",
"& fieldset":{
borderColor:"white"
},
"&:hover fieldset":{
borderColor:"white"
},
"&.Mui-focused fieldset":{
borderColor:"white"
}
}
}
const months = [
"Ene","Feb","Mar","Abr","May","Jun",
"Jul","Ago","Sep","Oct","Nov","Dic"
];

const genderChart = {
  labels: genre.map(g => g.gender),
  datasets: [
    {
      data: genre.map(g => g.total),
      backgroundColor: [
        "#60a5fa",
        "#f87171"
      ]
    }
  ]
};

const somatotypeChart = {
  labels: somatotypes.map(s => s.type),
  datasets: [
    {
      data: somatotypes.map(s => s.total),
      backgroundColor: [
        "#60a5fa",
        "#34d399",
        "#f87171"
      ]
    }
  ]
};
 useEffect(() => {

  const token = localStorage.getItem("token")

  fetch("http://localhost:8000/api/users/stats", {
    headers:{
      Authorization:`Bearer ${token}`,
      Accept:"application/json"
    }
  })
  .then(res => res.json())
  .then(data => {
    console.log("USER STATS:", data)
    setStats(data)

setGenre(data.genre || [])
  setSomatotypes(data.somatotypes || [])
  setTopStreaks(data.top_streaks || [])
    setLoading(false)
    Swal.close()
  })
  .catch(err => {
    console.error(err)
    setLoading(false)
    Swal.close()
  })

}, [])

useEffect(() => {

  if(loading){
    Swal.fire({
      title: "Cargando usuarios...",
      text: "Obteniendo estadísticas",
      background:"#0f172a",
      color:"#fff",
      allowOutsideClick:false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
  }

}, [loading])
 if (loading) return null

      return (
 <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1a2035",
        padding: 1
      }}
    >
      <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={3}
      color="white"
    >
      {/* Breadcrumb + Title */}

      <Box>
        <Typography variant="body2" sx={{ color: "#8f9bb3" }}>
          &nbsp;&nbsp;Panel de control
        </Typography>

        <Typography variant="h5" fontWeight="bold">
          &nbsp;Usuarios
        </Typography>
      </Box>

      {/* Right side */}

      <Box display="flex" alignItems="center" gap={2}>
        
      

        <IconButton sx={{ color: "white" }}>
          <AccountCircleIcon />
        </IconButton>

        <IconButton sx={{ color: "white" }}>
          <SettingsIcon />
        </IconButton>

        <IconButton sx={{ color: "white" }}>
          <NotificationsIcon />
        </IconButton>

      </Box>
    </Box>

 <Box sx={{ p: 3 }}>

<Box
  sx={{
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 3
  }}
>

<Card sx={{background:"#202940",color:"white",borderRadius:"16px"}}>
<CardContent>
<Typography variant="body2" sx={{color:"#8f9bb3"}}>
Usuarios registrados
</Typography>

<Typography variant="h5" fontWeight="bold">
{stats.total_users}
</Typography>
</CardContent>
</Card>


<Card sx={{background:"#202940",color:"white",borderRadius:"16px"}}>
<CardContent>
<Typography variant="body2" sx={{color:"#8f9bb3"}}>
Usuarios nuevos este mes
</Typography>

<Typography variant="h5" fontWeight="bold">
{stats.new_users_this_month}
</Typography>
</CardContent>
</Card>


<Card sx={{background:"#202940",color:"white",borderRadius:"16px"}}>
<CardContent>
<Typography variant="body2" sx={{color:"#8f9bb3"}}>
Entrenaron hoy
</Typography>

<Typography variant="h5" fontWeight="bold">
{stats.trained_today}
</Typography>
</CardContent>
</Card>


<Card sx={{background:"#202940",color:"white",borderRadius:"16px"}}>
<CardContent>
<Typography variant="body2" sx={{color:"#8f9bb3"}}>
Peso promedio
</Typography>


<Typography variant="h5" fontWeight="bold">
{stats.average_weight} kg
</Typography>
</CardContent>
</Card>




<Card sx={{background:"#202940",color:"white",borderRadius:"16px"}}>
    <CardContent>

<Typography variant="h6">
Distribución por género
</Typography>

<Pie data={genderChart} />

</CardContent>
</Card>


<Card sx={{background:"#202940",color:"white",borderRadius:"16px"}}>
    <CardContent>

<Typography variant="h6">
Distribución de somatotipos
</Typography>

<Pie data={somatotypeChart} />

</CardContent>
</Card>


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

{topStreaks.map((user, index) => (
<TableRow key={index}>
<TableCell sx={{ color: "#8f9bb3"}}>{index + 1}</TableCell>
<TableCell sx={{ color: "#8f9bb3"}}>{user.name}</TableCell>
<TableCell sx={{ color: "#8f9bb3"}}>{user.streak} días</TableCell>
</TableRow>
))}

</TableBody>
</Table>
</CardContent>
</Card>

</Box>


<Box sx={{mt:4}}>

{/* BARRA BUSQUEDA */}
        <TextField
          size="medium"
          placeholder="Buscar..."
          variant="outlined"
          sx={{mb:3,
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              color: "white",
              "& fieldset": {
                borderColor: "#2d3561"
              }
            }
          }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 3 }} />
          }}
        />

<Box
sx={{
display:"grid",
gridTemplateColumns:"2fr 1fr",
gap:3
}}
>

{/* TABLA USUARIOS */}
<Card sx={{background:"#202940",color:"white",borderRadius:"16px"}}>

<CardContent>

<Typography variant="h6" mb={2}>
Usuarios
</Typography>

<Table>

<TableHead>

<TableRow>

<TableCell sx={{color:"white"}}>Nombre</TableCell>
<TableCell sx={{color:"white"}}>Email</TableCell>
<TableCell sx={{color:"white"}}>Genero</TableCell>
<TableCell sx={{color:"white"}}>Nacimiento</TableCell>
<TableCell sx={{color:"white"}}>Rol</TableCell>
<TableCell sx={{color:"white"}}>Acciones</TableCell>

</TableRow>

</TableHead>

<TableBody>


<TableRow >

<TableCell sx={{color:"white"}}></TableCell>
<TableCell sx={{color:"white"}}></TableCell>
<TableCell sx={{color:"white"}}></TableCell>
<TableCell sx={{color:"white"}}></TableCell>
<TableCell sx={{color:"white"}}></TableCell>
<TableCell sx={{color:"white"}}></TableCell>

</TableRow>


</TableBody>

</Table>

</CardContent>

</Card>


{/* FORMULARIO */}

<Card sx={{background:"#202940",color:"white",borderRadius:"16px"}}>

<CardContent>

<Typography variant="h6" mb={2}>
Crear Usuario
</Typography>

<TextField
label="Nombre"
fullWidth
size="small"
sx={inputDark}
/>

<TextField
label="Email"
fullWidth
size="small"
sx={inputDark}
/>

<FormControl fullWidth size="small" sx={inputDark}>

<InputLabel sx={{color:"white"}}>Genero</InputLabel>

<Select
label="Genero"
sx={{color:"white"}}
>

<MenuItem value="male">Masculino</MenuItem>
<MenuItem value="female">Femenino</MenuItem>

</Select>

</FormControl>

<FormControl fullWidth sx={{mb:2}}>

<Typography sx={{color:"white", mb:1}}>
Imagen
</Typography>

<input
type="file"
accept="image/*"
style={{
color:"white",
border:"1px solid white",
borderRadius:"8px",
padding:"8px",
width:"100%",
background:"transparent"
}}
/>

</FormControl>

<TextField
label="Fecha de nacimiento"
type="date"
fullWidth
size="small"
InputLabelProps={{shrink:true}}
sx={inputDark}
/>

<FormControl fullWidth size="small" sx={inputDark}>

<InputLabel sx={{color:"white"}}>Rol</InputLabel>

<Select
label="Rol"
sx={{color:"white"}}
>

<MenuItem value="user">Usuario</MenuItem>
<MenuItem value="nutritionist">Nutriologo</MenuItem>
<MenuItem value="admin">Administrador</MenuItem>

</Select>

</FormControl>

<Button
variant="contained"
fullWidth
sx={{
background:"#3b82f6",
borderRadius:"10px",
height:"40px"
}}
>
Crear Usuario
</Button>

</CardContent>

</Card>

</Box>
</Box>



</Box>
    </Box>
  );

}