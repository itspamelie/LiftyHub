import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const barData = {
  labels: ["M", "T", "W", "T", "F", "S", "S"],
  datasets: [
    {
      label: "Views",
      data: [50, 20, 10, 22, 50, 10, 40],
      backgroundColor: "#1a73e8"
    }
  ]
};

const lineData = {
  labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  datasets: [
    {
      label: "Sales",
      data: [50, 200, 300, 500, 350, 200, 500],
      borderColor: "#43a047",
      backgroundColor: "rgba(67,160,71,0.2)"
    }
  ]
};

const ChartsRow: React.FC = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 3,
        p: 3
      }}
    >
      {/* Website Views */}

      <Card sx={{ background: "#202940", color: "white" }}>
        <CardContent>

          <Bar data={barData} />

          <Typography mt={2} fontWeight="bold">
            Website Views
          </Typography>

          <Typography variant="body2" color="gray">
            Last Campaign Performance
          </Typography>

        </CardContent>
      </Card>

      {/* Daily Sales */}

      <Card sx={{ background: "#202940", color: "white" }}>
        <CardContent>

          <Line data={lineData} />

          <Typography mt={2} fontWeight="bold">
            Daily Sales
          </Typography>

          <Typography variant="body2" color="gray">
            (+15%) increase in today sales.
          </Typography>

        </CardContent>
      </Card>

      {/* Completed Tasks */}

      <Card sx={{ background: "#202940", color: "white" }}>
        <CardContent>

          <Line data={lineData} />

          <Typography mt={2} fontWeight="bold">
            Completed Tasks
          </Typography>

          <Typography variant="body2" color="gray">
            Last Campaign Performance
          </Typography>

        </CardContent>
      </Card>

    </Box>
  );
};

export default ChartsRow;