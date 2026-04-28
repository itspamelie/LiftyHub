import { Box, TextField, IconButton, Typography, Avatar } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useEffect, useState } from "react";
import { apiFetch,getImageUrl } from "../../services/api";

const Topbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
useEffect(() => {
  const fetchUser = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const parsed = storedUser ? JSON.parse(storedUser) : null;

      if (!parsed) return;

      const userId = parsed.id; 

      const response = await apiFetch(`/users/${userId}`, {
        method: "GET"
      });

      console.log("USER API:", response.data);

      setUser(response.data);
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
    }
  };

  fetchUser();
}, []);
  return (
    <Box
      sx={{
        height: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 4,
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)"
      }}
    >
      <TextField
        placeholder="Buscar..."
        variant="standard"
        InputProps={{
          disableUnderline: true
        }}
        sx={{
          bgcolor: "#131313",
          px: 2,
          py: 1,
          borderRadius: 1,
          width: 300,
          input: { color: "white" }
        }}
      />

      <Box display="flex" alignItems="center" gap={3}>
        <IconButton sx={{ color: "#ababab" }}>
          <NotificationsIcon />
        </IconButton>

        <IconButton sx={{ color: "#ababab" }}>
          <HelpOutlineIcon />
        </IconButton>

       <Typography  color="white">
  {user ? user.name : "Cargando..."}
</Typography>
{user && (
  <Avatar src={getImageUrl(user.img, "users")} />
)}
      </Box>
    </Box>
  );
};

export default Topbar;