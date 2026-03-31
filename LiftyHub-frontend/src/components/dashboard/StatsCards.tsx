import { Card, CardContent, Typography, Box } from "@mui/material";
import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  color: string;
}

interface StatsCardsProps {
  dashboard: any;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  color
}) => {
  return (
    <Card
      sx={{
        background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
        borderRadius: "16px",
        color: "white",
        boxShadow: "0px 8px 20px rgba(0,0,0,0.3)"
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between">

          <Box>
            <Typography variant="body2" sx={{ color: "#8f9bb3" }}>
              {title}
            </Typography>

            <Typography variant="h5" fontWeight="bold">
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: "12px",
              background: color
            }}
          />

        </Box>

        <Typography
          variant="body2"
          sx={{ mt: 2, color: "#8f9bb3" }}
        >
          {subtitle}
        </Typography>

      </CardContent>
    </Card>
  );
};

const StatsCards: React.FC<StatsCardsProps> = ({ dashboard }) => {

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 3,
        p: 3
      }}
    >
      <StatCard
        title="Suscripciones"
        value={dashboard?.stats?.suscripciones ?? 0}
        subtitle="Suscripciones activas"
        color="linear-gradient(45deg,#1a73e8,#64b5f6)"
      />

      <StatCard
        title="Usuarios"
        value={dashboard?.stats?.usuarios ?? 0}
        subtitle="Registrados en la app"
        color="linear-gradient(45deg,#1a73e8,#64b5f6)"
      />

      <StatCard
        title="Ingresos"
value={`$${dashboard?.stats?.ingresos ?? 0}`}
        subtitle="De las suscripciones"
        color="linear-gradient(45deg,#43a047,#66bb6a)"
      />

      <StatCard
        title="Rutinas"
        value={dashboard?.stats?.rutinas ?? 0}
        subtitle="Registrados"
        color="linear-gradient(45deg,#e91e63,#ff6090)"
      />

    </Box>
  );
};

export default StatsCards;