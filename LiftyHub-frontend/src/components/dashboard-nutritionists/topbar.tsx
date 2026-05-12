import { Box, IconButton, Avatar, Typography, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useEffect, useState } from "react";
import { apiFetch, getImageUrl } from "../../services/api";

const Topbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const stored = localStorage.getItem("user");
        const parsed = stored ? JSON.parse(stored) : null;
        if (!parsed) return;
        const res = await apiFetch(`/users/${parsed.id}`);
        setUser(res.data);
        const profilesRes = await apiFetch("/nutritionistProfiles");
        const profile = profilesRes.data.find((p: any) => Number(p.user_id) === Number(parsed.id));
        if (profile?.profile_pic) setProfilePic(getImageUrl(profile.profile_pic, "nutritionists"));
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const initials = user?.name
    ?.split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Box
      sx={{
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        px: 4,
        gap: 2,
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: "rgba(8,8,8,0.8)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <IconButton
        size="small"
        sx={{
          color: "#555",
          "&:hover": { color: "#aaa", background: "rgba(255,255,255,0.04)" },
        }}
      >
        <Badge
          variant="dot"
          sx={{ "& .MuiBadge-dot": { bgcolor: "#3B82F6", width: 6, height: 6 } }}
        >
          <NotificationsIcon fontSize="small" />
        </Badge>
      </IconButton>

      <Box display="flex" alignItems="center" gap={1.5}>
        <Box textAlign="right">
          <Typography fontSize={13} fontWeight={600} color="#ddd">
            {user?.name ?? "Cargando..."}
          </Typography>
          <Typography fontSize={11} color="#444">
            Nutriólogo
          </Typography>
        </Box>
        <Avatar
          src={profilePic ?? (user ? getImageUrl(user.img, "users") : "")}
          sx={{
            width: 34,
            height: 34,
            bgcolor: "#3B82F622",
            color: "#3B82F6",
            fontSize: 13,
            fontWeight: 700,
            border: "2px solid rgba(59,130,246,0.3)",
          }}
        >
          {initials}
        </Avatar>
      </Box>
    </Box>
  );
};

export default Topbar;
