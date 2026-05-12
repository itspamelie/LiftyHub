import { Box, Typography } from "@mui/material";

interface Props {
  title: string;
  value: string;
  extra: string;
  icon: React.ReactNode;
  color?: string;
}

const MetricCard: React.FC<Props> = ({
  title,
  value,
  extra,
  icon,
  color = "#3B82F6",
}) => {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: "16px",
        background: "#111",
        border: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.2s",
        "&:hover": {
          borderColor: `${color}33`,
        },
      }}
    >
      {/* Ambient glow */}
      <Box
        sx={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `${color}18`,
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography fontSize={12} color="#555" mb={2} letterSpacing="0.04em" textTransform="uppercase">
            {title}
          </Typography>
          <Typography
            fontSize={34}
            fontWeight={700}
            letterSpacing="-1px"
            sx={{ color: "#fff", lineHeight: 1 }}
          >
            {value}
          </Typography>
          <Typography fontSize={12} color={color} mt={1}>
            {extra}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "12px",
            background: `${color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Box>
  );
};

export default MetricCard;
