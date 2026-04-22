import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Button
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from '@mui/icons-material/Home';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import FlatwareIcon from '@mui/icons-material/Flatware';
const Sidebar: React.FC = () => {
  const location = useLocation();
const isActive = (path: string) => location.pathname === path;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        "& .MuiDrawer-paper": {
          width: 260,
          bgcolor: "#0e0e0e",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          p: 3,
          display: "flex",
          flexDirection: "column"
        }
      }}
    >
      <Box mb={6}>
        <Typography fontWeight="bold" fontSize={30} color="#3a8dff">
          LiftyHub
        </Typography>
        <Typography fontSize={15} color="#ababab">
          Experts Dashboard
        </Typography>
      </Box>

      <List sx={{ flex: 1 }}>
        <ListItemButton
        component={Link} to="/DashboardForExperts/"
           sx={{
    background: isActive("/DashboardForExperts/")
      ? "#3a8dff"
      : "transparent",
    color: isActive("/DashboardForExperts/")
      ? "#3a8dff"
      : "#ababab",
    borderRight: isActive("/DashboardForExperts/")
      ? "2px solid #3a8dff"
      : "none",
    bgcolor: isActive("/DashboardForExperts/")
      ? "hsla(211, 66%, 43%, 0.10)"
      : "transparent",
  }}
        >
          <HomeIcon sx={{ mr: 1 }} />
          <ListItemText primary="Inicio"  />
        </ListItemButton>

        <ListItemButton
        component={Link} to="/DashboardForExperts/profile"
                   sx={{
    background: isActive("/DashboardForExperts/profile")
      ? "#3a8dff"
      : "transparent",
    color: isActive("/DashboardForExperts/profile")
      ? "#3a8dff"
      : "#ababab",
    borderRight: isActive("/DashboardForExperts/profile")
      ? "2px solid #3a8dff"
      : "none",
    bgcolor: isActive("/DashboardForExperts/profile")
      ? "hsla(211, 66%, 43%, 0.10)"
      : "transparent",
  }}>
          <GroupIcon sx={{ mr: 1 }} />
          <ListItemText primary="Perfil" />
        </ListItemButton>

        <ListItemButton 
        component={Link} to="/DashboardForExperts/diets"
                           sx={{
    background: isActive("/DashboardForExperts/diets")
      ? "#3a8dff"
      : "transparent",
    color: isActive("/DashboardForExperts/diets")
      ? "#3a8dff"
      : "#ababab",
    borderRight: isActive("/DashboardForExperts/diets")
      ? "2px solid #3a8dff"
      : "none",
    bgcolor: isActive("/DashboardForExperts/diets")
      ? "hsla(211, 66%, 43%, 0.10)"
      : "transparent",
  }}>
          <FlatwareIcon sx={{ mr: 1 }} />
          <ListItemText primary="Dietas" />
        </ListItemButton>

        <ListItemButton         component={Link} to="/DashboardForExperts/config"
                           sx={{
    background: isActive("/DashboardForExperts/config")
      ? "#3a8dff"
      : "transparent",
    color: isActive("/DashboardForExperts/config")
      ? "#3a8dff"
      : "#ababab",
    borderRight: isActive("/DashboardForExperts/config")
      ? "2px solid #3a8dff"
      : "none",
    bgcolor: isActive("/DashboardForExperts/config")
      ? "hsla(211, 66%, 43%, 0.10)"
      : "transparent",
  }}>
          <SettingsIcon sx={{ mr: 1 }} />
          <ListItemText primary="Ajustes" />
        </ListItemButton>
      </List>

      <Box mt="auto">
        <Button
          fullWidth
          startIcon={<AddIcon />}
          sx={{
            bgcolor: "#88adff",
            color: "#000",
            fontSize: 12,
            mb: 4,
            boxShadow: "0 0 20px rgba(0,227,253,0.2)"
          }}
        >
          New Analysis
        </Button>

        
      </Box>
    </Drawer>
  );
};

export default Sidebar;