import { Paper, Typography, Box } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

const AlertsPanel: React.FC = () => {
  return (
    <Paper
      sx={{
        p: 4,
        bgcolor: "rgba(38,38,38,0.7)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.05)"
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <WarningIcon sx={{ color: "#ff716c" }} />
        <Typography fontWeight="bold">
          Alertas Críticas
        </Typography>
      </Box>

      <Typography fontSize={12} color="#ababab">
        Roberto Gomez - Glucosa 45 mg/dL
      </Typography>
    </Paper>
  );
};

export default AlertsPanel;