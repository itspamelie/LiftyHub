import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Button
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SportsGymnasticsIcon from "@mui/icons-material/SportsGymnastics";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const drawerWidth = 270;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRadius: "20px",
          margin: "20px",
          height: "calc(100vh - 40px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",

          background:
            "linear-gradient(180deg, #3a3a45 0%, #1e1e24 100%)",

          color: "white",
          padding: "20px",

          boxShadow: "0px 20px 30px rgba(0,0,0,0.4)"
        }
      }}
    >
      <Box>
        {/* Logo */}
        <Box mb={3}>
          <Typography variant="h6" fontWeight="bold">
            LiftyHub
          </Typography>
        </Box>

       <List>

  {/* Dashboard */}
  <ListItemButton
    component={Link}
    to="/dashboard"
    sx={{
      background: "linear-gradient(90deg,#3a8dff,#5da8ff)",
      borderRadius: "12px",
      mb: 1
    }}
  >
    <ListItemIcon sx={{ color: "white" }}>
      <DashboardIcon />
    </ListItemIcon>

    <ListItemText primary="Dashboard" />
  </ListItemButton>

  {/* Usuarios */}
  <ListItemButton component={Link} to="/dashboard/users">
    <ListItemIcon sx={{ color: "white" }}>
  <GroupIcon />
</ListItemIcon>
    <ListItemText primary="Usuarios" />
  </ListItemButton>

  {/* Planes */}
  <ListItemButton component={Link} to="/dashboard/plans">
    <ListItemIcon sx={{ color: "white" }}>
  <AssignmentIcon />
</ListItemIcon>
    <ListItemText primary="Planes" />
  </ListItemButton>

  {/* Nutriólogos */}
  <ListItemButton component={Link} to="/dashboard/nutritionists">
    <ListItemIcon sx={{ color: "white" }}>
  <RestaurantIcon />
</ListItemIcon>
    <ListItemText primary="Nutriólogos" />
  </ListItemButton>

  {/* Rutinas */}
  <ListItemButton component={Link} to="/dashboard/routines">
    <ListItemIcon sx={{ color: "white" }}>
  <FitnessCenterIcon />
</ListItemIcon>
    <ListItemText primary="Rutinas" />
  </ListItemButton>

  {/* Ejercicios */}
  <ListItemButton component={Link} to="/dashboard/exercises">
    <ListItemIcon sx={{ color: "white" }}>
  <SportsGymnasticsIcon />
</ListItemIcon>
    <ListItemText primary="Ejercicios" />
  </ListItemButton>

  {/* Somatotipos */}
  <ListItemButton component={Link} to="/dashboard/somatotypes">
    <ListItemIcon sx={{ color: "white" }}>
  <AnalyticsIcon />
</ListItemIcon>
    <ListItemText primary="Somatotipos" />
  </ListItemButton>

</List>
      </Box>

      {/* Botón inferior */}
      <Box>
        <Button
          variant="contained"
          fullWidth
          sx={{
            borderRadius: "14px",
            background:
              "linear-gradient(90deg,#3a8dff,#5da8ff)",
            fontWeight: "bold"
          }}
        >
          <Link className="nav-link text-light" to="/">
              Ir al Home
            </Link>
        </Button>
      </Box>
    </Drawer>
  );
}