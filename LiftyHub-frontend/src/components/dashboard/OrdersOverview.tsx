import React from "react";
import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

interface Props {
  dashboard: any;
}

const OrdersOverview: React.FC<Props> = ({ dashboard }) => {
  const actividad = dashboard?.actividad || [];

  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #13141c 0%, #0f1117 100%)",
        color: "white",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Box display="flex" alignItems="center" gap={1} mb={0.4}>
          <AccessTimeIcon sx={{ fontSize: 18, color: "#a78bfa" }} />
          <Typography fontWeight={700} fontSize={14} color="white">
            Actividad reciente
          </Typography>
        </Box>
        <Typography fontSize={11.5} sx={{ color: "#475569", mb: 2 }}>
          Últimas suscripciones registradas
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {actividad.length === 0 && (
            <Typography fontSize={12} sx={{ color: "#334155", textAlign: "center", py: 2 }}>
              Sin actividad reciente
            </Typography>
          )}

          {actividad.map((act: any, index: number) => {
            const fecha = new Date(act.created_at);
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.2,
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  transition: "background 0.2s",
                  "&:hover": { background: "rgba(255,255,255,0.06)" }
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: 13,
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                    flexShrink: 0
                  }}
                >
                  {act.usuario?.[0]?.toUpperCase() ?? "U"}
                </Avatar>

                <Box flex={1} minWidth={0}>
                  <Typography fontSize={12} fontWeight={600} color="white" noWrap>
                    {act.usuario}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <WorkspacePremiumIcon sx={{ fontSize: 10, color: "#60a5fa" }} />
                    <Typography fontSize={10.5} sx={{ color: "#60a5fa" }} noWrap>
                      {act.plan}
                    </Typography>
                  </Box>
                </Box>

                <Typography fontSize={10} sx={{ color: "#334155", flexShrink: 0 }}>
                  {fecha.toLocaleDateString("es-MX", { month: "short", day: "numeric" })}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrdersOverview;
