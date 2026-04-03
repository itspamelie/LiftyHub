import { Box, Typography, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import React from "react";
import { useLocation } from "react-router-dom";

const TopNavbar: React.FC = () => {
  const location = useLocation();

const routeNames: Record<string, string> = {
  "/dashboard/users": "Usuarios",
  "/dashboard/plans": "Planes",
  "/dashboard/routines": "Rutinas",
  "/dashboard/exercises": "Ejercicios",
  "/dashboard/somatotypes": "Somatotipos",
  "/dashboard": "Dashboard",
  "/dashboard/nutritionist": "Nutriólogoss",
  "/dashboard/exercise/:id": "Detalles del ejercicio",
};

const getCurrentTitle = () => {
  const path = location.pathname;

  const match = Object.keys(routeNames).find((route) =>
    path.startsWith(route)
  );

  return match ? routeNames[match] : "Dashboard";
};

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={5}
      color="white"
    >
      {/* Breadcrumb + Title */}
      <Box>
        <Typography variant="body2" sx={{ color: "#8f9bb3" }}>
          &nbsp;&nbsp;Panel de control
        </Typography>

        <Typography variant="h5" fontWeight="bold">
          &nbsp;{getCurrentTitle()}
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
  );
};

export default TopNavbar;