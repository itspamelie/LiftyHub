import { Box, Typography, TextField, IconButton } from "@mui/material";
import { Card, CardContent } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";


export default function UserDashboard() {
      return (
 <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1a2035",
        padding: 1
      }}
    >
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
          &nbsp;Usuarios
        </Typography>
      </Box>

      {/* Right side */}

      <Box display="flex" alignItems="center" gap={2}>
        
        <TextField
          size="small"
          placeholder="Buscar..."
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

      <Box sx={{ p: 3 }}>

  

<Card
      sx={{
        background: "#202940",
        borderRadius: "16px",
        color: "white",
        boxShadow: "0px 8px 20px rgba(0,0,0,0.3)"
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between">

          <Box>
            <Typography variant="body2" sx={{ color: "#8f9bb3" }}>
              
            </Typography>

            <Typography variant="h5" fontWeight="bold">
              
            </Typography>
          </Box>

          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: "12px",
              background: ""
            }}
          />

        </Box>

        <Typography
          variant="body2"
          sx={{ mt: 2, color: "#8f9bb3" }}
        >
          
        </Typography>

      </CardContent>
    </Card>



        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 3,
            mt: 3
          }}
        >
        </Box>

      </Box>
    </Box>
  );

}