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

interface Project {
  name: string;
  members: number;
  budget: string;
  completion: number;
}

const projects: Project[] = [
  {
    name: "Soft UI XD Version",
    members: 4,
    budget: "$14,000",
    completion: 60
  },
  {
    name: "Add Progress Track",
    members: 2,
    budget: "$3,000",
    completion: 10
  },
  {
    name: "Fix Platform Errors",
    members: 2,
    budget: "Not set",
    completion: 100
  },
  {
    name: "Launch Mobile App",
    members: 4,
    budget: "$20,500",
    completion: 100
  }
];

const ProjectsTable: React.FC = () => {
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
          Projects
        </Typography>

        <Typography variant="body2" sx={{ color: "#8f9bb3", mb: 2 }}>
          30 done this month
        </Typography>

        <Table>

          <TableHead>
            <TableRow>

              <TableCell sx={{ color: "#8f9bb3" }}>
                Companies
              </TableCell>

              <TableCell sx={{ color: "#8f9bb3" }}>
                Members
              </TableCell>

              <TableCell sx={{ color: "#8f9bb3" }}>
                Budget
              </TableCell>

              <TableCell sx={{ color: "#8f9bb3" }}>
                Completion
              </TableCell>

            </TableRow>
          </TableHead>

          <TableBody>

            {projects.map((project, index) => (
              <TableRow key={index}>

                <TableCell sx={{ color: "white" }}>
                  {project.name}
                </TableCell>

                <TableCell sx={{ color: "white" }}>
                  {project.members}
                </TableCell>

                <TableCell sx={{ color: "white" }}>
                  {project.budget}
                </TableCell>

                <TableCell>

                  <Box width="100%">

                    <Typography
                      variant="body2"
                      sx={{ color: "#8f9bb3" }}
                    >
                      {project.completion}%
                    </Typography>

                    <LinearProgress
                      variant="determinate"
                      value={project.completion}
                      sx={{
                        mt: 1,
                        height: 6,
                        borderRadius: 5
                      }}
                    />

                  </Box>

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