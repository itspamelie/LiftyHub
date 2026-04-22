
import {Grid,Box,Typography} from "@mui/material";
import MetricCard from "../dashboard-nutritionists/metricCard";
import AlertsPanel from "../dashboard-nutritionists/AlertsPanel";
export default function ProfileDashboard(){

return (
                <Box p={4} >
        <Typography fontSize={40} fontWeight="bold">
            Perfil
          </Typography>

          <Typography color="#ababab" mb={4}>
            Métricas y actividad reciente
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
)
}