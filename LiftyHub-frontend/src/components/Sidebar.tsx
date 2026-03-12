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
import TableChartIcon from "@mui/icons-material/TableChart";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

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

          <ListItemButton
            sx={{
              background:
                "linear-gradient(90deg,#3a8dff,#5da8ff)",
              borderRadius: "12px",
              mb: 1
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              <DashboardIcon />
            </ListItemIcon>

            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon sx={{ color: "white" }}>
              <TableChartIcon />
            </ListItemIcon>
            <ListItemText primary="Usuarios" />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon sx={{ color: "white" }}>
              <ReceiptLongIcon />
            </ListItemIcon>
            <ListItemText primary="Billing" />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon sx={{ color: "white" }}>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon sx={{ color: "white" }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon sx={{ color: "white" }}>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary="Sign In" />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon sx={{ color: "white" }}>
              <AppRegistrationIcon />
            </ListItemIcon>
            <ListItemText primary="Sign Up" />
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
          ghola
        </Button>
      </Box>
    </Drawer>
  );
}