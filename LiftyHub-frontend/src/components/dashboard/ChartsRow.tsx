import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";

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

const DARK_OPTIONS = {
  responsive: true,
  plugins: {
    legend: {
      labels: { color: "#94a3b8", font: { size: 11 } }
    },
    tooltip: {
      backgroundColor: "#0f1117",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      titleColor: "#fff",
      bodyColor: "#94a3b8"
    }
  },
  scales: {
    x: {
      ticks: { color: "#64748b", font: { size: 10 } },
      grid: { color: "rgba(255,255,255,0.04)" }
    },
    y: {
      ticks: { color: "#64748b", font: { size: 10 } },
      grid: { color: "rgba(255,255,255,0.04)" }
    }
  }
};

const PIE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: { color: "#94a3b8", font: { size: 11 }, padding: 16 }
    },
    tooltip: {
      backgroundColor: "#0f1117",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      titleColor: "#fff",
      bodyColor: "#94a3b8"
    }
  }
};

interface ChartCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  accent: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ icon, title, subtitle, accent, children }) => (
  <Card
    sx={{
      background: "linear-gradient(135deg, #13141c 0%, #0f1117 100%)",
      borderRadius: "20px",
      color: "white",
      border: "1px solid rgba(255,255,255,0.07)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
    }}
  >
    <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
      <Box display="flex" alignItems="center" gap={1} mb={0.4}>
        <Box
          sx={{
            color: accent,
            display: "flex",
            alignItems: "center"
          }}
        >
          {icon}
        </Box>
        <Typography fontWeight={700} fontSize={14} color="white">
          {title}
        </Typography>
      </Box>
      <Typography fontSize={11.5} sx={{ color: "#475569", mb: 2 }}>
        {subtitle}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

interface ChartsRowProps {
  dashboard: any;
}

const ChartsRow: React.FC<ChartsRowProps> = ({ dashboard }) => {
  const barData = {
    labels: dashboard?.usuariosPorDia?.map((i: any) => i.fecha) || [],
    datasets: [
      {
        label: "Usuarios",
        data: dashboard?.usuariosPorDia?.map((i: any) => i.total) || [],
        backgroundColor: "rgba(59,130,246,0.7)",
        borderRadius: 6,
        borderSkipped: false
      }
    ]
  };

  const lineData = {
    labels: dashboard?.suscripcionesPorPlan?.map((i: any) => i.name) || [],
    datasets: [
      {
        label: "Suscripciones",
        data: dashboard?.suscripcionesPorPlan?.map((i: any) => i.total) || [],
        borderColor: "#10B981",
        backgroundColor: "rgba(16,185,129,0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#10B981",
        pointRadius: 4
      }
    ]
  };

  const pieData = {
    labels: ["Con suscripción", "Sin suscripción"],
    datasets: [
      {
        data: [
          dashboard?.usuariosSuscripcion?.con ?? 0,
          dashboard?.usuariosSuscripcion?.sin ?? 0
        ],
        backgroundColor: ["#3b82f6", "#1e293b"],
        borderColor: ["rgba(59,130,246,0.5)", "rgba(30,41,59,0.5)"],
        borderWidth: 1
      }
    ]
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 2.5,
        px: 3,
        pb: 2
      }}
    >
      <ChartCard
        icon={<BarChartIcon sx={{ fontSize: 18 }} />}
        title="Usuarios"
        subtitle="Registros por día"
        accent="#3b82f6"
      >
        <Bar data={barData} options={DARK_OPTIONS} />
      </ChartCard>

      <ChartCard
        icon={<ShowChartIcon sx={{ fontSize: 18 }} />}
        title="Suscripciones"
        subtitle="Suscripciones por tipo de plan"
        accent="#10B981"
      >
        <Line data={lineData} options={DARK_OPTIONS} />
      </ChartCard>

      <ChartCard
        icon={<DonutLargeIcon sx={{ fontSize: 18 }} />}
        title="Distribución"
        subtitle="Usuarios suscritos vs plan gratuito"
        accent="#a78bfa"
      >
        <Box sx={{ height: 220 }}>
          <Pie data={pieData} options={PIE_OPTIONS} />
        </Box>
      </ChartCard>
    </Box>
  );
};

export default ChartsRow;
