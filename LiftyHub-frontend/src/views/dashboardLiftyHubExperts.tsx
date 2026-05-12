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
    <Box sx={{ display: "flex", bgcolor: "#0b0f14", minHeight: "100vh", color: "white", position: "relative", overflow: "hidden" }}>
      {/* Gradient blobs igual al landing */}
      <Box sx={{
        position: "fixed", top: -200, right: -200, width: 700, height: 700,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <Box sx={{
        position: "fixed", bottom: -200, left: 60, width: 600, height: 600,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <Sidebar />
      <Box sx={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1 }}>
        <Topbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;