
import {Box} from "@mui/material";
import { Outlet } from "react-router-dom";
export default function HomeDashboard(){
    return (
                <Box p={4} >
      <Outlet></Outlet>

        </Box>
    );
}