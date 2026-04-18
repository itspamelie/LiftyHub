import { Box } from "@mui/material";
import Sidebar from "../components/dashboard-nutritionists/sidebar";
import Topbar from "../components/dashboard-nutritionists/topbar";
import { Outlet, Navigate } from "react-router-dom";


function isTokenExpired(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const now = Date.now() / 1000
    return payload.exp < now
  } catch {
    return true
  }
}

const Dashboard: React.FC = () => {

  
  const token = localStorage.getItem("token")
  const userString = localStorage.getItem("user")

  if (!token || !userString || isTokenExpired(token)) {
    localStorage.clear()
    return <Navigate to="/Liftyhub-Experts-Login" replace />
  }

  const user = JSON.parse(userString)

  //
  if (user.role !== "nutritionist") {
    return <Navigate to="/" replace />
  }
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