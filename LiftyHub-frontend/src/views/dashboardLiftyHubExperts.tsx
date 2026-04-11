import { Box, Grid, Typography } from "@mui/material";
import Sidebar from "../components/dashboard-nutritionists/sidebar";
import Topbar from "../components/dashboard-nutritionists/topbar";
import MetricCard from "../components/dashboard-nutritionists/metricCard";
import AlertsPanel from "../components/dashboard-nutritionists/AlertsPanel";

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ display: "flex", bgcolor: "#0e0e0e", minHeight: "100vh", color: "white" }}>
      
      <Sidebar />

      <Box sx={{ flex: 1 }}>
        <Topbar />

        <Box p={4} >
          <Typography fontSize={40} fontWeight="bold">
            Hola, Nutriólogo 👋
          </Typography>

          <Typography color="#ababab" mb={4}>
            You have alerts and appointments today
          </Typography>

          {/* Metrics */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <MetricCard title="Dietas Entregadas" value="124" extra="+12%" />
            </Grid>

            <Grid item xs={12} md={4}>
              <MetricCard title="Ganancias Este Mes" value="$8,420" extra="USD" />
            </Grid>

            <Grid item xs={12} md={4}>
              <MetricCard title="Pacientes Activos" value="48" extra="Live" />
            </Grid>
          </Grid>

          {/* Layout */}
          <Grid container spacing={3} mt={2}>
            <Grid item xs={12} md={7}>
              <Box sx={{ height: 300, bgcolor: "#191919", borderRadius: 2 }} />
            </Grid>

            <Grid item xs={12} md={5}>
              <AlertsPanel />
            </Grid>
          </Grid>

        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;