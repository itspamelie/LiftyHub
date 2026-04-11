import { Paper, Typography, Box } from "@mui/material";

interface Props {
  title: string;
  value: string;
  extra: string;
}

const MetricCard: React.FC<Props> = ({ title, value, extra }) => {
  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: "#191919",
        position: "relative",
        overflow: "hidden",
        borderRadius: 2
      }}
    >
      <Typography fontSize={10} color="#ababab" mb={2}>
        {title}
      </Typography>

      <Box display="flex" alignItems="baseline" gap={1}>
        <Typography fontSize={32} fontWeight="bold">
          {value}
        </Typography>

        <Typography color="#00e3fd" fontSize={12}>
          {extra}
        </Typography>
      </Box>

      {/* Glow effect */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 40,
          background:
            "linear-gradient(180deg, rgba(0,227,253,0.05), transparent)"
        }}
      />
    </Paper>
  );
};

export default MetricCard;