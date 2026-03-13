import React, { useState } from "react";
import { Card, CardContent, Typography, Box, TextField, Button } from "@mui/material";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background: "#1a2035",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Card
        sx={{
          width: 360,
          background: "#202940",
          borderRadius: "16px",
          color: "white",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.4)"
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 1, textAlign: "center" }}
          >
            LiftyHub
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#9ca3af", mb: 3, textAlign: "center" }}
          >
            Inicia sesión para continuar
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>

            <TextField
              fullWidth
              label="Correo electrónico"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                input: { color: "white" },
                label: { color: "#9ca3af" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#3a4563"
                  },
                  "&:hover fieldset": {
                    borderColor: "#3b82f6"
                  }
                }
              }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                input: { color: "white" },
                label: { color: "#9ca3af" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#3a4563"
                  },
                  "&:hover fieldset": {
                    borderColor: "#3b82f6"
                  }
                }
              }}
            />

            <Button
              fullWidth
              type="submit"
              sx={{
                mt: 3,
                background: "#3b82f6",
                color: "white",
                fontWeight: "bold",
                padding: "10px",
                borderRadius: "10px",
                "&:hover": {
                  background: "#2563eb"
                }
              }}
            >
              Iniciar sesión
            </Button>

          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;