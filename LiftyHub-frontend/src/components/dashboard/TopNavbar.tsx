import { Box, Typography, IconButton, Badge, Avatar, Popover, Menu, MenuItem, Divider, ListItemIcon, Chip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../../services/api";

const ROUTE_NAMES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/users": "Usuarios",
  "/dashboard/plans": "Planes",
  "/dashboard/routines": "Rutinas",
  "/dashboard/exercises": "Ejercicios",
  "/dashboard/nutritionists": "Nutriólogos",
  "/dashboard/somatotypes": "Somatotipos",
  "/dashboard/applications": "Solicitudes",
};

const TopNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [bellAnchor, setBellAnchor] = useState<null | HTMLElement>(null);
  const [adminAnchor, setAdminAnchor] = useState<null | HTMLElement>(null);
  const [pendingApps, setPendingApps] = useState<any[]>([]);

  const fetchPending = () => {
    apiFetch("/nutritionistProfiles")
      .then((data) => {
        const pending = (data.data || []).filter((n: any) => !n.is_active);
        setPendingApps(pending);
      })
      .catch(() => {});
  };

  useEffect(() => { fetchPending(); }, []);

  const getCurrentTitle = () => {
    const path = location.pathname;
    const match = Object.keys(ROUTE_NAMES).find((route) => path.startsWith(route));
    return match ? ROUTE_NAMES[match] : "Dashboard";
  };

  const today = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const title = getCurrentTitle();

  const handleLogout = () => {
    setAdminAnchor(null);
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={4}
      py={2.5}
      sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)", mb: 1 }}
    >
      {/* Left — breadcrumb + title */}
      <Box>
        <Box display="flex" alignItems="center" gap={0.8} mb={0.5}>
          <Typography sx={{ fontSize: 11, color: "#475569", letterSpacing: "0.5px" }}>
            Panel de control
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#334155" }}>/</Typography>
          <Typography sx={{ fontSize: 11, color: "#60a5fa", fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h5" fontWeight={800} color="white" lineHeight={1}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: 11.5, color: "#475569", mt: 0.4, textTransform: "capitalize" }}>
          {today}
        </Typography>
      </Box>

      {/* Right — actions */}
      <Box display="flex" alignItems="center" gap={1.5}>
        {/* Bell */}
        <IconButton
          onClick={(e) => { setBellAnchor(e.currentTarget); fetchPending(); }}
          sx={{
            color: "#64748b",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "12px",
            width: 40,
            height: 40,
            "&:hover": { background: "rgba(255,255,255,0.08)", color: "white" },
          }}
        >
          <Badge
            badgeContent={pendingApps.length}
            color="error"
            sx={{ "& .MuiBadge-badge": { fontSize: 9, minWidth: 14, height: 14 } }}
          >
            <NotificationsIcon sx={{ fontSize: 20 }} />
          </Badge>
        </IconButton>

        {/* Bell Popover */}
        <Popover
          open={Boolean(bellAnchor)}
          anchorEl={bellAnchor}
          onClose={() => setBellAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              mt: 1,
              background: "linear-gradient(135deg, #13141c 0%, #0f1117 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
              width: 320,
              overflow: "hidden",
            },
          }}
        >
          <Box px={2.5} pt={2} pb={1.5}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
              <Typography fontWeight={700} color="white" fontSize={14}>
                Notificaciones
              </Typography>
              {pendingApps.length > 0 && (
                <Chip
                  label={`${pendingApps.length} pendientes`}
                  size="small"
                  sx={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b", fontSize: 10, fontWeight: 700, border: "1px solid rgba(245,158,11,0.3)" }}
                />
              )}
            </Box>

            {pendingApps.length === 0 ? (
              <Box py={3} textAlign="center">
                <NotificationsIcon sx={{ fontSize: 36, color: "#334155", mb: 1 }} />
                <Typography fontSize={13} color="#475569">
                  Sin notificaciones pendientes
                </Typography>
              </Box>
            ) : (
              <Box display="flex" flexDirection="column" gap={1} mb={1}>
                {pendingApps.slice(0, 4).map((n) => (
                  <Box
                    key={n.id}
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    px={1.5}
                    py={1}
                    sx={{
                      borderRadius: "10px",
                      background: "rgba(245,158,11,0.06)",
                      border: "1px solid rgba(245,158,11,0.12)",
                      cursor: "pointer",
                      "&:hover": { background: "rgba(245,158,11,0.12)" },
                    }}
                    onClick={() => { setBellAnchor(null); navigate("/dashboard/applications"); }}
                  >
                    <Avatar sx={{ width: 32, height: 32, fontSize: 13, fontWeight: 700, background: "linear-gradient(135deg,#f59e0b,#fbbf24)", color: "#0f1117" }}>
                      {n.user?.name?.[0]?.toUpperCase() ?? "N"}
                    </Avatar>
                    <Box flex={1} minWidth={0}>
                      <Typography fontSize={12} fontWeight={600} color="white" noWrap>
                        {n.user?.name}
                      </Typography>
                      <Typography fontSize={11} color="#64748b" noWrap>
                        Solicitud de nutriólogo pendiente
                      </Typography>
                    </Box>
                    <HowToRegIcon sx={{ fontSize: 14, color: "#f59e0b", flexShrink: 0 }} />
                  </Box>
                ))}
              </Box>
            )}

            {pendingApps.length > 0 && (
              <Box
                textAlign="center"
                py={1}
                sx={{
                  cursor: "pointer",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  "&:hover": { "& .see-all": { color: "#60a5fa" } },
                }}
                onClick={() => { setBellAnchor(null); navigate("/dashboard/applications"); }}
              >
                <Typography className="see-all" fontSize={12} color="#3b82f6" fontWeight={600} sx={{ transition: "color 0.2s" }}>
                  Ver todas las solicitudes
                </Typography>
              </Box>
            )}
          </Box>
        </Popover>

        {/* Admin chip */}
        <Box
          onClick={(e) => setAdminAnchor(e.currentTarget)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 0.75,
            borderRadius: "12px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            cursor: "pointer",
            "&:hover": { background: "rgba(255,255,255,0.08)" },
          }}
        >
          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: 12,
              fontWeight: 700,
              background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
            }}
          >
            A
          </Avatar>
          <Box>
            <Typography fontSize={12} fontWeight={700} color="white" lineHeight={1.2}>
              Admin
            </Typography>
            <Typography fontSize={10} sx={{ color: "#475569" }}>
              Administrador
            </Typography>
          </Box>
        </Box>

        {/* Admin Menu */}
        <Menu
          anchorEl={adminAnchor}
          open={Boolean(adminAnchor)}
          onClose={() => setAdminAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              mt: 1,
              background: "linear-gradient(135deg, #13141c 0%, #0f1117 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
              minWidth: 180,
              "& .MuiMenuItem-root": {
                fontSize: 13,
                color: "#cbd5e1",
                borderRadius: "8px",
                mx: 0.5,
                "&:hover": { background: "rgba(255,255,255,0.06)", color: "white" },
              },
            },
          }}
        >
          <Box px={2} pt={1.5} pb={1}>
            <Typography fontSize={13} fontWeight={700} color="white">
              Admin
            </Typography>
            <Typography fontSize={11} color="#475569">
              Administrador del sistema
            </Typography>
          </Box>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", my: 0.5 }} />
          <MenuItem onClick={handleLogout} sx={{ color: "#f87171 !important", "&:hover": { background: "rgba(239,68,68,0.08) !important", color: "#f87171 !important" } }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <LogoutIcon sx={{ fontSize: 16, color: "#f87171" }} />
            </ListItemIcon>
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default TopNavbar;
