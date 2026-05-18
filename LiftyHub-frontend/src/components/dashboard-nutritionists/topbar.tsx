import {
  Box,
  IconButton,
  Avatar,
  Typography,
  Badge,
  Popover,
  Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InboxIcon from "@mui/icons-material/Inbox";
import { useEffect, useState } from "react";
import { apiFetch, getImageUrl } from "../../services/api";

const Topbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<number | null>(null);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [bellAnchor, setBellAnchor] = useState<null | HTMLElement>(null);

  const loadProfile = async () => {
    try {
      const stored = localStorage.getItem("user");
      const parsed = stored ? JSON.parse(stored) : null;
      if (!parsed) return;
      const res = await apiFetch(`/users/${parsed.id}`);
      setUser(res.data);
      const profilesRes = await apiFetch("/nutritionistProfiles");
      const profile = profilesRes.data.find((p: any) => Number(p.user_id) === Number(parsed.id));
      if (profile) {
        setProfileId(profile.id);
        if (profile.profile_pic) {
          setProfilePic(getImageUrl(profile.profile_pic, "nutritionists") + "?t=" + Date.now());
        }
        fetchPending(profile.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProfile();
    const handler = () => loadProfile();
    window.addEventListener("nutri-pic-updated", handler);
    return () => window.removeEventListener("nutri-pic-updated", handler);
  }, []);

  const fetchPending = async (pId?: number) => {
    const id = pId ?? profileId;
    if (!id) return;
    try {
      const res = await apiFetch(`/dietRequests/nutritionist/${id}`);
      const pending = (res.data ?? []).filter((r: any) => r.status === "pending");
      setPendingRequests(pending);
    } catch {
      // silent
    }
  };

  const initials = user?.name
    ?.split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const bellOpen = Boolean(bellAnchor);

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
        background: "rgba(11,15,20,0.9)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* BELL */}
      <IconButton
        size="small"
        onClick={(e) => {
          setBellAnchor(e.currentTarget);
          fetchPending();
        }}
        sx={{
          color: pendingRequests.length > 0 ? "#FBBF24" : "#94a3b8",
          "&:hover": { color: "#FBBF24", background: "rgba(251,191,36,0.06)" },
        }}
      >
        <Badge
          badgeContent={pendingRequests.length || undefined}
          sx={{
            "& .MuiBadge-badge": {
              bgcolor: "#FBBF24",
              color: "#000",
              fontSize: 10,
              fontWeight: 700,
              minWidth: 16,
              height: 16,
            },
          }}
        >
          <NotificationsIcon fontSize="small" />
        </Badge>
      </IconButton>

      {/* BELL POPOVER */}
      <Popover
        open={bellOpen}
        anchorEl={bellAnchor}
        onClose={() => setBellAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              background: "#141d2b",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "14px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
              width: 300,
              mt: 1,
              overflow: "hidden",
            },
          },
        }}
      >
        <Box px={2.5} py={2} display="flex" alignItems="center" justifyContent="space-between">
          <Typography fontSize={13} fontWeight={700} color="#fff">
            Solicitudes pendientes
          </Typography>
          {pendingRequests.length > 0 && (
            <Box
              sx={{
                px: 1.2, py: 0.2, borderRadius: "6px",
                bgcolor: "rgba(251,191,36,0.1)",
                color: "#FBBF24", fontSize: 11, fontWeight: 700,
              }}
            >
              {pendingRequests.length}
            </Box>
          )}
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />

        {pendingRequests.length === 0 ? (
          <Box py={4} textAlign="center">
            <InboxIcon sx={{ color: "#1e293b", fontSize: 36, mb: 1 }} />
            <Typography fontSize={13} color="#475569">Sin solicitudes pendientes</Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
            {pendingRequests.map((req: any, i: number) => (
              <Box
                key={req.id}
                px={2.5}
                py={1.5}
                sx={{
                  borderBottom: i < pendingRequests.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  "&:hover": { background: "rgba(255,255,255,0.02)" },
                  cursor: "default",
                }}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Avatar
                    sx={{
                      width: 30, height: 30,
                      bgcolor: "#FBBF2414",
                      color: "#FBBF24",
                      fontSize: 12, fontWeight: 700, flexShrink: 0,
                    }}
                  >
                    {req.user?.name?.[0] ?? "?"}
                  </Avatar>
                  <Box minWidth={0}>
                    <Typography fontSize={13} color="#ddd" fontWeight={500} noWrap>
                      {req.user?.name ?? `Solicitud #${req.id}`}
                    </Typography>
                    <Typography fontSize={11} color="#475569" noWrap>
                      {req.user?.email ?? ""}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Popover>

      {/* USER INFO */}
      <Box display="flex" alignItems="center" gap={1.5}>
        <Box textAlign="right">
          <Typography fontSize={13} fontWeight={600} color="#ddd">
            {user?.name ?? "Cargando..."}
          </Typography>
          <Typography fontSize={11} color="#64748b">
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
