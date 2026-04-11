import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar
} from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";

export default function NutritionistJoin() {
    const navigate= useNavigate();
  return (
    <Box sx={{ bgcolor: "#0e0e0e", color: "#fff", overflow: "hidden" }}>

      {/* NAVBAR */}
      <AppBar
        position="fixed"
        sx={{
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(12px)",
          boxShadow: "none",
          borderBottom: "1px solid rgba(255,255,255,0.05)"
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: 4 }}>
          <Typography sx={{ fontWeight: 800, color: "#4dabf5" }}>
            LiftyHub
          </Typography>

          

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button onClick={() => navigate(`/Liftyhub-Experts-Login`)} sx={{ color: "#aaa" }}>Login</Button>
            <Button
              variant="contained"
              sx={{
                background: "#4dabf5",
                borderRadius: "10px",
                boxShadow: "0 0 20px rgba(77,171,245,0.4)"
              }}
            >
              Únete
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* HERO */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          pt: 10
        }}
      >
        {/* Glow background */}
        <Box
          sx={{
            position: "absolute",
            top: "20%",
            right: "20%",
            width: 500,
            height: 500,
            background: "rgba(77,171,245,0.15)",
            filter: "blur(120px)",
            borderRadius: "50%"
          }}
        />

        {/* Background image */}
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1581091215367-59ab6b3a8c3d"
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.15,
            filter: "grayscale(100%)"
          }}
        />

        {/* Content */}
        <Box sx={{ position: "relative", textAlign: "center", px: 3 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "#1f1f1f",
              px: 2,
              py: 0.5,
              borderRadius: "20px",
              mb: 4
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                bgcolor: "#00e3fd",
                borderRadius: "50%",
                animation: "pulse 1.5s infinite"
              }}
            />
            <Typography fontSize={12} color="#aaa">
              LiftyHub Experts
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: { xs: "40px", md: "80px" },
              fontWeight: 900,
              lineHeight: 1.1,
              mb: 4
            }}
          >
            Transforma la nutrición <br />
            <Box component="span" sx={{ color: "#4dabf5", fontStyle: "italic" }}>
              y gana por cada dieta
            </Box>
          </Typography>

          <Typography sx={{ color: "#aaa", maxWidth: 600, mx: "auto", mb: 6 }}>
            Convierte tus planes alimenticios en ingresos reales dentro de LiftyHub.
          </Typography>

          <Box sx={{ display: "flex", gap: 3, justifyContent: "center" }}>
            <Button
              variant="contained"
              sx={{
                px: 5,
                py: 2,
                borderRadius: "12px",
                fontWeight: "bold",
                background: "#4dabf5",
                boxShadow: "0 0 30px rgba(77,171,245,0.4)"
              }}
            >
              Únete como Nutriólogo
            </Button>

            <Button onClick={() => navigate(`/Liftyhub-Experts-Login`)} sx={{ color: "#fff" }}>
              Ya soy miembro →
            </Button>
          </Box>
        </Box>
      </Box>

      {/* FEATURES */}
      <Box sx={{ py: 15, px: 4 }}>
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Typography
            sx={{
              fontSize: { xs: "32px", md: "60px" },
              fontWeight: 900,
              mb: 8
            }}
          >
            Monetiza tu expertise
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 4
            }}
          >
            {/* Card */}
            <Box
              sx={{
                p: 6,
                borderRadius: "16px",
                background: "#1a1a1a",
                position: "relative",
                transition: "0.3s",
                "&:hover": {
                  background: "#222",
                  transform: "translateY(-5px)"
                }
              }}
            >
              <Typography variant="h5" fontWeight="bold" mb={2}>
                Pago por solicitud
              </Typography>
              <Typography sx={{ color: "#aaa" }}>
                Recibe dinero por cada dieta generada.
              </Typography>
            </Box>

            <Box
              sx={{
                p: 6,
                borderRadius: "16px",
                background: "#1a1a1a",
                transition: "0.3s",
                "&:hover": {
                  background: "#222",
                  transform: "translateY(-5px)"
                }
              }}
            >
              <Typography variant="h5" fontWeight="bold" mb={2}>
                Flexibilidad total
              </Typography>
              <Typography sx={{ color: "#aaa" }}>
                Trabaja a tu ritmo sin límites.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* CTA FINAL */}
      <Box sx={{ py: 20, textAlign: "center" }}>
        <Typography sx={{ fontSize: "60px", fontWeight: 900, mb: 4 }}>
          ¿Listo para el futuro?
        </Typography>

        <Typography sx={{ color: "#aaa", mb: 6 }}>
          Únete a la red de nutricionistas de LiftyHub
        </Typography>

        <Button
          variant="contained"
          sx={{
            px: 6,
            py: 2,
            fontSize: "18px",
            borderRadius: "12px",
            background: "#4dabf5",
            boxShadow: "0 0 30px rgba(77,171,245,0.4)"
          }}
        >
          Comenzar
        </Button>
      </Box>

    </Box>
  );
}