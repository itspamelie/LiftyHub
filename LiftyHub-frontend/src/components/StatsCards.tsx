import { Card, CardContent, Typography, Box } from "@mui/material";
import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: string;
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

const StatsCards: React.FC = () => {
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
        title="Bookings"
        value="281"
        subtitle="+55% than last week"
        color="linear-gradient(45deg,#1a73e8,#64b5f6)"
      />

      <StatCard
        title="Today's Users"
        value="2,300"
        subtitle="+3% than last month"
        color="linear-gradient(45deg,#1a73e8,#64b5f6)"
      />

      <StatCard
        title="Revenue"
        value="34k"
        subtitle="+1% than yesterday"
        color="linear-gradient(45deg,#43a047,#66bb6a)"
      />

      <StatCard
        title="Followers"
        value="+91"
        subtitle="Just updated"
        color="linear-gradient(45deg,#e91e63,#ff6090)"
      />
    </Box>
  );
};

export default StatsCards;