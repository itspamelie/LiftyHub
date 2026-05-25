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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import FlatwareIcon from "@mui/icons-material/Flatware";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InboxIcon from "@mui/icons-material/Inbox";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch, getImageUrl } from "../../services/api";
import Swal from "sweetalert2";

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

  const [profilePicUrl, setProfilePicUrl] = useState<string>("");

  const fetchProfilePic = async () => {
    try {
      const res = await apiFetch("/nutritionistProfiles");
      const profile = res.data.find((p: any) => Number(p.user_id) === Number(user.id));
      if (profile?.profile_pic) {
        setProfilePicUrl(getImageUrl(profile.profile_pic, "nutritionists") + "?t=" + Date.now());
      }
    } catch { /* silent */ }
  };

  useEffect(() => {
    fetchProfilePic();
    const handler = () => fetchProfilePic();
    window.addEventListener("nutri-pic-updated", handler);
    return () => window.removeEventListener("nutri-pic-updated", handler);
  }, []);

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

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!deletePassword) return;
    setDeleting(true);
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const verify = await fetch(API_URL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, password: deletePassword }),
      });
      if (!verify.ok) {
        Swal.fire({ icon: "error", title: "Contraseña incorrecta", background: "#141d2b", color: "#fff", confirmButtonColor: "#3B82F6" });
        setDeleting(false);
        return;
      }
      await apiFetch(`/users/${user.id}`, { method: "DELETE" });
      localStorage.clear();
      setDeleteOpen(false);
      Swal.fire({
        icon: "success", title: "Cuenta eliminada",
        text: "Tu cuenta ha sido eliminada permanentemente.",
        background: "#141d2b", color: "#fff", confirmButtonColor: "#3B82F6",
        timer: 2500, showConfirmButton: false,
      });
      setTimeout(() => navigate("/"), 2600);
    } catch {
      Swal.fire({ icon: "error", title: "Error al eliminar", background: "#141d2b", color: "#fff", confirmButtonColor: "#3B82F6" });
    } finally {
      setDeleting(false);
    }
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
            background: "#090f18",
            borderRight: "1px solid rgba(255,255,255,0.04)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          },
        }}
      >
        {/* LOGO */}
        <Box px={3} pt={4} pb={3} display="flex" alignItems="center" gap={1.5}>
          <Box sx={{ width: 38, height: 38, borderRadius: "10px", overflow: "hidden", flexShrink: 0, border: "1px solid rgba(59,130,246,0.2)" }}>
            <img src="/logo.jpg" alt="LiftyHub" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </Box>
          <Box>
            <Typography fontSize={15} fontWeight={800} color="#fff" letterSpacing="-0.3px" lineHeight={1.2}>
              LiftyHub
            </Typography>
            <Typography fontSize={10} color="#3B82F6" fontWeight={700} letterSpacing="0.1em" textTransform="uppercase">
              Experts
            </Typography>
          </Box>
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
                  color: active ? "#fff" : "#94a3b8",
                  background: active ? "rgba(59,130,246,0.18)" : "transparent",
                  "&:hover": {
                    background: active ? "rgba(59,130,246,0.22)" : "rgba(255,255,255,0.03)",
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
            background: menuOpen ? "rgba(59,130,246,0.22)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${menuOpen ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.05)"}`,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
            transition: "all 0.15s ease",
            "&:hover": {
              background: "rgba(59,130,246,0.06)",
              borderColor: "rgba(59,130,246,0.22)",
            },
          }}
        >
          <Box sx={{ position: "relative", flexShrink: 0 }}>
            <Avatar
              src={profilePicUrl || undefined}
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
                border: "1.5px solid #080d12",
              }}
            />
          </Box>
          <Box overflow="hidden" flex={1}>
            <Typography fontSize={13} fontWeight={600} color="#ddd" noWrap>
              {user?.name ?? "Nutriólogo"}
            </Typography>
            <Typography fontSize={11} color="#64748b" noWrap>
              {user?.email ?? ""}
            </Typography>
          </Box>
          <ChevronRightIcon sx={{ fontSize: 14, color: "#64748b", flexShrink: 0 }} />
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
              background: "#141d2b",
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
          <Typography fontSize={11} color="#64748b">
            {user?.email ?? ""}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "rgba(59,130,246,0.25)" }} />

        <MenuItem
          onClick={() => { handleCloseMenu(); navigate("/DashboardForExperts/profile"); }}
          sx={{
            py: 1.3,
            px: 2,
            gap: 1.5,
            fontSize: 13,
            color: "#cbd5e1",
            "&:hover": { background: "rgba(255,255,255,0.04)", color: "#fff" },
          }}
        >
          <PersonIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
          Ver perfil
        </MenuItem>

        <MenuItem
          onClick={() => { handleCloseMenu(); navigate("/DashboardForExperts/config"); }}
          sx={{
            py: 1.3,
            px: 2,
            gap: 1.5,
            fontSize: 13,
            color: "#cbd5e1",
            "&:hover": { background: "rgba(255,255,255,0.04)", color: "#fff" },
          }}
        >
          <SettingsIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
          Editar perfil
        </MenuItem>

        <Divider sx={{ borderColor: "rgba(59,130,246,0.25)" }} />

        <MenuItem
          onClick={() => { handleCloseMenu(); setDeletePassword(""); setDeleteOpen(true); }}
          sx={{
            py: 1.3,
            px: 2,
            gap: 1.5,
            fontSize: 13,
            color: "#f87171",
            "&:hover": { background: "rgba(248,113,113,0.06)", color: "#f87171" },
          }}
        >
          <DeleteForeverIcon sx={{ fontSize: 16, color: "#f87171" }} />
          Eliminar cuenta
        </MenuItem>

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

      {/* DIALOG: ELIMINAR CUENTA */}
      <Dialog
        open={deleteOpen}
        onClose={() => !deleting && setDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            background: "#141d2b",
            borderRadius: "20px",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "white",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DeleteForeverIcon sx={{ color: "#ef4444", fontSize: 20 }} />
            </Box>
            <Box>
              <Typography fontSize={16} fontWeight={700} color="#fff">Eliminar cuenta</Typography>
              <Typography fontSize={12} color="#64748b">Esta acción no se puede deshacer</Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: "12px !important" }}>
          <Typography fontSize={13} color="#94a3b8" mb={2.5} lineHeight={1.6}>
            Se eliminarán permanentemente tu perfil, dietas, solicitudes y todos tus datos. Ingresa tu contraseña para confirmar.
          </Typography>

          <Typography fontSize={12} fontWeight={600} color="#94a3b8" mb={0.8}>Contraseña</Typography>
          <Box sx={{ position: "relative" }}>
            <input
              type={showDeletePassword ? "text" : "password"}
              placeholder="Tu contraseña actual"
              value={deletePassword}
              onChange={e => setDeletePassword(e.target.value)}
              disabled={deleting}
              style={{
                width: "100%", background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, padding: "11px 44px 11px 14px",
                color: "white", fontSize: 14, outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={e => (e.target.style.borderColor = "rgba(239,68,68,0.5)")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
            <Box
              component="button"
              type="button"
              onClick={() => setShowDeletePassword(!showDeletePassword)}
              sx={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", p: 0 }}
            >
              {showDeletePassword ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            disabled={deleting}
            sx={{ flex: 1, borderRadius: "10px", textTransform: "none", fontWeight: 600, fontSize: 13, color: "#64748b", border: "1px solid rgba(255,255,255,0.1)", "&:hover": { background: "rgba(255,255,255,0.04)" } }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteAccount}
            disabled={deleting || !deletePassword}
            sx={{ flex: 1, borderRadius: "10px", textTransform: "none", fontWeight: 700, fontSize: 13, background: "#ef4444", color: "white", "&:hover": { background: "#dc2626" }, "&:disabled": { opacity: 0.4 } }}
          >
            {deleting ? <CircularProgress size={16} color="inherit" /> : "Eliminar cuenta"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;
