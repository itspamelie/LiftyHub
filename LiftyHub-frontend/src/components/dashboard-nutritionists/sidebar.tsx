import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import FlatwareIcon from "@mui/icons-material/Flatware";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InboxIcon from "@mui/icons-material/Inbox";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Inicio",       icon: <HomeIcon fontSize="small" />,    path: "/DashboardForExperts/" },
  { label: "Perfil",       icon: <PersonIcon fontSize="small" />,  path: "/DashboardForExperts/profile" },
  { label: "Dietas",       icon: <FlatwareIcon fontSize="small" />, path: "/DashboardForExperts/diets" },
  { label: "Solicitudes",  icon: <InboxIcon fontSize="small" />,   path: "/DashboardForExperts/requests" },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    handleCloseMenu();
    localStorage.clear();
    navigate("/Liftyhub-Experts-Login");
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            background: "#0a0a0a",
            borderRight: "1px solid rgba(255,255,255,0.04)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          },
        }}
      >
        {/* LOGO */}
        <Box px={3} pt={4} pb={3}>
          <Typography
            fontWeight={800}
            fontSize={22}
            sx={{
              background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
            }}
          >
            LiftyHub
          </Typography>
          <Typography fontSize={11} color="#444" mt={0.3} letterSpacing="0.08em" textTransform="uppercase">
            Experts
          </Typography>
        </Box>

        {/* NAV */}
        <List sx={{ flex: 1, px: 1.5 }}>
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: "10px",
                  mb: 0.5,
                  px: 2,
                  py: 1.2,
                  color: active ? "#fff" : "#555",
                  background: active ? "rgba(59,130,246,0.12)" : "transparent",
                  "&:hover": {
                    background: active ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.03)",
                    color: active ? "#fff" : "#888",
                  },
                  transition: "all 0.15s ease",
                }}
              >
                <Box sx={{ mr: 1.5, color: active ? "#3B82F6" : "inherit", display: "flex", alignItems: "center" }}>
                  {item.icon}
                </Box>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: { fontSize: 14, fontWeight: active ? 600 : 400, color: "inherit" },
                  }}
                />
                {active && (
                  <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "#3B82F6", ml: 1 }} />
                )}
              </ListItemButton>
            );
          })}
        </List>

        {/* USER CARD — clickable */}
        <Box
          onClick={handleOpenMenu}
          sx={{
            mx: 1.5,
            mb: 3,
            p: 2,
            borderRadius: "12px",
            background: menuOpen ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${menuOpen ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.05)"}`,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
            transition: "all 0.15s ease",
            "&:hover": {
              background: "rgba(59,130,246,0.06)",
              borderColor: "rgba(59,130,246,0.15)",
            },
          }}
        >
          <Box sx={{ position: "relative", flexShrink: 0 }}>
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: "#3B82F622",
                color: "#3B82F6",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {user?.name?.[0] ?? "N"}
            </Avatar>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 8,
                height: 8,
                bgcolor: "#22c55e",
                borderRadius: "50%",
                border: "1.5px solid #0a0a0a",
              }}
            />
          </Box>
          <Box overflow="hidden" flex={1}>
            <Typography fontSize={13} fontWeight={600} color="#ddd" noWrap>
              {user?.name ?? "Nutriólogo"}
            </Typography>
            <Typography fontSize={11} color="#444" noWrap>
              {user?.email ?? ""}
            </Typography>
          </Box>
          <ChevronRightIcon sx={{ fontSize: 14, color: "#333", flexShrink: 0 }} />
        </Box>
      </Drawer>

      {/* DROPDOWN MENU */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              background: "#111",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "14px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
              minWidth: 200,
              overflow: "hidden",
              ml: 1,
            },
          },
        }}
      >
        {/* User info header */}
        <Box px={2} py={1.5}>
          <Typography fontSize={13} fontWeight={600} color="#ddd">
            {user?.name ?? "Nutriólogo"}
          </Typography>
          <Typography fontSize={11} color="#444">
            {user?.email ?? ""}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

        <MenuItem
          onClick={() => { handleCloseMenu(); navigate("/DashboardForExperts/profile"); }}
          sx={{
            py: 1.3,
            px: 2,
            gap: 1.5,
            fontSize: 13,
            color: "#ccc",
            "&:hover": { background: "rgba(255,255,255,0.04)", color: "#fff" },
          }}
        >
          <PersonIcon sx={{ fontSize: 16, color: "#555" }} />
          Ver perfil
        </MenuItem>

        <MenuItem
          onClick={() => { handleCloseMenu(); navigate("/DashboardForExperts/config"); }}
          sx={{
            py: 1.3,
            px: 2,
            gap: 1.5,
            fontSize: 13,
            color: "#ccc",
            "&:hover": { background: "rgba(255,255,255,0.04)", color: "#fff" },
          }}
        >
          <SettingsIcon sx={{ fontSize: 16, color: "#555" }} />
          Editar perfil
        </MenuItem>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.3,
            px: 2,
            gap: 1.5,
            fontSize: 13,
            color: "#f87171",
            "&:hover": { background: "rgba(248,113,113,0.06)", color: "#f87171" },
          }}
        >
          <LogoutIcon sx={{ fontSize: 16, color: "#f87171" }} />
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  );
};

export default Sidebar;
