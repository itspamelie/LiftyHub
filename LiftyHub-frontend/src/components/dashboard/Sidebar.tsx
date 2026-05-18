import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  Divider
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SportsGymnasticsIcon from "@mui/icons-material/SportsGymnastics";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Dashboard", icon: <DashboardIcon fontSize="small" />, path: "/dashboard" },
  { label: "Usuarios", icon: <GroupIcon fontSize="small" />, path: "/dashboard/users" },
  { label: "Planes", icon: <AssignmentIcon fontSize="small" />, path: "/dashboard/plans" },
  { label: "Nutriólogos", icon: <RestaurantIcon fontSize="small" />, path: "/dashboard/nutritionists" },
  { label: "Solicitudes", icon: <HowToRegIcon fontSize="small" />, path: "/dashboard/applications", accent: true },
  { label: "Rutinas", icon: <FitnessCenterIcon fontSize="small" />, path: "/dashboard/routines" },
  { label: "Ejercicios", icon: <SportsGymnasticsIcon fontSize="small" />, path: "/dashboard/exercises" },
  { label: "Somatotipos", icon: <AnalyticsIcon fontSize="small" />, path: "/dashboard/somatotypes" },
];

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
          margin: "16px",
          height: "calc(100vh - 32px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(180deg, #0f1117 0%, #13141c 100%)",
          border: "1px solid rgba(255,255,255,0.06)",
          color: "white",
          padding: "20px 14px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
          overflowX: "hidden"
        }
      }}
    >
      <Box>
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 1,
            mb: 3,
            pb: 2.5,
            borderBottom: "1px solid rgba(255,255,255,0.06)"
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              overflow: "hidden",
              flexShrink: 0,
              boxShadow: "0 0 16px rgba(59,130,246,0.3)"
            }}
          >
            <img src="/logo.jpg" alt="LiftyHub" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Box>
          <Box>
            <Typography fontWeight={800} fontSize={15} color="white" lineHeight={1.2}>
              LiftyHub
            </Typography>
            <Typography fontSize={10} sx={{ color: "#60a5fa", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              Admin Panel
            </Typography>
          </Box>
        </Box>

        {/* Nav label */}
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#475569",
            px: 1.5,
            mb: 1
          }}
        >
          Navegación
        </Typography>

        <List sx={{ display: "flex", flexDirection: "column", gap: 0.5, p: 0 }}>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            const accentGradient = item.accent
              ? "linear-gradient(90deg, rgba(16,185,129,0.15), rgba(52,211,153,0.05))"
              : "linear-gradient(90deg, rgba(59,130,246,0.15), rgba(93,168,255,0.05))";
            const accentColor = item.accent ? "#10B981" : "#3b82f6";
            const accentGlow = item.accent ? "rgba(16,185,129,0.25)" : "rgba(59,130,246,0.25)";

            return (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: "12px",
                  px: 1.5,
                  py: 1,
                  background: active ? accentGradient : "transparent",
                  border: active ? `1px solid ${accentColor}30` : "1px solid transparent",
                  boxShadow: active ? `0 0 12px ${accentGlow}` : "none",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: active
                      ? accentGradient
                      : "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)"
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? accentColor : "#64748b",
                    minWidth: 36,
                    transition: "color 0.2s"
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 13.5,
                    fontWeight: active ? 700 : 500,
                    color: active ? "white" : "#94a3b8"
                  }}
                />
                {active && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: accentColor,
                      boxShadow: `0 0 6px ${accentColor}`
                    }}
                  />
                )}
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Bottom section */}
      <Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mb: 2 }} />

        <ListItemButton
          component={Link}
          to="/"
          sx={{
            borderRadius: "12px",
            px: 1.5,
            py: 1,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
            "&:hover": { background: "rgba(255,255,255,0.07)" }
          }}
        >
          <ListItemIcon sx={{ color: "#64748b", minWidth: 36 }}>
            <HomeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Ir al Home"
            primaryTypographyProps={{ fontSize: 13.5, fontWeight: 500, color: "#94a3b8" }}
          />
        </ListItemButton>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mt: 2,
            p: 1.5,
            borderRadius: "12px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)"
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              fontSize: 13,
              fontWeight: 700,
              background: "linear-gradient(135deg, #3b82f6, #60a5fa)"
            }}
          >
            A
          </Avatar>
          <Box>
            <Typography fontSize={13} fontWeight={600} color="white">
              Administrador
            </Typography>
            <Typography fontSize={11} sx={{ color: "#475569" }}>
              admin@liftyhub.com
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
