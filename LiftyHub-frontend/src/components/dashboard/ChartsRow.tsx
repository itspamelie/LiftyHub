import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

interface ChartsRowProps {
  dashboard: any;
}

const ChartsRow: React.FC<ChartsRowProps> = ({ dashboard }) => {

  /* 📊 Usuarios por día */

  const barData = {
    labels: dashboard?.usuariosPorDia?.map((i: any) => i.fecha) || [],
    datasets: [
      {
        label: "Usuarios",
        data: dashboard?.usuariosPorDia?.map((i: any) => i.total) || [],
        backgroundColor: "#1a73e8"
      }
    ]
  };

  /* 📈 Suscripciones por plan */

  const lineData = {
    labels: dashboard?.suscripcionesPorPlan?.map((i: any) => i.name) || [],
    datasets: [
      {
        label: "Suscripciones",
        data: dashboard?.suscripcionesPorPlan?.map((i: any) => i.total) || [],
        borderColor: "#43a047",
        backgroundColor: "rgba(67,160,71,0.2)"
      }
    ]
  };

  /* 🥧 Usuarios con / sin suscripción */

  const pieData = {
    labels: ["Con suscripción", "Sin suscripción"],
    datasets: [
      {
        data: [
          dashboard?.usuariosSuscripcion?.con ?? 0,
          dashboard?.usuariosSuscripcion?.sin ?? 0
        ],
        backgroundColor: ["#3b82f6", "#1e293b"],
        borderWidth: 1
      }
    ]
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 3,
        p: 3
      }}
    >

      {/* 📊 Usuarios */}

      <Card sx={{ background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)", color: "white",  borderRadius: "16px" }}>
        <CardContent>

          <Bar data={barData} />

          <Typography mt={2} fontWeight="bold">
            Usuarios
          </Typography>

          <Typography variant="body2" color="gray">
            Cantidad de usuarios diarios
          </Typography>

        </CardContent>
      </Card>


      {/* 📈 Suscripciones por plan */}

      <Card sx={{ background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)", color: "white", borderRadius:"16px" }}>
        <CardContent>

          <Line data={lineData} />

          <Typography mt={2} fontWeight="bold">
            Suscripciones
          </Typography>

          <Typography variant="body2" color="gray">
            Suscripciones por tipo de plan
          </Typography>

        </CardContent>
      </Card>


      {/* 🥧 Usuarios con / sin suscripción */}

      <Card sx={{ background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)", color: "white", borderRadius:"16px" }}>
        <CardContent>

          <Box
            sx={{
              width: "220px",
              height: "220px",
              margin: "0 auto"
            }}
          >
            <Pie
              data={pieData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      color: "#fff"
                    }
                  }
                }
              }}
            />
          </Box>

          <Typography mt={2} fontWeight="bold">
            Usuarios
          </Typography>

          <Typography variant="body2" color="gray">
            Usuarios suscritos vs usuarios con plan gratuito
          </Typography>

        </CardContent>
      </Card>

    </Box>
  );
};

export default ChartsRow;