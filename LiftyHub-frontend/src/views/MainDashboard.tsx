import { Box } from "@mui/material";
import TopNavbar from "../components/dashboard/TopNavbar";
import StatsCards from "../components/dashboard/StatsCards";
import ChartsRow from "../components/dashboard/ChartsRow";
import ProjectsTable from "../components/dashboard/ProjectsTable";
import OrdersOverview from "../components/dashboard/OrdersOverview";
import Swal from "sweetalert2";
import { apiFetch } from "../services/api"
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

  const loadDashboard = async () => {
    try{
      const data = await apiFetch("/dashboard")
      setDashboard(data)
    }catch(err){
      console.error(err)
    }finally{
      setLoading(false)
      Swal.close()
    }
  }

  loadDashboard()

}, [])
useEffect(() => {

  if(loading){
    Swal.fire({
      title: "Cargando dashboard...",
      text: "Obteniendo información",
      background:"#0f1117",
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
        background: "linear-gradient(180deg, #0b0e15 0%, #0f1117 100%)",
        minHeight: "100vh"
      }}
    >
      <TopNavbar />

      <Box sx={{ flex: 1 }}>
        <StatsCards dashboard={dashboard} />
        <ChartsRow dashboard={dashboard} />
        <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 2.5, px: 3, pb: 3 }}>
          <ProjectsTable dashboard={dashboard} />
          <OrdersOverview dashboard={dashboard} />
        </Box>
      </Box>
    </Box>
  );
}