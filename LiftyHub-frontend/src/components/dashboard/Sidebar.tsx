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
import { useLocation } from "react-router-dom";

export default function Sidebar() {
  const drawerWidth = 270;
const location = useLocation();
const isActive = (path: string) => location.pathname === path;
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
            "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",

          color: "white",
          padding: "20px",

          boxShadow: "0px 20px 30px rgba(0,0,0,0.4)"
        }
      }}
    >
      <Box>
        {/* Logo */}
        <Box mb={3} sx={{ textAlign: "center" }}>
  <Typography variant="h4" fontWeight="bold">
    LiftyHub
  </Typography>
</Box>

       <List>

  {/* Dashboard */}
  <ListItemButton
  component={Link}
  to="/dashboard"
  sx={{
    background: isActive("/dashboard")
      ? "linear-gradient(90deg,#3a8dff,#5da8ff)"
      : "transparent",
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
<ListItemButton
  component={Link}
  to="/dashboard/users"
  sx={{
    background: isActive("/dashboard/users")
      ? "linear-gradient(90deg,#3a8dff,#5da8ff)"
      : "transparent",
    borderRadius: "12px",
    mb: 1
  }}
>    <ListItemIcon sx={{ color: "white" }}>
  <GroupIcon />
</ListItemIcon>
    <ListItemText primary="Usuarios" />
  </ListItemButton>

  {/* Planes */}
<ListItemButton
  component={Link}
  to="/dashboard/plans"
  sx={{
    background: isActive("/dashboard/plans")
      ? "linear-gradient(90deg,#3a8dff,#5da8ff)"
      : "transparent",
    borderRadius: "12px",
    mb: 1
  }}
>    <ListItemIcon sx={{ color: "white" }}>
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
<ListItemButton
  component={Link}
  to="/dashboard/routines"
  sx={{
    background: isActive("/dashboard/routines")
      ? "linear-gradient(90deg,#3a8dff,#5da8ff)"
      : "transparent",
    borderRadius: "12px",
    mb: 1
  }}
>    <ListItemIcon sx={{ color: "white" }}>
  <FitnessCenterIcon />
</ListItemIcon>
    <ListItemText primary="Rutinas" />
  </ListItemButton>

  {/* Ejercicios */}
<ListItemButton
  component={Link}
  to="/dashboard/exercises"
  sx={{
    background: isActive("/dashboard/exercises")
      ? "linear-gradient(90deg,#3a8dff,#5da8ff)"
      : "transparent",
    borderRadius: "12px",
    mb: 1
  }}
>    <ListItemIcon sx={{ color: "white" }}>
  <SportsGymnasticsIcon />
</ListItemIcon>
    <ListItemText primary="Ejercicios" />
  </ListItemButton>

  {/* Somatotipos */}
<ListItemButton
  component={Link}
  to="/dashboard/somatotypes"
  sx={{
    background: isActive("/dashboard/somatotypes")
      ? "linear-gradient(90deg,#3a8dff,#5da8ff)"
      : "transparent",
    borderRadius: "12px",
    mb: 1
  }}
>    <ListItemIcon sx={{ color: "white" }}>
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