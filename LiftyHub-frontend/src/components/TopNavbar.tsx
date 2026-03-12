import { Box, Typography, TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
          / Dashboard
        </Typography>

        <Typography variant="h5" fontWeight="bold">
          Dashboard
        </Typography>
      </Box>

      {/* Right side */}

      <Box display="flex" alignItems="center" gap={2}>
        
        <TextField
          size="small"
          placeholder="Search here"
          variant="outlined"
          sx={{
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
            startAdornment: <SearchIcon sx={{ mr: 1 }} />
          }}
        />

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