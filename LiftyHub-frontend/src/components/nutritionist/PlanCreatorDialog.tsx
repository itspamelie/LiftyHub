import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
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

const MEAL_PRESETS = ["Desayuno", "Colación AM", "Comida", "Colación PM", "Cena"];

type MealEntry = { name: string; calories: string; description: string };
type DayMeals = Record<string, MealEntry[]>;

const emptyDayMeals = (): DayMeals =>
  Object.fromEntries(DAYS.map((d) => [d.key, []]));

interface Props {
  open: boolean;
  onClose: () => void;
  nutritionistProfileId: number;
  onCreated: () => void;
}

export default function PlanCreatorDialog({ open, onClose, nutritionistProfileId, onCreated }: Props) {
  const [step, setStep] = useState(0);
  const [requests, setRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeDay, setActiveDay] = useState(0);

  const [form, setForm] = useState({
    requestId: "",
    goal: "",
    durationDays: "",
    isMonodiet: false,
    notes: "",
  });
  const [dayMeals, setDayMeals] = useState<DayMeals>(emptyDayMeals());

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setActiveDay(0);
    setForm({ requestId: "", goal: "", durationDays: "", isMonodiet: false, notes: "" });
    setDayMeals(emptyDayMeals());
    loadRequests();
  }, [open]);

  const loadRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await apiFetch(`/dietRequests/nutritionist/${nutritionistProfileId}`);
      const inProgress = (res.data ?? []).filter((r: any) => r.status === "in_progress");
      setRequests(inProgress);
    } catch {
      // silent
    } finally {
      setLoadingRequests(false);
    }
  };

  const addMeal = (dayKey: string) => {
    setDayMeals((prev) => ({
      ...prev,
      [dayKey]: [
        ...prev[dayKey],
        { name: MEAL_PRESETS[prev[dayKey].length] ?? "Comida", calories: "", description: "" },
      ],
    }));
  };

  const removeMeal = (dayKey: string, idx: number) => {
    setDayMeals((prev) => ({
      ...prev,
      [dayKey]: prev[dayKey].filter((_, i) => i !== idx),
    }));
  };

  const updateMeal = (dayKey: string, idx: number, field: keyof MealEntry, value: string) => {
    setDayMeals((prev) => {
      const updated = [...prev[dayKey]];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, [dayKey]: updated };
    });
  };

  const step1Valid = form.requestId && form.goal && form.durationDays;

  const handleSave = async () => {
    const selectedRequest = requests.find((r) => String(r.id) === String(form.requestId));
    if (!selectedRequest) return;

    setSaving(true);
    try {
      // 1. Create plan
      const planRes = await apiFetch("/dietPlans", {
        method: "POST",
        body: JSON.stringify({
          nutritionist_id: nutritionistProfileId,
          user_id: selectedRequest.user_id,
          is_monodiet: form.isMonodiet ? 1 : 0,
          status: "active",
          goal: form.goal,
          duration_days: Number(form.durationDays),
          notes: form.notes || "Sin notas",
          diet_request_id: selectedRequest.id,
        }),
      });

      const planId = planRes.data.id;

      // 2. Create days + meals
      for (const day of DAYS) {
        const meals = dayMeals[day.key];
        if (meals.length === 0) continue;

        const dayRes = await apiFetch("/planDays", {
          method: "POST",
          body: JSON.stringify({ diet_plan_id: planId, day: day.key }),
        });
        const dayId = dayRes.data.id;

        for (let i = 0; i < meals.length; i++) {
          const m = meals[i];
          await apiFetch("/meals", {
            method: "POST",
            body: JSON.stringify({
              plan_day_id: dayId,
              name: m.name,
              calories: Number(m.calories) || 0,
              description: m.description || "Sin descripción",
              order: i + 1,
            }),
          });
        }
      }

      // 3. Mark request as completed
      await apiFetch(`/dietRequests/${selectedRequest.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "completed" }),
      });

      Swal.fire({
        icon: "success",
        title: "Plan creado",
        text: "El plan fue creado. El paciente ya puede verlo en la app.",
        background: "#141d2b",
        color: "#fff",
        confirmButtonColor: "#3B82F6",
        timer: 2500,
        showConfirmButton: false,
      });
      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el plan. Intenta de nuevo.",
        background: "#141d2b",
        color: "#fff",
        confirmButtonColor: "#3B82F6",
      });
    } finally {
      setSaving(false);
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#090f18",
      color: "#e2e8f0",
      borderRadius: "10px",
      fontSize: 14,
      "& fieldset": { borderColor: "rgba(59,130,246,0.22)" },
      "&:hover fieldset": { borderColor: "rgba(59,130,246,0.3)" },
      "&.Mui-focused fieldset": { borderColor: "#3B82F6" },
    },
    "& .MuiInputLabel-root": { color: "#64748b", fontSize: 13 },
    "& .MuiInputLabel-root.Mui-focused": { color: "#3B82F6" },
  };

  const currentDayKey = DAYS[activeDay].key;
  const currentMeals = dayMeals[currentDayKey];

  return (
    <Dialog
      open={open}
      onClose={() => !saving && onClose()}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: "#141d2b",
          borderRadius: "20px",
          border: "1px solid rgba(59,130,246,0.25)",
          color: "white",
        },
      }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        <Typography fontSize={18} fontWeight={700} color="#fff">
          {step === 0 ? "Nuevo plan de dieta" : "Comidas por día"}
        </Typography>
        <Typography fontSize={12} color="#64748b" mt={0.5}>
          Paso {step + 1} de 2 — {step === 0 ? "Información general" : "Agrega las comidas de cada día"}
        </Typography>
        <Box display="flex" gap={1} mt={1.5}>
          {[0, 1].map((i) => (
            <Box
              key={i}
              sx={{
                height: 3,
                flex: 1,
                borderRadius: 2,
                bgcolor: i <= step ? "#3B82F6" : "rgba(59,130,246,0.15)",
                transition: "background 0.3s",
              }}
            />
          ))}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: "20px !important" }}>
        {step === 0 ? (
          <Box display="flex" flexDirection="column" gap={2.5}>
            <FormControl fullWidth sx={fieldSx}>
              <InputLabel>Paciente (solicitud aceptada)</InputLabel>
              <Select
                value={form.requestId}
                onChange={(e) => setForm({ ...form, requestId: e.target.value })}
                label="Paciente (solicitud aceptada)"
                disabled={loadingRequests}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: "#141d2b",
                      border: "1px solid rgba(59,130,246,0.22)",
                      borderRadius: "10px",
                    },
                  },
                }}
              >
                {loadingRequests && (
                  <MenuItem disabled>
                    <CircularProgress size={14} sx={{ mr: 1 }} /> Cargando...
                  </MenuItem>
                )}
                {!loadingRequests && requests.length === 0 && (
                  <MenuItem disabled value="">
                    Sin solicitudes en progreso
                  </MenuItem>
                )}
                {requests.map((r) => (
                  <MenuItem
                    key={r.id}
                    value={String(r.id)}
                    sx={{ color: "#ccc", "&:hover": { bgcolor: "rgba(59,130,246,0.08)" } }}
                  >
                    {r.user?.name ?? `Usuario #${r.user_id}`} — {r.month}/{r.year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box display="flex" gap={2}>
              <TextField
                label="Objetivo"
                placeholder="Ej: Bajar de peso, Volumen muscular..."
                value={form.goal}
                onChange={(e) => setForm({ ...form, goal: e.target.value })}
                fullWidth
                sx={fieldSx}
              />
              <TextField
                label="Duración (días)"
                type="number"
                value={form.durationDays}
                onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                sx={{ ...fieldSx, width: 170, flexShrink: 0 }}
              />
            </Box>

            <TextField
              label="Notas para el paciente"
              placeholder="Indicaciones generales, restricciones, recomendaciones..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              fullWidth
              multiline
              rows={3}
              sx={fieldSx}
            />

            <Box display="flex" alignItems="center" justifyContent="space-between" px={0.5}>
              <Box>
                <Typography fontSize={14} color="#ccc" fontWeight={500}>
                  Monodieta
                </Typography>
                <Typography fontSize={12} color="#555" mt={0.3}>
                  El mismo menú se repite todos los días
                </Typography>
              </Box>
              <Switch
                checked={form.isMonodiet}
                onChange={(e) => setForm({ ...form, isMonodiet: e.target.checked })}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#3B82F6" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#3B82F6" },
                  "& .MuiSwitch-track": { bgcolor: "#222" },
                }}
              />
            </Box>
          </Box>
        ) : (
          <Box>
            <Tabs
              value={activeDay}
              onChange={(_, v) => setActiveDay(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                mb: 2.5,
                "& .MuiTab-root": {
                  color: "#555",
                  textTransform: "none",
                  fontSize: 13,
                  minWidth: 0,
                  px: 1.5,
                },
                "& .MuiTab-root.Mui-selected": { color: "#3B82F6" },
                "& .MuiTabs-indicator": { bgcolor: "#3B82F6" },
              }}
            >
              {DAYS.map((d) => (
                <Tab
                  key={d.key}
                  label={
                    <Box display="flex" alignItems="center" gap={0.6}>
                      {d.label}
                      {dayMeals[d.key].length > 0 && (
                        <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "#3B82F6" }} />
                      )}
                    </Box>
                  }
                />
              ))}
            </Tabs>

            <Box display="flex" flexDirection="column" gap={2}>
              {currentMeals.length === 0 ? (
                <Box
                  sx={{
                    py: 4,
                    textAlign: "center",
                    border: "1px dashed rgba(59,130,246,0.2)",
                    borderRadius: "12px",
                  }}
                >
                  <Typography fontSize={13} color="#444">
                    Sin comidas para este día
                  </Typography>
                </Box>
              ) : (
                currentMeals.map((meal, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2.5,
                      borderRadius: "12px",
                      background: "#0e1623",
                      border: "1px solid rgba(59,130,246,0.15)",
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                      <Typography fontSize={13} color="#888" fontWeight={600}>
                        Comida {idx + 1}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => removeMeal(currentDayKey, idx)}
                        sx={{ color: "#ef4444", "&:hover": { bgcolor: "rgba(239,68,68,0.08)" } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box display="flex" gap={2} mb={1.5}>
                      <FormControl sx={{ ...fieldSx, width: 200, flexShrink: 0 }}>
                        <InputLabel>Nombre</InputLabel>
                        <Select
                          value={meal.name}
                          onChange={(e) => updateMeal(currentDayKey, idx, "name", e.target.value)}
                          label="Nombre"
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                background: "#141d2b",
                                border: "1px solid rgba(59,130,246,0.22)",
                                borderRadius: "10px",
                              },
                            },
                          }}
                        >
                          {MEAL_PRESETS.map((p) => (
                            <MenuItem
                              key={p}
                              value={p}
                              sx={{ color: "#ccc", "&:hover": { bgcolor: "rgba(59,130,246,0.08)" } }}
                            >
                              {p}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        label="Calorías"
                        type="number"
                        value={meal.calories}
                        onChange={(e) => updateMeal(currentDayKey, idx, "calories", e.target.value)}
                        sx={{ ...fieldSx, width: 130, flexShrink: 0 }}
                      />
                    </Box>
                    <TextField
                      label="Descripción"
                      placeholder="Ej: 2 huevos revueltos, 1 taza de avena, 1 manzana"
                      value={meal.description}
                      onChange={(e) => updateMeal(currentDayKey, idx, "description", e.target.value)}
                      fullWidth
                      multiline
                      rows={2}
                      sx={fieldSx}
                    />
                  </Box>
                ))
              )}

              <Button
                startIcon={<AddIcon />}
                onClick={() => addMeal(currentDayKey)}
                sx={{
                  alignSelf: "flex-start",
                  textTransform: "none",
                  fontSize: 13,
                  color: "#3B82F6",
                  px: 2,
                  py: 1,
                  borderRadius: "10px",
                  bgcolor: "rgba(59,130,246,0.08)",
                  "&:hover": { bgcolor: "rgba(59,130,246,0.14)" },
                }}
              >
                Agregar comida
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        {step === 0 ? (
          <>
            <Button
              onClick={onClose}
              sx={{
                color: "#64748b",
                textTransform: "none",
                fontSize: 13,
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                px: 2.5,
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => setStep(1)}
              disabled={!step1Valid}
              variant="contained"
              sx={{
                textTransform: "none",
                fontSize: 13,
                fontWeight: 600,
                background: "#3B82F6",
                borderRadius: "10px",
                px: 3,
                "&:hover": { background: "#2563eb" },
                "&:disabled": { opacity: 0.4 },
              }}
            >
              Siguiente →
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => setStep(0)}
              disabled={saving}
              sx={{
                color: "#64748b",
                textTransform: "none",
                fontSize: 13,
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                px: 2.5,
              }}
            >
              ← Anterior
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              variant="contained"
              startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
              sx={{
                textTransform: "none",
                fontSize: 13,
                fontWeight: 600,
                background: "#3B82F6",
                borderRadius: "10px",
                px: 3,
                "&:hover": { background: "#2563eb" },
                "&:disabled": { opacity: 0.4 },
              }}
            >
              {saving ? "Guardando..." : "Guardar plan"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
