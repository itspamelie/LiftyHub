import {
  Box,
  Typography,
  Paper,
  Button,
  TextField
} from "@mui/material";
import Grid from "@mui/material/Grid";

export default function NutritionistJoin() {
  return (
  <Box
      sx={{
        minHeight: "100vh",
        background: "#00000",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 3,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Glow fondo */}
      <Box
        sx={{
          position: "absolute",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(59,130,246,0.3), transparent 80%)",
          filter: "blur(100px)",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 0
        }}
      />

      {/* CONTENIDO */}
      <Box sx={{ position: "relative", zIndex: 1, maxWidth: "900px" }}>
        
        {/* TAG */}
        <Typography
          sx={{
            mb: 2,
            fontSize: "12px",
            letterSpacing: "2px",
            color: "#94a3b8"
          }}
        >
          ● LIFTYHUB EXPERTS
        </Typography>

        {/* TITULO */}
        <Typography
          sx={{
            fontSize: { xs: "32px", md: "60px" },
            fontWeight: "bold",
            lineHeight: 1.2
          }}
        >
          Transforma la nutrición <br />
          <span
            style={{
              background: "linear-gradient(90deg,#60a5fa,#3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            y gana con cada plan
          </span>
        </Typography>

        {/* SUBTEXTO */}
        <Typography
          sx={{
            mt: 3,
            color: "#94a3b8",
            fontSize: "16px",
            maxWidth: "600px",
            mx: "auto"
          }}
        >
          Conecta con clientes, crea planes personalizados y monetiza tu conocimiento 
          dentro del ecosistema LiftyHub.
        </Typography>

        {/* BOTONES */}
        <Box
          mt={4}
          display="flex"
          justifyContent="center"
          gap={2}
          flexWrap="wrap"
        >
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(90deg,#3b82f6,#60a5fa)",
              px: 4,
              py: 1.5,
              borderRadius: "10px",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(90deg,#2563eb,#3b82f6)"
              }
            }}
          >
            Únete como Nutriólogo
          </Button>

          <Button
            variant="text"
            sx={{
              color: "#94a3b8",
              textTransform: "none"
            }}
          >
            Ya tengo una cuenta →
          </Button>
        </Box>
      </Box>
    </Box>
  );
}