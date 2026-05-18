import { Card, CardContent, Typography, Box } from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight"

const STAT_CARDS = [
  { key: "total_users", label: "Usuarios registrados", icon: <PersonIcon sx={{ color: "white", fontSize: 20 }} />, gradient: "linear-gradient(135deg,#1a73e8,#60a5fa)", glow: "rgba(59,130,246,0.3)" },
  { key: "new_users_this_month", label: "Nuevos este mes", icon: <PersonAddIcon sx={{ color: "white", fontSize: 20 }} />, gradient: "linear-gradient(135deg,#7c3aed,#a78bfa)", glow: "rgba(124,58,237,0.3)" },
  { key: "trained_today", label: "Entrenaron hoy", icon: <FitnessCenterIcon sx={{ color: "white", fontSize: 20 }} />, gradient: "linear-gradient(135deg,#059669,#34d399)", glow: "rgba(5,150,105,0.3)" },
  { key: "average_weight", label: "Peso promedio", suffix: " kg", icon: <MonitorWeightIcon sx={{ color: "white", fontSize: 20 }} />, gradient: "linear-gradient(135deg,#dc2626,#f87171)", glow: "rgba(220,38,38,0.3)" },
]

export default function UserStats({ stats }: any) {
  return (
    <Box sx={{ display: "grid", gridColumn: "span 4", gridTemplateColumns: "repeat(4,1fr)", gap: 2.5 }}>
      {STAT_CARDS.map(({ key, label, icon, gradient, glow, suffix }) => (
        <Card
          key={key}
          sx={{
            background: "linear-gradient(135deg, #13141c 0%, #0f1117 100%)",
            color: "white",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": { transform: "translateY(-2px)", boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 20px ${glow}` }
          }}
        >
          <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "14px",
                background: gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                boxShadow: `0 4px 14px ${glow}`
              }}
            >
              {icon}
            </Box>
            <Typography variant="h4" fontWeight={800} color="white" lineHeight={1} mb={0.5}>
              {stats?.[key] ?? 0}{suffix ?? ""}
            </Typography>
            <Typography fontSize={12} sx={{ color: "#475569" }}>
              {label}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
