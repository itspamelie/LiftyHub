import { Card, CardContent, Typography, Box } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  glow: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, gradient, glow }) => (
  <Card
    sx={{
      background: "linear-gradient(135deg, #13141c 0%, #0f1117 100%)",
      borderRadius: "20px",
      color: "white",
      border: "1px solid rgba(255,255,255,0.07)",
      boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)`,
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 20px ${glow}`
      }
    }}
  >
    <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: "14px",
            background: gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 4px 14px ${glow}`
          }}
        >
          {icon}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            px: 1,
            py: 0.4,
            borderRadius: "8px",
            background: "rgba(52,211,153,0.1)",
            border: "1px solid rgba(52,211,153,0.2)"
          }}
        >
          <TrendingUpIcon sx={{ fontSize: 12, color: "#34d399" }} />
          <Typography sx={{ fontSize: 11, color: "#34d399", fontWeight: 700 }}>
            activo
          </Typography>
        </Box>
      </Box>

      <Typography variant="h4" fontWeight={800} color="white" lineHeight={1} mb={0.5}>
        {value}
      </Typography>

      <Typography fontSize={13} fontWeight={600} color="white" mb={0.3}>
        {title}
      </Typography>

      <Typography fontSize={11.5} sx={{ color: "#475569" }}>
        {subtitle}
      </Typography>
    </CardContent>
  </Card>
);

interface StatsCardsProps {
  dashboard: any;
}

const StatsCards: React.FC<StatsCardsProps> = ({ dashboard }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 2.5,
      px: 3,
      pt: 2,
      pb: 1
    }}
  >
    <StatCard
      title="Suscripciones"
      value={dashboard?.stats?.suscripciones ?? 0}
      subtitle="Suscripciones activas"
      icon={<WorkspacePremiumIcon sx={{ color: "white", fontSize: 22 }} />}
      gradient="linear-gradient(135deg, #1a73e8, #60a5fa)"
      glow="rgba(59,130,246,0.3)"
    />
    <StatCard
      title="Usuarios"
      value={dashboard?.stats?.usuarios ?? 0}
      subtitle="Registrados en la app"
      icon={<PeopleAltIcon sx={{ color: "white", fontSize: 22 }} />}
      gradient="linear-gradient(135deg, #7c3aed, #a78bfa)"
      glow="rgba(124,58,237,0.3)"
    />
    <StatCard
      title="Ingresos"
      value={`$${dashboard?.stats?.ingresos ?? 0}`}
      subtitle="De las suscripciones"
      icon={<AttachMoneyIcon sx={{ color: "white", fontSize: 22 }} />}
      gradient="linear-gradient(135deg, #059669, #34d399)"
      glow="rgba(5,150,105,0.3)"
    />
    <StatCard
      title="Rutinas"
      value={dashboard?.stats?.rutinas ?? 0}
      subtitle="Creadas por usuarios"
      icon={<FitnessCenterIcon sx={{ color: "white", fontSize: 22 }} />}
      gradient="linear-gradient(135deg, #dc2626, #f87171)"
      glow="rgba(220,38,38,0.3)"
    />
  </Box>
);

export default StatsCards;
