import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  LinearProgress,
  Chip
} from "@mui/material";
import TableChartIcon from "@mui/icons-material/TableChart";

interface Plan {
  name: string;
  usuarios: number;
  ingresos: number;
  crecimiento: number;
}

interface Props {
  dashboard: any;
}

const ProjectsTable: React.FC<Props> = ({ dashboard }) => {
  const planes: Plan[] = dashboard?.planes || [];

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
          <TableChartIcon sx={{ fontSize: 18, color: "#60a5fa" }} />
          <Typography fontWeight={700} fontSize={14} color="white">
            Planes
          </Typography>
        </Box>
        <Typography fontSize={11.5} sx={{ color: "#475569", mb: 2 }}>
          Planes disponibles en la plataforma
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              {["Nombre", "Usuarios", "Ingresos", "Crecimiento"].map((col) => (
                <TableCell
                  key={col}
                  sx={{
                    color: "#475569",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    pb: 1.2
                  }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {planes.map((plan, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:hover td": { background: "rgba(255,255,255,0.02)" },
                  "& td": { borderBottom: "1px solid rgba(255,255,255,0.04)" }
                }}
              >
                <TableCell sx={{ py: 1.5 }}>
                  <Chip
                    label={plan.name}
                    size="small"
                    sx={{
                      background: "rgba(59,130,246,0.12)",
                      color: "#60a5fa",
                      border: "1px solid rgba(59,130,246,0.25)",
                      fontSize: 11,
                      fontWeight: 600
                    }}
                  />
                </TableCell>

                <TableCell sx={{ color: "white", fontSize: 13, fontWeight: 600 }}>
                  {plan.usuarios}
                </TableCell>

                <TableCell sx={{ color: "#34d399", fontSize: 13, fontWeight: 700 }}>
                  ${plan.ingresos.toLocaleString()}
                </TableCell>

                <TableCell sx={{ minWidth: 100 }}>
                  <Typography fontSize={11} sx={{ color: "#64748b", mb: 0.5 }}>
                    {Math.round(plan.crecimiento)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(Math.abs(Math.round(plan.crecimiento)), 100)}
                    sx={{
                      height: 5,
                      borderRadius: 5,
                      backgroundColor: "rgba(255,255,255,0.07)",
                      "& .MuiLinearProgress-bar": {
                        background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                        borderRadius: 5
                      }
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProjectsTable;
