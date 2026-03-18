import { Box } from "@mui/material";
import TopNavbar from "../components/dashboard/TopNavbar";
import StatsCards from "../components/dashboard/StatsCards";
import ChartsRow from "../components/dashboard/ChartsRow";
import ProjectsTable from "../components/dashboard/ProjectsTable";
import OrdersOverview from "../components/dashboard/OrdersOverview";
import Swal from "sweetalert2";

import { useState, useEffect } from "react";

interface Stats {
  usuarios: number;
  nutriologos: number;
  suscripciones: number;
  ingresos: string;
}

interface UsuarioPorDia {
  fecha: string;
  total: number;
}

interface SuscripcionPorPlan {
  name: string;
  total: number;
}

interface DashboardData {
  stats: Stats;
  usuariosPorDia: UsuarioPorDia[];
  suscripcionesPorPlan: SuscripcionPorPlan[];
  usuariosSuscripcion: {
    con: number;
    sin: number;
  };
}

export default function MainDashboard() {

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
const [loading, setLoading] = useState(true)
useEffect(() => {

  const token = localStorage.getItem("token")

  fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
    headers:{
      Authorization:`Bearer ${token}`,
      Accept:"application/json"
    }
  })
  .then(res => res.json())
  .then(data => {
    setDashboard(data)
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
      title: "Cargando dashboard...",
      text: "Obteniendo información",
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
      <TopNavbar />

      <Box sx={{ p: 3 }}>

        <StatsCards dashboard={dashboard} />

        <ChartsRow dashboard={dashboard} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 3,
            mt: 3
          }}
        >
          <ProjectsTable  dashboard={dashboard} />
          <OrdersOverview dashboard={dashboard} />
        </Box>

      </Box>
    </Box>
  );
}