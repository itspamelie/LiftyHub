import { Box, Typography, TextField, IconButton } from "@mui/material";
import UserStats from "../components/users/UserStats"
import UserCharts from "../components/users/UserCharts"
import TopStreaks from "../components/users/TopStreaks"
import UserTable from "../components/users/UserTable"
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UserForm from "../components/users/UserForm";
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, PointElement, LineElement, Tooltip, Legend} from "chart.js";
ChartJS.register(CategoryScale,LinearScale,ArcElement,PointElement,LineElement,Tooltip,Legend);
import { apiFetch } from "../services/api"

export default function UserDashboard() {
    const [stats, setStats] = useState<any>({})
const [loading, setLoading] = useState(true)
const [genre, setGenre] = useState<any[]>([])
const [somatotypes, setSomatotypes] = useState<any[]>([]);
const [topStreaks, setTopStreaks] = useState<any[]>([]);
const [users, setUsers] = useState<any[]>([])
const [search, setSearch] = useState("")
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

  apiFetch("/users")
  .then(data => {
    setUsers(data.data || [])
  })

}, [])

 useEffect(() => {

  apiFetch("/users/stats")
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

const searchUsers = async (value:string) => {

  setSearch(value)

  try{

    if(value.trim() === ""){
      const data = await apiFetch("/users")
      setUsers(data.data || [])
      return
    }

const data = await apiFetch(`/search-users?search=${value}`)
    setUsers(data.data || [])

  }catch(error){
    console.error("Error buscando usuarios",error)
  }

}


const refreshUsers = async () => {

const [usersData, statsData] = await Promise.all([
apiFetch("/users"),
apiFetch("/users/stats")
])

setUsers(usersData.data || [])

setStats(statsData)
setGenre(statsData.genre || [])
setSomatotypes(statsData.somatotypes || [])
setTopStreaks(statsData.top_streaks || [])

}
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

<Box sx={{p:6}}>

{/* GRID 1: estadísticas */}

<Box
sx={{
display:"grid",
gridTemplateColumns:"repeat(4,1fr)",
gap:3
}}
>

<UserStats stats={stats} />

<UserCharts
 genderChart={genderChart}
 somatotypeChart={somatotypeChart}
/>

<TopStreaks topStreaks={topStreaks} />

</Box>


{/* BARRA BUSQUEDA */}
    <TextField
size="medium"
placeholder="Buscar usuario..."
variant="outlined"
value={search}
onChange={(e)=>searchUsers(e.target.value)}
sx={{
mb:3,
mt:4,
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

{/* GRID 2: tabla + formulario */}

<Box
sx={{
display:"grid",
gridTemplateColumns:"2fr 1fr",
gap:3
}}
>

<UserTable users={users} onUserDeleted={refreshUsers}/>
<UserForm onUserCreated={refreshUsers}/>
</Box>



</Box>
</Box>

)
 
}