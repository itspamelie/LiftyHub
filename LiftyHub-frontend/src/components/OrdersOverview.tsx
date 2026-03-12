import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

interface OrderEvent {
  title: string;
  date: string;
  color: string;
}

const events: OrderEvent[] = [
  {
    title: "$2400, Design changes",
    date: "22 DEC 7:20 PM",
    color: "#4caf50"
  },
  {
    title: "New order #1832412",
    date: "21 DEC 11 PM",
    color: "#f44336"
  },
  {
    title: "Server payments for April",
    date: "21 DEC 9:34 PM",
    color: "#2196f3"
  },
  {
    title: "New card added for order #4395133",
    date: "20 DEC 2:20 AM",
    color: "#ff9800"
  },
  {
    title: "Unlock packages for development",
    date: "18 DEC 4:54 AM",
    color: "#9c27b0"
  }
];

const OrdersOverview: React.FC = () => {
  return (
    <Card
      sx={{
        background: "#202940",
        color: "white",
        borderRadius: "16px"
      }}
    >
      <CardContent>

        <Typography variant="h6" fontWeight="bold">
          Orders Overview
        </Typography>

        <Typography variant="body2" sx={{ color: "#8f9bb3", mb: 3 }}>
          +24% this month
        </Typography>

        {events.map((event, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            mb={2}
          >

            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: event.color,
                mr: 2
              }}
            />

            <Box>

              <Typography variant="body2">
                {event.title}
              </Typography>

              <Typography
                variant="caption"
                sx={{ color: "#8f9bb3" }}
              >
                {event.date}
              </Typography>

            </Box>

          </Box>
        ))}

      </CardContent>
    </Card>
  );
};

export default OrdersOverview;