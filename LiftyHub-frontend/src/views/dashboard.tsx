import Sidebar from "../components/dashboard/Sidebar";
import { Box } from "@mui/material";
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
export default function Dashboard() {


  const token = localStorage.getItem("token")
  const user = localStorage.getItem("user")

  if (!token || !user || isTokenExpired(token)) {
    localStorage.clear()
    return <Navigate to="/login" replace />
  }
  
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#000000"
      }}
    >
      <Sidebar />
      <Outlet />
    </Box>
  );


  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#000000"
      }}
    >

      {/* Sidebar */}
      <Sidebar />

      {/* Aquí se renderiza MainDashboard */}
      <Outlet />

    </Box>
  );
}