import { Box, Grid, Typography } from "@mui/material";
import Sidebar from "../components/dashboard-nutritionists/sidebar";
import Topbar from "../components/dashboard-nutritionists/topbar";
import { Outlet, Navigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ display: "flex", bgcolor: "#0e0e0e", minHeight: "100vh", color: "white" }}>
      
      <Sidebar />

      <Box sx={{ flex: 1 }}>
        <Topbar />

      <Outlet />

      </Box>
    </Box>
  );
};

export default Dashboard;