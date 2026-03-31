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
  LinearProgress
} from "@mui/material";

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
        background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
        color: "white",
        borderRadius: "16px"
      }}
    >
      <CardContent>

        <Typography variant="h6" fontWeight="bold">
          Planes
        </Typography>

        <Typography variant="body2" sx={{ color: "#8f9bb3", mb: 2 }}>
          Planes disponibles en la plataforma
        </Typography>

        <Table>

          <TableHead>
            <TableRow>

              <TableCell sx={{ color: "#8f9bb3" }}>
                Nombre
              </TableCell>

              <TableCell sx={{ color: "#8f9bb3" }}>
                Usuarios Suscritos
              </TableCell>

              <TableCell sx={{ color: "#8f9bb3" }}>
                Ingresos
              </TableCell>

              <TableCell sx={{ color: "#8f9bb3" }}>
                Crecimiento
              </TableCell>

            </TableRow>
          </TableHead>

          <TableBody>

            {planes.map((plan, index) => {


              return (
                <TableRow key={index}>

                  <TableCell sx={{ color: "white" }}>
                    {plan.name}
                  </TableCell>

                  <TableCell sx={{ color: "white" }}>
                    {plan.usuarios}
                  </TableCell>

                  <TableCell sx={{ color: "white" }}>
                    ${plan.ingresos.toLocaleString()}
                  </TableCell>

                  <TableCell>

                    <Box width="100%">

                      <Typography
                        variant="body2"
                        sx={{ color: "#8f9bb3" }}
                      >
                         {Math.round(plan.crecimiento)}%
                      </Typography>

                      <LinearProgress
                        variant="determinate"
                         value={Math.abs(Math.round(plan.crecimiento))}
                        sx={{
                          mt: 1,
                          height: 6,
                          borderRadius: 5
                        }}
                      />

                    </Box>

                  </TableCell>

                </TableRow>
              );

            })}

          </TableBody>

        </Table>

      </CardContent>
    </Card>
  );
};

export default ProjectsTable;