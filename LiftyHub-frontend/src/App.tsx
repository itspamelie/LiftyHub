import React from "react";
import { Box } from "@mui/material";

import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import StatsCards from "./components/StatsCards";
import ChartsRow from "./components/ChartsRow";
import ProjectsTable from "./components/ProjectsTable";
import OrdersOverview from "./components/OrdersOverview";

function App() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#1a2035"
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#1a2035"
        }}
      >
        <TopNavbar />

        <Box sx={{ p: 3 }}>
          <StatsCards />

          <ChartsRow />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: 3,
              mt: 3
            }}
          >
            <ProjectsTable />
            <OrdersOverview />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App;