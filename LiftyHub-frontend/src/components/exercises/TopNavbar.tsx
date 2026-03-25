import { Box, Typography, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import React from "react";

const TopNavbar: React.FC = () => {
  return (
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
          &nbsp;Ejercicios
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