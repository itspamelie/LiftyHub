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
      background:"linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
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
        backgroundColor: "#111214",
        padding: 1
      }}
    >
      <TopNavbar />

      <Box sx={{ pl: 3 }}>

        <StatsCards dashboard={dashboard} />

        <ChartsRow dashboard={dashboard} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 3,
            pl:3
          }}
        >
          <ProjectsTable  dashboard={dashboard} />
          <OrdersOverview dashboard={dashboard} />
        </Box>

      </Box>
    </Box>
  );
}