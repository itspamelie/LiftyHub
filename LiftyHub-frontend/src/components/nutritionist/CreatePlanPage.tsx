import {
  Box,
  Typography,
  Button,
  TextField,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ScienceIcon from "@mui/icons-material/Science";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../services/api";
import Swal from "sweetalert2";

const DAYS = [
  { key: "monday",    label: "Lunes" },
  { key: "tuesday",   label: "Martes" },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday",  label: "Jueves" },
  { key: "friday",    label: "Viernes" },
  { key: "saturday",  label: "Sábado" },
  { key: "sunday",    label: "Domingo" },
];

const MEAL_PRESETS = ["Desayuno", "Colación AM", "Almuerzo", "Colación PM", "Cena"];
const SUPP_PRESETS = ["Proteína Whey", "Creatina", "Multivitamínico", "BCAA", "Pre-workout", "Omega 3", "Vitamina C"];
const SUPP_COLORS  = [
  { value: "#3B82F6" }, { value: "#22c55e" }, { value: "#F59E0B" },
  { value: "#8B5CF6" }, { value: "#ef4444" }, { value: "#06b6d4" },
];

type MealEntry = { name: string; calories: string; description: string };
type SuppEntry = { name: string; amount: string; instructions: string; color: string };
type DayData   = { meals: MealEntry[]; supplements: SuppEntry[] };
type AllDays   = Record<string, DayData>;

const emptyDay  = (): DayData => ({ meals: [], supplements: [] });
const emptyDays = (): AllDays => Object.fromEntries(DAYS.map((d) => [d.key, emptyDay()]));

export default function CreatePlanPage() {
  const navigate = useNavigate();
  const [step, setStep]           = useState(0);
  const [requests, setRequests]   = useState<any[]>([]);
  const [loadingReqs, setLoadingReqs] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const [profileId, setProfileId] = useState<number | null>(null);

  const [form, setForm] = useState({
    requestId: "",
    goal: "",
    durationDays: "",
    isMonodiet: false,
    notes: "",
  });
  const [days, setDays] = useState<AllDays>(emptyDays());

  useEffect(() => {
    const init = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const profilesRes = await apiFetch("/nutritionistProfiles");
        const profile = profilesRes.data.find((p: any) => Number(p.user_id) === Number(user.id));
        if (!profile) return;
        setProfileId(profile.id);
        setLoadingReqs(true);
        const res = await apiFetch(`/dietRequests/nutritionist/${profile.id}`);
        setRequests((res.data ?? []).filter((r: any) => r.status === "in_progress"));
      } catch { /* silent */ } finally { setLoadingReqs(false); }
    };
    init();
  }, []);

  /* ── Meals ── */
  const addMeal = (dk: string) =>
    setDays((p) => ({ ...p, [dk]: { ...p[dk], meals: [...p[dk].meals, { name: MEAL_PRESETS[p[dk].meals.length] ?? "Comida", calories: "", description: "" }] } }));

  const removeMeal = (dk: string, i: number) =>
    setDays((p) => ({ ...p, [dk]: { ...p[dk], meals: p[dk].meals.filter((_, idx) => idx !== i) } }));

  const updateMeal = (dk: string, i: number, field: keyof MealEntry, val: string) =>
    setDays((p) => { const m = [...p[dk].meals]; m[i] = { ...m[i], [field]: val }; return { ...p, [dk]: { ...p[dk], meals: m } }; });

  /* ── Supplements ── */
  const addSupp = (dk: string) =>
    setDays((p) => ({ ...p, [dk]: { ...p[dk], supplements: [...p[dk].supplements, { name: SUPP_PRESETS[p[dk].supplements.length] ?? "Suplemento", amount: "", instructions: "", color: "#3B82F6" }] } }));

  const removeSupp = (dk: string, i: number) =>
    setDays((p) => ({ ...p, [dk]: { ...p[dk], supplements: p[dk].supplements.filter((_, idx) => idx !== i) } }));

  const updateSupp = (dk: string, i: number, field: keyof SuppEntry, val: string) =>
    setDays((p) => { const s = [...p[dk].supplements]; s[i] = { ...s[i], [field]: val }; return { ...p, [dk]: { ...p[dk], supplements: s } }; });

  const step1Valid = form.requestId && form.goal && form.durationDays;
  const hasContent = DAYS.some((d) => days[d.key].meals.length > 0 || days[d.key].supplements.length > 0);

  const handleSave = async () => {
    const req = requests.find((r) => String(r.id) === String(form.requestId));
    if (!req || !profileId) return;
    setSaving(true);
    try {
      const planRes = await apiFetch("/dietPlans", {
        method: "POST",
        body: JSON.stringify({
          nutritionist_id: profileId,
          user_id: req.user_id,
          is_monodiet: form.isMonodiet ? 1 : 0,
          status: "active",
          goal: form.goal,
          duration_days: Number(form.durationDays),
          notes: form.notes || "Sin notas",
          diet_request_id: req.id,
        }),
      });
      const planId = planRes.data.id;

      for (const day of DAYS) {
        const { meals, supplements } = days[day.key];
        if (meals.length === 0 && supplements.length === 0) continue;

        const dayRes = await apiFetch("/planDays", {
          method: "POST",
          body: JSON.stringify({ diet_plan_id: planId, day: day.key }),
        });
        const dayId = dayRes.data.id;

        for (let i = 0; i < meals.length; i++) {
          const m = meals[i];
          await apiFetch("/meals", {
            method: "POST",
            body: JSON.stringify({ plan_day_id: dayId, name: m.name, calories: Number(m.calories) || 0, description: m.description || "Sin descripción", order: i + 1 }),
          });
        }
        for (let i = 0; i < supplements.length; i++) {
          const s = supplements[i];
          await apiFetch("/supplements", {
            method: "POST",
            body: JSON.stringify({ plan_day_id: dayId, name: s.name, amount: s.amount || "—", instructions: s.instructions || null, color: s.color, order: i + 1 }),
          });
        }
      }

      await apiFetch(`/dietRequests/${req.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "completed" }),
      });

      await Swal.fire({ icon: "success", title: "Plan creado", text: "El paciente ya puede verlo en la app.", background: "#141d2b", color: "#fff", confirmButtonColor: "#3B82F6", timer: 2000, showConfirmButton: false });
      navigate("/DashboardForExperts/diets");
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear el plan.", background: "#141d2b", color: "#fff", confirmButtonColor: "#3B82F6" });
    } finally { setSaving(false); }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": { bgcolor: "#090f18", color: "#e2e8f0", borderRadius: "10px", fontSize: 14, "& fieldset": { borderColor: "rgba(59,130,246,0.22)" }, "&:hover fieldset": { borderColor: "rgba(59,130,246,0.3)" }, "&.Mui-focused fieldset": { borderColor: "#3B82F6" } },
    "& .MuiInputLabel-root": { color: "#64748b", fontSize: 13 },
    "& .MuiInputLabel-root.Mui-focused": { color: "#3B82F6" },
  };
  const menuProps = { PaperProps: { sx: { background: "#141d2b", border: "1px solid rgba(59,130,246,0.22)", borderRadius: "10px" } } };
  const dk = DAYS[activeDay].key;
  const dayData = days[dk];

  return (
    <Box p={4} sx={{ color: "white", minHeight: "100vh" }}>

      {/* HEADER */}
      <Box mb={5}>
        <Button
          startIcon={<ArrowBackIcon fontSize="small" />}
          onClick={() => navigate("/DashboardForExperts/diets")}
          sx={{ color: "#64748b", textTransform: "none", fontSize: 13, mb: 2, px: 0, "&:hover": { color: "#fff", background: "none" } }}
        >
          Volver a planes
        </Button>
        <Typography fontSize={13} color="#555" mb={0.5} letterSpacing="0.05em" textTransform="uppercase">
          Nuevo plan
        </Typography>
        <Typography fontSize={36} fontWeight={700} letterSpacing="-0.5px"
          sx={{ background: "linear-gradient(135deg, #fff 40%, #555)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          Crear plan de dieta
        </Typography>
      </Box>

      {/* STEPPER */}
      <Box display="flex" alignItems="center" gap={2} mb={5}>
        {[{ label: "Información general" }, { label: "Comidas y suplementos" }].map((s, i) => (
          <Box key={i} display="flex" alignItems="center" gap={2}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box sx={{
                width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                bgcolor: i < step ? "#22c55e" : i === step ? "#3B82F6" : "rgba(59,130,246,0.1)",
                border: `2px solid ${i < step ? "#22c55e" : i === step ? "#3B82F6" : "rgba(59,130,246,0.2)"}`,
                transition: "all 0.3s",
              }}>
                {i < step
                  ? <CheckCircleIcon sx={{ fontSize: 16, color: "white" }} />
                  : <Typography fontSize={12} fontWeight={700} color={i === step ? "white" : "#555"}>{i + 1}</Typography>
                }
              </Box>
              <Typography fontSize={13} fontWeight={i === step ? 600 : 400} color={i === step ? "white" : "#555"}>
                {s.label}
              </Typography>
            </Box>
            {i < 1 && <Box sx={{ width: 40, height: 1, bgcolor: step > i ? "#3B82F6" : "rgba(59,130,246,0.2)" }} />}
          </Box>
        ))}
      </Box>

      {/* ── PASO 1: Información general ── */}
      {step === 0 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Box sx={{ p: 4, borderRadius: "20px", background: "#141d2b", border: "1px solid rgba(59,130,246,0.25)" }}>
              <Typography fontSize={14} color="#888" fontWeight={600} mb={3} textTransform="uppercase" letterSpacing="0.06em">
                Datos del plan
              </Typography>

              <Box display="flex" flexDirection="column" gap={2.5}>
                <FormControl fullWidth sx={fieldSx}>
                  <InputLabel>Paciente (solicitud aceptada)</InputLabel>
                  <Select value={form.requestId} onChange={(e) => setForm({ ...form, requestId: e.target.value })}
                    label="Paciente (solicitud aceptada)" disabled={loadingReqs} MenuProps={menuProps}>
                    {loadingReqs && <MenuItem disabled><CircularProgress size={14} sx={{ mr: 1 }} /> Cargando...</MenuItem>}
                    {!loadingReqs && requests.length === 0 && <MenuItem disabled value="">Sin solicitudes aceptadas</MenuItem>}
                    {requests.map((r) => (
                      <MenuItem key={r.id} value={String(r.id)} sx={{ color: "#ccc", "&:hover": { bgcolor: "rgba(59,130,246,0.08)" } }}>
                        {r.user?.name ?? `Usuario #${r.user_id}`} — {r.month}/{r.year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box display="flex" gap={2}>
                  <TextField label="Objetivo" placeholder="Ej: Bajar de peso, Volumen muscular..."
                    value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} fullWidth sx={fieldSx} />
                  <TextField label="Duración (días)" type="number"
                    value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                    sx={{ ...fieldSx, width: 170, flexShrink: 0 }} />
                </Box>

                <TextField label="Notas para el paciente"
                  placeholder="Indicaciones generales, restricciones, recomendaciones..."
                  value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  fullWidth multiline rows={4} sx={fieldSx} />

                <Box display="flex" alignItems="center" justifyContent="space-between" px={0.5}>
                  <Box>
                    <Typography fontSize={14} color="#ccc" fontWeight={500}>Monodieta</Typography>
                    <Typography fontSize={12} color="#555" mt={0.3}>El mismo menú se repite todos los días</Typography>
                  </Box>
                  <Switch checked={form.isMonodiet} onChange={(e) => setForm({ ...form, isMonodiet: e.target.checked })}
                    sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#3B82F6" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#3B82F6" }, "& .MuiSwitch-track": { bgcolor: "#222" } }}
                  />
                </Box>
              </Box>

              <Box display="flex" justifyContent="flex-end" mt={4}>
                <Button variant="contained" onClick={() => setStep(1)} disabled={!step1Valid}
                  sx={{ textTransform: "none", fontWeight: 600, fontSize: 13, px: 4, py: 1.2, borderRadius: "10px", background: "#3B82F6", "&:hover": { background: "#2563eb" }, "&:disabled": { opacity: 0.4 } }}>
                  Continuar →
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Tip panel */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Box sx={{ p: 3, borderRadius: "16px", background: "#141d2b", border: "1px solid rgba(59,130,246,0.25)" }}>
              <Typography fontSize={12} color="#555" letterSpacing="0.06em" textTransform="uppercase" mb={2}>
                Información
              </Typography>
              <Divider sx={{ borderColor: "rgba(59,130,246,0.22)", mb: 2 }} />
              <Box display="flex" flexDirection="column" gap={1.5}>
                {[
                  "Selecciona al paciente cuya solicitud ya aceptaste.",
                  "El objetivo se mostrará al paciente en la app.",
                  "Activa 'Monodieta' si el mismo menú aplica todos los días.",
                  "En el siguiente paso podrás definir comidas y suplementos por día.",
                ].map((tip, i) => (
                  <Box key={i} display="flex" gap={1.5} alignItems="flex-start">
                    <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "#3B82F644", mt: "6px", flexShrink: 0 }} />
                    <Typography fontSize={12} color="#555" lineHeight={1.6}>{tip}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* ── PASO 2: Comidas y suplementos ── */}
      {step === 1 && (
        <Box>
          {/* Day tabs */}
          <Box sx={{ mb: 3, borderBottom: "1px solid rgba(59,130,246,0.15)" }}>
            <Tabs value={activeDay} onChange={(_, v) => setActiveDay(v)} variant="scrollable" scrollButtons="auto"
              sx={{ "& .MuiTab-root": { color: "#555", textTransform: "none", fontSize: 14, minWidth: 0, px: 2.5, py: 1.5 }, "& .MuiTab-root.Mui-selected": { color: "#3B82F6" }, "& .MuiTabs-indicator": { bgcolor: "#3B82F6" } }}>
              {DAYS.map((d) => {
                const filled = days[d.key].meals.length > 0 || days[d.key].supplements.length > 0;
                return (
                  <Tab key={d.key} label={
                    <Box display="flex" alignItems="center" gap={0.8}>
                      {d.label}
                      {filled && <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#3B82F6" }} />}
                    </Box>
                  } />
                );
              })}
            </Tabs>
          </Box>

          <Grid container spacing={3}>
            {/* COMIDAS */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ p: 3.5, borderRadius: "20px", background: "#141d2b", border: "1px solid rgba(59,130,246,0.25)" }}>
                <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                  <Box sx={{ width: 32, height: 32, borderRadius: "9px", bgcolor: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <RestaurantIcon sx={{ color: "#3B82F6", fontSize: 17 }} />
                  </Box>
                  <Typography fontSize={14} fontWeight={700} color="#ddd">Comidas</Typography>
                  <Box sx={{ ml: "auto", px: 1.2, py: 0.2, borderRadius: "6px", bgcolor: "rgba(59,130,246,0.08)", color: "#3B82F6", fontSize: 11, fontWeight: 700 }}>
                    {dayData.meals.length}
                  </Box>
                </Box>

                <Box display="flex" flexDirection="column" gap={2}>
                  {dayData.meals.length === 0 ? (
                    <Box sx={{ py: 5, textAlign: "center", border: "1px dashed rgba(59,130,246,0.15)", borderRadius: "12px" }}>
                      <RestaurantIcon sx={{ color: "#1e293b", fontSize: 32, mb: 1 }} />
                      <Typography fontSize={13} color="#334155">Sin comidas para este día</Typography>
                    </Box>
                  ) : (
                    dayData.meals.map((meal, idx) => (
                      <Box key={idx} sx={{ p: 2.5, borderRadius: "14px", background: "#0e1623", border: "1px solid rgba(59,130,246,0.12)" }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                          <Typography fontSize={12} color="#475569" fontWeight={600}>Comida {idx + 1}</Typography>
                          <IconButton size="small" onClick={() => removeMeal(dk, idx)} sx={{ color: "#ef4444", "&:hover": { bgcolor: "rgba(239,68,68,0.08)" } }}>
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                        <Box display="flex" gap={1.5} mb={1.5}>
                          <FormControl sx={{ ...fieldSx, flex: 1 }}>
                            <InputLabel>Tipo</InputLabel>
                            <Select value={meal.name} onChange={(e) => updateMeal(dk, idx, "name", e.target.value)} label="Tipo" MenuProps={menuProps}>
                              {MEAL_PRESETS.map((p) => <MenuItem key={p} value={p} sx={{ color: "#ccc", "&:hover": { bgcolor: "rgba(59,130,246,0.08)" } }}>{p}</MenuItem>)}
                            </Select>
                          </FormControl>
                          <TextField label="kcal" type="number" value={meal.calories}
                            onChange={(e) => updateMeal(dk, idx, "calories", e.target.value)}
                            sx={{ ...fieldSx, width: 100, flexShrink: 0 }} />
                        </Box>
                        <TextField label="Descripción" placeholder="Ej: 2 huevos, 1 taza de avena, fruta"
                          value={meal.description} onChange={(e) => updateMeal(dk, idx, "description", e.target.value)}
                          fullWidth multiline rows={2} sx={fieldSx} />
                      </Box>
                    ))
                  )}
                  <Button startIcon={<AddIcon />} onClick={() => addMeal(dk)}
                    sx={{ textTransform: "none", fontSize: 13, color: "#3B82F6", px: 2, py: 1, borderRadius: "10px", bgcolor: "rgba(59,130,246,0.07)", "&:hover": { bgcolor: "rgba(59,130,246,0.12)" } }}>
                    Agregar comida
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* SUPLEMENTOS */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ p: 3.5, borderRadius: "20px", background: "#141d2b", border: "1px solid rgba(139,92,246,0.25)" }}>
                <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                  <Box sx={{ width: 32, height: 32, borderRadius: "9px", bgcolor: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ScienceIcon sx={{ color: "#8B5CF6", fontSize: 17 }} />
                  </Box>
                  <Typography fontSize={14} fontWeight={700} color="#ddd">Suplementos</Typography>
                  <Box sx={{ ml: "auto", px: 1.2, py: 0.2, borderRadius: "6px", bgcolor: "rgba(139,92,246,0.08)", color: "#8B5CF6", fontSize: 11, fontWeight: 700 }}>
                    {dayData.supplements.length}
                  </Box>
                </Box>

                <Box display="flex" flexDirection="column" gap={2}>
                  {dayData.supplements.length === 0 ? (
                    <Box sx={{ py: 5, textAlign: "center", border: "1px dashed rgba(139,92,246,0.15)", borderRadius: "12px" }}>
                      <ScienceIcon sx={{ color: "#1e293b", fontSize: 32, mb: 1 }} />
                      <Typography fontSize={13} color="#334155">Sin suplementos para este día</Typography>
                    </Box>
                  ) : (
                    dayData.supplements.map((s, idx) => (
                      <Box key={idx} sx={{ p: 2.5, borderRadius: "14px", background: "#0e1623", border: "1px solid rgba(139,92,246,0.12)" }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: s.color }} />
                            <Typography fontSize={12} color="#475569" fontWeight={600}>Suplemento {idx + 1}</Typography>
                          </Box>
                          <IconButton size="small" onClick={() => removeSupp(dk, idx)} sx={{ color: "#ef4444", "&:hover": { bgcolor: "rgba(239,68,68,0.08)" } }}>
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                        <Box display="flex" gap={1.5} mb={1.5}>
                          <FormControl sx={{ ...fieldSx, flex: 1 }}>
                            <InputLabel>Suplemento</InputLabel>
                            <Select value={s.name} onChange={(e) => updateSupp(dk, idx, "name", e.target.value)} label="Suplemento" MenuProps={menuProps}>
                              {SUPP_PRESETS.map((p) => <MenuItem key={p} value={p} sx={{ color: "#ccc", "&:hover": { bgcolor: "rgba(139,92,246,0.08)" } }}>{p}</MenuItem>)}
                            </Select>
                          </FormControl>
                          <TextField label="Cantidad" placeholder="30g, 2 cáps."
                            value={s.amount} onChange={(e) => updateSupp(dk, idx, "amount", e.target.value)}
                            sx={{ ...fieldSx, width: 110, flexShrink: 0 }} />
                        </Box>
                        <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                          <Typography fontSize={11} color="#555">Color:</Typography>
                          {SUPP_COLORS.map((c) => (
                            <Box key={c.value} onClick={() => updateSupp(dk, idx, "color", c.value)}
                              sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: c.value, cursor: "pointer", border: s.color === c.value ? "2.5px solid white" : "2.5px solid transparent", transition: "border 0.15s" }}
                            />
                          ))}
                        </Box>
                        <TextField label="Instrucciones" placeholder="Ej: Tomar después del entrenamiento"
                          value={s.instructions} onChange={(e) => updateSupp(dk, idx, "instructions", e.target.value)}
                          fullWidth sx={fieldSx} />
                      </Box>
                    ))
                  )}
                  <Button startIcon={<AddIcon />} onClick={() => addSupp(dk)}
                    sx={{ textTransform: "none", fontSize: 13, color: "#8B5CF6", px: 2, py: 1, borderRadius: "10px", bgcolor: "rgba(139,92,246,0.07)", "&:hover": { bgcolor: "rgba(139,92,246,0.12)" } }}>
                    Agregar suplemento
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Footer actions */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
            <Button startIcon={<ArrowBackIcon fontSize="small" />} onClick={() => setStep(0)}
              sx={{ color: "#64748b", textTransform: "none", fontSize: 13, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", px: 2.5, py: 1 }}>
              Anterior
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={saving || !hasContent}
              startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
              sx={{ textTransform: "none", fontWeight: 600, fontSize: 13, px: 4, py: 1.2, borderRadius: "10px", background: "#3B82F6", boxShadow: "0 0 20px rgba(59,130,246,0.25)", "&:hover": { background: "#2563eb" }, "&:disabled": { opacity: 0.4 } }}>
              {saving ? "Guardando..." : "Guardar plan"}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
