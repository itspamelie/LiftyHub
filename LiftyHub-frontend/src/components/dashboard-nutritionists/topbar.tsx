import { Box, TextField, IconButton, Typography, Avatar } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const Topbar: React.FC = () => {
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

        <Typography>Dr. Pame</Typography>
        <Avatar />
      </Box>
    </Box>
  );
};

export default Topbar;