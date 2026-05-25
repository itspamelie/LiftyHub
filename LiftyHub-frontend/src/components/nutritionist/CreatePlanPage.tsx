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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ScienceIcon from "@mui/icons-material/Science";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../services/api";
import Swal from "sweetalert2";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

// ─── Food catalog ───────────────────────────────────────────────────────────
// countable: true  → kcal es por unidad, unit = nombre de la unidad
// countable: false → kcal es por 100g,   unit = "g"
const FOOD_CATALOG = [
  // Proteínas — pesables
  { id: "pollo",     name: "Pollo (pechuga)",  emoji: "🍗", kcal: 165, cat: "Proteínas", countable: false, unit: "g"      },
  { id: "carne",     name: "Carne de res",      emoji: "🥩", kcal: 250, cat: "Proteínas", countable: false, unit: "g"      },
  { id: "atun",      name: "Atún",              emoji: "🐟", kcal: 116, cat: "Proteínas", countable: false, unit: "g"      },
  { id: "salmon",    name: "Salmón",            emoji: "🐠", kcal: 208, cat: "Proteínas", countable: false, unit: "g"      },
  { id: "pavo",      name: "Pavo",              emoji: "🦃", kcal: 135, cat: "Proteínas", countable: false, unit: "g"      },
  { id: "camarones", name: "Camarones",         emoji: "🦐", kcal: 99,  cat: "Proteínas", countable: false, unit: "g"      },
  // Proteínas — contables
  { id: "huevo",     name: "Huevo",             emoji: "🥚", kcal: 78,  cat: "Proteínas", countable: true,  unit: "pza"    },
  { id: "claras",    name: "Claras de huevo",   emoji: "🍳", kcal: 17,  cat: "Proteínas", countable: true,  unit: "clara"  },
  // Carbohidratos — pesables
  { id: "arroz",     name: "Arroz blanco",      emoji: "🍚", kcal: 130, cat: "Carbohidratos", countable: false, unit: "g"  },
  { id: "avena",     name: "Avena",             emoji: "🥣", kcal: 389, cat: "Carbohidratos", countable: false, unit: "g"  },
  { id: "pasta",     name: "Pasta",             emoji: "🍝", kcal: 131, cat: "Carbohidratos", countable: false, unit: "g"  },
  { id: "quinoa",    name: "Quinoa",            emoji: "🌾", kcal: 120, cat: "Carbohidratos", countable: false, unit: "g"  },
  // Carbohidratos — contables
  { id: "pan",       name: "Pan integral",      emoji: "🍞", kcal: 69,  cat: "Carbohidratos", countable: true,  unit: "rebanada" },
  { id: "tortilla",  name: "Tortilla de maíz",  emoji: "🫓", kcal: 57,  cat: "Carbohidratos", countable: true,  unit: "pza"  },
  { id: "papa",      name: "Papa",              emoji: "🥔", kcal: 160, cat: "Carbohidratos", countable: true,  unit: "pza"  },
  { id: "camote",    name: "Camote",            emoji: "🍠", kcal: 130, cat: "Carbohidratos", countable: true,  unit: "pza"  },
  // Verduras — pesables
  { id: "brocoli",   name: "Brócoli",           emoji: "🥦", kcal: 34,  cat: "Verduras", countable: false, unit: "g"      },
  { id: "espinaca",  name: "Espinaca",          emoji: "🥬", kcal: 23,  cat: "Verduras", countable: false, unit: "g"      },
  { id: "zanahoria", name: "Zanahoria",         emoji: "🥕", kcal: 41,  cat: "Verduras", countable: false, unit: "g"      },
  { id: "ejotes",    name: "Ejotes",            emoji: "🫘", kcal: 31,  cat: "Verduras", countable: false, unit: "g"      },
  // Verduras — contables
  { id: "tomate",    name: "Tomate",            emoji: "🍅", kcal: 22,  cat: "Verduras", countable: true,  unit: "pza"    },
  { id: "pepino",    name: "Pepino",            emoji: "🥒", kcal: 24,  cat: "Verduras", countable: true,  unit: "pza"    },
  { id: "pimiento",  name: "Pimiento",          emoji: "🫑", kcal: 37,  cat: "Verduras", countable: true,  unit: "pza"    },
  // Frutas — contables
  { id: "platano",   name: "Plátano",           emoji: "🍌", kcal: 105, cat: "Frutas",   countable: true,  unit: "pza"    },
  { id: "manzana",   name: "Manzana",           emoji: "🍎", kcal: 95,  cat: "Frutas",   countable: true,  unit: "pza"    },
  { id: "naranja",   name: "Naranja",           emoji: "🍊", kcal: 62,  cat: "Frutas",   countable: true,  unit: "pza"    },
  { id: "fresa",     name: "Fresa",             emoji: "🍓", kcal: 4,   cat: "Frutas",   countable: true,  unit: "pza"    },
  { id: "mango",     name: "Mango",             emoji: "🥭", kcal: 135, cat: "Frutas",   countable: true,  unit: "pza"    },
  { id: "aguacate",  name: "Aguacate",          emoji: "🥑", kcal: 240, cat: "Frutas",   countable: true,  unit: "pza"    },
  // Frutas — pesables
  { id: "sandia",    name: "Sandía",            emoji: "🍉", kcal: 30,  cat: "Frutas",   countable: false, unit: "g"      },
  // Grasas — pesables
  { id: "almendras", name: "Almendras",         emoji: "🌰", kcal: 579, cat: "Grasas",   countable: false, unit: "g"      },
  { id: "nueces",    name: "Nueces",            emoji: "🥜", kcal: 654, cat: "Grasas",   countable: false, unit: "g"      },
  { id: "aceite",    name: "Aceite de oliva",   emoji: "🫒", kcal: 884, cat: "Grasas",   countable: false, unit: "g"      },
  { id: "cacahuate", name: "Mant. cacahuate",   emoji: "🥜", kcal: 588, cat: "Grasas",   countable: false, unit: "g"      },
];

type FoodItem = typeof FOOD_CATALOG[number];

const FOOD_CATEGORIES = ["Proteínas", "Carbohidratos", "Verduras", "Frutas", "Grasas"];
const CAT_COLOR: Record<string, string> = {
  "Proteínas":    "#ef4444",
  "Carbohidratos":"#F59E0B",
  "Verduras":     "#22c55e",
  "Frutas":       "#f97316",
  "Grasas":       "#8B5CF6",
};

const MEAL_SLOTS   = ["Desayuno", "Colación AM", "Almuerzo", "Colación PM", "Cena"];
const SUPP_PRESETS = ["Proteína Whey", "Creatina", "Multivitamínico", "BCAA", "Pre-workout", "Omega 3", "Vitamina C"];
const SUPP_COLORS  = ["#3B82F6", "#22c55e", "#F59E0B", "#8B5CF6", "#ef4444", "#06b6d4"];

const DAYS = [
  { key: "monday",    label: "Lunes"     },
  { key: "tuesday",   label: "Martes"    },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday",  label: "Jueves"    },
  { key: "friday",    label: "Viernes"   },
  { key: "saturday",  label: "Sábado"    },
  { key: "sunday",    label: "Domingo"   },
];

// ─── Types ───────────────────────────────────────────────────────────────────
type FoodEntry = { uid: string; foodId: string; name: string; emoji: string; quantity: number; calories: number; slot: string; unit: string };
type SuppEntry = { name: string; amount: string; instructions: string; color: string };
type DayData   = { foods: FoodEntry[]; supplements: SuppEntry[] };
type AllDays   = Record<string, DayData>;

const emptyDay  = (): DayData => ({ foods: [], supplements: [] });
const emptyDays = (): AllDays => Object.fromEntries(DAYS.map((d) => [d.key, emptyDay()]));
const uid       = () => `${Date.now()}-${Math.random()}`;

// ─── Draggable food card ──────────────────────────────────────────────────────
function DraggableFoodCard({ food, mini = false }: { food: FoodItem; mini?: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: food.id });
  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.2,
        p: mini ? 1 : 1.3,
        borderRadius: "10px",
        background: "#0e1623",
        border: "1px solid rgba(59,130,246,0.12)",
        cursor: "grab",
        opacity: isDragging ? 0.35 : 1,
        userSelect: "none",
        "&:hover": { border: "1px solid rgba(59,130,246,0.35)", background: "#111e2e" },
        "&:active": { cursor: "grabbing" },
        transition: "all 0.12s",
      }}
    >
      <Typography fontSize={mini ? 18 : 20} lineHeight={1}>{food.emoji}</Typography>
      <Box flex={1} minWidth={0}>
        <Typography fontSize={12} color="#ccc" fontWeight={600} noWrap>{food.name}</Typography>
        <Typography fontSize={10} color="#64748b">{food.kcal} kcal/{food.countable ? food.unit : "100g"}</Typography>
      </Box>
      <DragIndicatorIcon sx={{ fontSize: 14, color: "#334155", flexShrink: 0 }} />
    </Box>
  );
}

// ─── Droppable meal slot ──────────────────────────────────────────────────────
function DroppableSlot({
  slot, foods, onRemove,
}: {
  slot: string;
  foods: FoodEntry[];
  onRemove: (uid: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: slot });
  const total = foods.reduce((s, f) => s + f.calories, 0);

  return (
    <Box
      ref={setNodeRef}
      sx={{
        borderRadius: "12px",
        border: `1px ${isOver ? "solid" : "dashed"} ${isOver ? "#3B82F6" : "rgba(59,130,246,0.18)"}`,
        background: isOver ? "rgba(59,130,246,0.06)" : "transparent",
        p: 1.5,
        transition: "all 0.12s",
      }}
    >
      {/* slot header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography fontSize={11} color="#64748b" fontWeight={700} textTransform="uppercase" letterSpacing="0.07em">
          {slot}
        </Typography>
        {total > 0 && (
          <Typography fontSize={11} color="#22c55e" fontWeight={600}>{total} kcal</Typography>
        )}
      </Box>

      {/* foods in this slot */}
      <Box display="flex" flexDirection="column" gap={0.7}>
        {foods.map((f) => (
          <Box
            key={f.uid}
            display="flex"
            alignItems="center"
            gap={1}
            px={1.2}
            py={0.7}
            sx={{ background: "#141d2b", borderRadius: "8px", border: "1px solid rgba(59,130,246,0.1)" }}
          >
            <Typography fontSize={15}>{f.emoji}</Typography>
            <Typography fontSize={12} color="#ccc" flex={1} noWrap>{f.name}</Typography>
            <Typography fontSize={11} color="#94a3b8">{f.quantity} {f.unit}</Typography>
            <Typography fontSize={11} color="#22c55e" fontWeight={600} sx={{ minWidth: 52, textAlign: "right" }}>
              {f.calories} kcal
            </Typography>
            <IconButton
              size="small"
              onClick={() => onRemove(f.uid)}
              sx={{ color: "#ef4444", p: 0.3, "&:hover": { bgcolor: "rgba(239,68,68,0.08)" } }}
            >
              <DeleteIcon sx={{ fontSize: 13 }} />
            </IconButton>
          </Box>
        ))}

        {/* drop hint */}
        {foods.length === 0 && (
          <Box sx={{ py: 1.5, textAlign: "center" }}>
            <Typography fontSize={11} color={isOver ? "#3B82F6" : "#334155"}>
              {isOver ? "Suelta aquí" : "Arrastra alimentos aquí"}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CreatePlanPage() {
  const navigate    = useNavigate();
  const { planId }  = useParams<{ planId: string }>();
  const isEdit      = !!planId;
  const sensors     = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const [step, setStep]               = useState(0);
  const [requests, setRequests]       = useState<any[]>([]);
  const [loadingReqs, setLoadingReqs] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(isEdit);
  const [saving, setSaving]           = useState(false);
  const [activeDay, setActiveDay]     = useState(0);
  const [profileId, setProfileId]     = useState<number | null>(null);

  const [form, setForm] = useState({ requestId: "", goal: "", durationDays: "", isMonodiet: false, notes: "" });
  const [days, setDays] = useState<AllDays>(emptyDays());

  // DnD state
  const [draggingFood,   setDraggingFood]   = useState<FoodItem | null>(null);
  const [pendingDrop,    setPendingDrop]    = useState<{ food: FoodItem; slot: string } | null>(null);
  const [pendingQty,     setPendingQty]     = useState("100");
  const [pendingByCount, setPendingByCount] = useState(false);

  // Catalog search
  const [search, setSearch] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const profilesRes = await apiFetch("/nutritionistProfiles");
        const profile = profilesRes.data.find((p: any) => Number(p.user_id) === Number(user.id));
        if (!profile) return;
        setProfileId(profile.id);

        // Load requests for the selector
        setLoadingReqs(true);
        const reqRes = await apiFetch(`/dietRequests/nutritionist/${profile.id}`);
        // In edit mode also show completed/in_progress so the locked request is still visible
        setRequests(reqRes.data ?? []);
      } catch { /* silent */ } finally { setLoadingReqs(false); }

      // Load existing plan if editing
      if (planId) {
        try {
          const [plansRes, daysRes] = await Promise.all([
            apiFetch(`/dietPlans`),
            apiFetch(`/planDays/byPlan/${planId}`),
          ]);
          const plan = (plansRes.data ?? []).find((p: any) => String(p.id) === String(planId));
          if (!plan) throw new Error("Plan no encontrado");
          const planDays: any[] = daysRes.data ?? [];

          setForm({
            requestId:    String(plan.diet_request_id ?? ""),
            goal:         plan.goal ?? "",
            durationDays: String(plan.duration_days ?? ""),
            isMonodiet:   !!plan.is_monodiet,
            notes:        plan.notes ?? "",
          });

          // Rebuild days state from planDays
          const rebuilt = emptyDays();
          for (const pd of planDays) {
            const dk = pd.day;
            if (!rebuilt[dk]) continue;
            for (const meal of pd.meals ?? []) {
              // description format: "2 pza — Desayuno"
              const parts    = (meal.description ?? "").split(" — ");
              const slot     = parts[1]?.trim() ?? "";
              const amtParts = (parts[0] ?? "").trim().split(" ");
              const quantity = parseInt(amtParts[0]) || 1;
              const unit     = amtParts[1] ?? "g";
              // extract emoji + name from "🥚 Huevo"
              const nameMatch = (meal.name ?? "").match(/^(\S+)\s+(.+)$/);
              const emoji    = nameMatch?.[1] ?? "";
              const foodName = nameMatch?.[2] ?? meal.name ?? "";
              rebuilt[dk].foods.push({
                uid: uid(), foodId: "", name: foodName, emoji,
                quantity, calories: meal.calories ?? 0, slot, unit,
              });
            }
            for (const s of pd.supplements ?? []) {
              rebuilt[dk].supplements.push({
                name: s.name ?? "", amount: s.amount ?? "",
                instructions: s.instructions ?? "", color: s.color ?? "#3B82F6",
              });
            }
          }
          setDays(rebuilt);
        } catch (err) {
          console.error("Error cargando plan:", err);
        } finally {
          setLoadingPlan(false);
        }
      }
    };
    init();
  }, [planId]);

  // ── DnD handlers ──────────────────────────────────────────────────────────
  const handleDragStart = (e: DragStartEvent) => {
    const food = FOOD_CATALOG.find((f) => f.id === e.active.id) ?? null;
    setDraggingFood(food);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setDraggingFood(null);
    const food = FOOD_CATALOG.find((f) => f.id === e.active.id);
    if (!food || !e.over) return;
    const slot = String(e.over.id);
    if (!MEAL_SLOTS.includes(slot)) return;
    setPendingDrop({ food, slot });
    setPendingByCount(food.countable);
    setPendingQty(food.countable ? "1" : "100");
  };

  const confirmDrop = () => {
    if (!pendingDrop) return;
    const qty  = Math.max(1, parseInt(pendingQty) || 1);
    const food = pendingDrop.food;
    const unit = pendingByCount ? food.unit : "g";
    const kcal = pendingByCount ? food.kcal * qty : Math.round((food.kcal * qty) / 100);
    const dk   = DAYS[activeDay].key;
    setDays((prev) => ({
      ...prev,
      [dk]: {
        ...prev[dk],
        foods: [...prev[dk].foods, {
          uid: uid(), foodId: food.id, name: food.name,
          emoji: food.emoji, quantity: qty, calories: kcal, slot: pendingDrop.slot, unit,
        }],
      },
    }));
    setPendingDrop(null);
  };

  const removeFood = (dayKey: string, foodUid: string) =>
    setDays((p) => ({ ...p, [dayKey]: { ...p[dayKey], foods: p[dayKey].foods.filter((f) => f.uid !== foodUid) } }));

  // ── Supplements ───────────────────────────────────────────────────────────
  const addSupp    = (dk: string) => setDays((p) => ({ ...p, [dk]: { ...p[dk], supplements: [...p[dk].supplements, { name: SUPP_PRESETS[p[dk].supplements.length] ?? "Suplemento", amount: "", instructions: "", color: "#3B82F6" }] } }));
  const removeSupp = (dk: string, i: number) => setDays((p) => ({ ...p, [dk]: { ...p[dk], supplements: p[dk].supplements.filter((_, idx) => idx !== i) } }));
  const updateSupp = (dk: string, i: number, field: keyof SuppEntry, val: string) =>
    setDays((p) => { const s = [...p[dk].supplements]; s[i] = { ...s[i], [field]: val }; return { ...p, [dk]: { ...p[dk], supplements: s } }; });

  // ── Save ──────────────────────────────────────────────────────────────────
  const step1Valid = form.requestId && form.goal && form.durationDays;
  const hasContent = DAYS.some((d) => days[d.key].foods.length > 0 || days[d.key].supplements.length > 0);

  const savePlanDays = async (currentPlanId: number) => {
    for (const day of DAYS) {
      const { foods, supplements } = days[day.key];
      if (foods.length === 0 && supplements.length === 0) continue;
      const dayRes = await apiFetch("/planDays", { method: "POST", body: JSON.stringify({ diet_plan_id: currentPlanId, day: day.key }) });
      const dayId  = dayRes.data.id;
      const sorted = [...foods].sort((a, b) => MEAL_SLOTS.indexOf(a.slot) - MEAL_SLOTS.indexOf(b.slot));
      for (let i = 0; i < sorted.length; i++) {
        const f = sorted[i];
        await apiFetch("/meals", { method: "POST", body: JSON.stringify({ plan_day_id: dayId, name: `${f.emoji} ${f.name}`, calories: f.calories, description: `${f.quantity} ${f.unit} — ${f.slot}`, order: i + 1 }) });
      }
      for (let i = 0; i < supplements.length; i++) {
        const s = supplements[i];
        await apiFetch("/supplements", { method: "POST", body: JSON.stringify({ plan_day_id: dayId, name: s.name, amount: s.amount || "—", instructions: s.instructions || null, color: s.color, order: i + 1 }) });
      }
    }
  };

  const handleSave = async () => {
    const req = requests.find((r) => String(r.id) === String(form.requestId));
    if (!req || !profileId) return;
    setSaving(true);
    try {
      if (isEdit && planId) {
        // ── EDIT MODE ──
        await apiFetch(`/dietPlans/${planId}`, {
          method: "PUT",
          body: JSON.stringify({
            nutritionist_id: profileId, user_id: req.user_id,
            is_monodiet: form.isMonodiet ? 1 : 0, status: "active",
            goal: form.goal, duration_days: Number(form.durationDays),
            notes: form.notes || "Sin notas", diet_request_id: req.id,
          }),
        });
        // Delete existing planDays (cascade removes meals+supplements)
        const existingDays = await apiFetch(`/planDays/byPlan/${planId}`);
        for (const pd of existingDays.data ?? []) {
          await apiFetch(`/planDays/${pd.id}`, { method: "DELETE" });
        }
        await savePlanDays(Number(planId));
        await Swal.fire({ icon: "success", title: "Plan actualizado", text: "Los cambios ya son visibles en la app.", background: "#141d2b", color: "#fff", confirmButtonColor: "#3B82F6", timer: 2000, showConfirmButton: false });
      } else {
        // ── CREATE MODE ──
        const planRes = await apiFetch("/dietPlans", {
          method: "POST",
          body: JSON.stringify({
            nutritionist_id: profileId, user_id: req.user_id,
            is_monodiet: form.isMonodiet ? 1 : 0, status: "active",
            goal: form.goal, duration_days: Number(form.durationDays),
            notes: form.notes || "Sin notas", diet_request_id: req.id,
          }),
        });
        await savePlanDays(planRes.data.id);
        await apiFetch(`/dietRequests/${req.id}/status`, { method: "PATCH", body: JSON.stringify({ status: "completed" }) });
        await Swal.fire({ icon: "success", title: "Plan creado", text: "El paciente ya puede verlo en la app.", background: "#141d2b", color: "#fff", confirmButtonColor: "#3B82F6", timer: 2000, showConfirmButton: false });
      }
      navigate("/DashboardForExperts/diets");
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: isEdit ? "No se pudo actualizar el plan." : "No se pudo crear el plan.", background: "#141d2b", color: "#fff", confirmButtonColor: "#3B82F6" });
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!planId) return;
    const result = await Swal.fire({
      title: "¿Eliminar plan?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#141d2b", color: "#fff",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#334155",
    });
    if (!result.isConfirmed) return;
    try {
      await apiFetch(`/dietPlans/${planId}`, { method: "DELETE" });
      await Swal.fire({ icon: "success", title: "Plan eliminado", background: "#141d2b", color: "#fff", confirmButtonColor: "#3B82F6", timer: 1500, showConfirmButton: false });
      navigate("/DashboardForExperts/diets");
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar el plan.", background: "#141d2b", color: "#fff", confirmButtonColor: "#3B82F6" });
    }
  };

  // ── Shared styles ─────────────────────────────────────────────────────────
  const fieldSx = {
    "& .MuiOutlinedInput-root": { bgcolor: "#090f18", color: "#e2e8f0", borderRadius: "10px", fontSize: 14, "& fieldset": { borderColor: "rgba(59,130,246,0.22)" }, "&:hover fieldset": { borderColor: "rgba(59,130,246,0.3)" }, "&.Mui-focused fieldset": { borderColor: "#3B82F6" }, "&.Mui-disabled": { bgcolor: "#090f18" }, "&.Mui-disabled fieldset": { borderColor: "rgba(59,130,246,0.12)" } },
    "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#e2e8f0", color: "#e2e8f0" },
    "& .MuiSelect-select.Mui-disabled": { WebkitTextFillColor: "#e2e8f0", color: "#e2e8f0" },
    "& .MuiInputLabel-root": { color: "#64748b", fontSize: 13 },
    "& .MuiInputLabel-root.Mui-focused": { color: "#3B82F6" },
    "& .MuiInputLabel-root.Mui-disabled": { color: "#64748b" },
  };
  const menuProps = { PaperProps: { sx: { background: "#141d2b", border: "1px solid rgba(59,130,246,0.22)", borderRadius: "10px" } } };

  const dk      = DAYS[activeDay].key;
  const dayData = days[dk];

  const filteredCatalog = search.trim()
    ? FOOD_CATALOG.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    : FOOD_CATALOG;

  const pendingCalories = pendingDrop
    ? pendingByCount
      ? pendingDrop.food.kcal * (parseInt(pendingQty) || 0)
      : Math.round((pendingDrop.food.kcal * (parseInt(pendingQty) || 0)) / 100)
    : 0;

  const dayTotalKcal = dayData.foods.reduce((s, f) => s + f.calories, 0);

  if (loadingPlan) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress sx={{ color: "#3B82F6" }} size={32} />
      </Box>
    );
  }

  return (
    <Box p={4} sx={{ color: "white", minHeight: "100vh" }}>

      {/* HEADER */}
      <Box mb={5} display="flex" alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Button startIcon={<ArrowBackIcon fontSize="small" />} onClick={() => navigate("/DashboardForExperts/diets")}
            sx={{ color: "#64748b", textTransform: "none", fontSize: 13, mb: 2, px: 0, "&:hover": { color: "#fff", background: "none" } }}>
            Volver a planes
          </Button>
          <Typography fontSize={13} color="#94a3b8" mb={0.5} letterSpacing="0.05em" textTransform="uppercase">
            {isEdit ? "Editar plan" : "Nuevo plan"}
          </Typography>
          <Typography fontSize={36} fontWeight={700} letterSpacing="-0.5px"
            sx={{ background: "linear-gradient(135deg, #fff 40%, #555)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {isEdit ? "Editar plan de dieta" : "Crear plan de dieta"}
          </Typography>
        </Box>
        {isEdit && (
          <Button
            startIcon={<DeleteIcon fontSize="small" />}
            onClick={handleDelete}
            sx={{ color: "#ef4444", textTransform: "none", fontSize: 13, border: "1px solid rgba(239,68,68,0.25)", borderRadius: "10px", px: 2.5, py: 1, mt: 5, "&:hover": { bgcolor: "rgba(239,68,68,0.06)", borderColor: "#ef4444" } }}
          >
            Eliminar plan
          </Button>
        )}
      </Box>

      {/* STEPPER */}
      <Box display="flex" alignItems="center" gap={2} mb={5}>
        {[{ label: "Información general" }, { label: "Comidas y suplementos" }].map((s, i) => (
          <Box key={i} display="flex" alignItems="center" gap={2}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box sx={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: i < step ? "#22c55e" : i === step ? "#3B82F6" : "rgba(59,130,246,0.1)", border: `2px solid ${i < step ? "#22c55e" : i === step ? "#3B82F6" : "rgba(59,130,246,0.2)"}`, transition: "all 0.3s" }}>
                {i < step ? <CheckCircleIcon sx={{ fontSize: 16, color: "white" }} /> : <Typography fontSize={12} fontWeight={700} color={i === step ? "white" : "#94a3b8"}>{i + 1}</Typography>}
              </Box>
              <Typography fontSize={13} fontWeight={i === step ? 600 : 400} color={i === step ? "white" : "#94a3b8"}>{s.label}</Typography>
            </Box>
            {i < 1 && <Box sx={{ width: 40, height: 1, bgcolor: step > i ? "#3B82F6" : "rgba(59,130,246,0.2)" }} />}
          </Box>
        ))}
      </Box>

      {/* ── STEP 1 ── */}
      {step === 0 && (
        <Grid container spacing={3}>
          <Grid xs={12} lg={7}>
            <Box sx={{ p: 4, borderRadius: "20px", background: "#141d2b", border: "1px solid rgba(59,130,246,0.25)" }}>
              <Typography fontSize={14} color="#888" fontWeight={600} mb={3} textTransform="uppercase" letterSpacing="0.06em">Datos del plan</Typography>
              <Box display="flex" flexDirection="column" gap={2.5}>
                <FormControl fullWidth sx={fieldSx}>
                  <InputLabel>Paciente (solicitud aceptada)</InputLabel>
                  <Select value={form.requestId} onChange={(e) => setForm({ ...form, requestId: e.target.value })} label="Paciente (solicitud aceptada)" disabled={loadingReqs || isEdit} MenuProps={menuProps}>
                    {loadingReqs && <MenuItem disabled><CircularProgress size={14} sx={{ mr: 1 }} /> Cargando...</MenuItem>}
                    {!loadingReqs && requests.length === 0 && <MenuItem disabled value="">Sin solicitudes aceptadas</MenuItem>}
                    {/* Active patients */}
                    {!loadingReqs && requests.some((r) => r.status === "in_progress") && (
                      <MenuItem disabled sx={{ opacity: 1, color: "#22c55e", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", py: 0.5 }}>
                        — Pacientes activos —
                      </MenuItem>
                    )}
                    {requests.filter((r) => r.status === "in_progress").map((r) => (
                      <MenuItem key={r.id} value={String(r.id)} sx={{ color: "#e2e8f0", "&:hover": { bgcolor: "rgba(34,197,94,0.08)" } }}>
                        <Box display="flex" alignItems="center" gap={1} width="100%">
                          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#22c55e", flexShrink: 0 }} />
                          <span>{r.user?.name ?? `Usuario #${r.user_id}`}</span>
                          <Box component="span" sx={{ ml: "auto", color: "#64748b", fontSize: 12 }}>{r.month}/{r.year}</Box>
                        </Box>
                      </MenuItem>
                    ))}
                    {/* Historical patients */}
                    {!loadingReqs && requests.some((r) => r.status === "completed") && (
                      <MenuItem disabled sx={{ opacity: 1, color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", py: 0.5, mt: 0.5, borderTop: "1px solid #1e293b" }}>
                        — Historial —
                      </MenuItem>
                    )}
                    {requests.filter((r) => r.status === "completed").map((r) => (
                      <MenuItem key={r.id} value={String(r.id)} sx={{ color: "#94a3b8", "&:hover": { bgcolor: "rgba(59,130,246,0.08)" } }}>
                        <Box display="flex" alignItems="center" gap={1} width="100%">
                          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#475569", flexShrink: 0 }} />
                          <span>{r.user?.name ?? `Usuario #${r.user_id}`}</span>
                          <Box component="span" sx={{ ml: "auto", color: "#475569", fontSize: 12 }}>{r.month}/{r.year}</Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box display="flex" gap={2}>
                  <TextField label="Objetivo" placeholder="Ej: Bajar de peso, Volumen muscular..." value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} fullWidth sx={fieldSx} />
                  <TextField label="Duración (días)" type="number" value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: e.target.value })} sx={{ ...fieldSx, width: 170, flexShrink: 0 }} />
                </Box>
                <TextField label="Notas para el paciente" placeholder="Indicaciones generales, restricciones, recomendaciones..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} fullWidth multiline rows={4} sx={fieldSx} />
                <Box display="flex" alignItems="center" justifyContent="space-between" px={0.5}>
                  <Box>
                    <Typography fontSize={14} color="#ccc" fontWeight={500}>Monodieta</Typography>
                    <Typography fontSize={12} color="#94a3b8" mt={0.3}>El mismo menú se repite todos los días</Typography>
                  </Box>
                  <Switch checked={form.isMonodiet} onChange={(e) => setForm({ ...form, isMonodiet: e.target.checked })}
                    sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#3B82F6" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#3B82F6" }, "& .MuiSwitch-track": { bgcolor: "#222" } }} />
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
          <Grid xs={12} lg={5}>
            <Box sx={{ p: 3, borderRadius: "16px", background: "#141d2b", border: "1px solid rgba(59,130,246,0.25)" }}>
              <Typography fontSize={12} color="#94a3b8" letterSpacing="0.06em" textTransform="uppercase" mb={2}>Información</Typography>
              <Divider sx={{ borderColor: "rgba(59,130,246,0.22)", mb: 2 }} />
              <Box display="flex" flexDirection="column" gap={1.5}>
                {["Selecciona al paciente cuya solicitud ya aceptaste.", "El objetivo se mostrará al paciente en la app.", "Activa 'Monodieta' si el mismo menú aplica todos los días.", "En el siguiente paso arrastra alimentos al horario de cada día."].map((tip, i) => (
                  <Box key={i} display="flex" gap={1.5} alignItems="flex-start">
                    <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "#3B82F644", mt: "6px", flexShrink: 0 }} />
                    <Typography fontSize={12} color="#94a3b8" lineHeight={1.6}>{tip}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* ── STEP 2: Drag & Drop ── */}
      {step === 1 && (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {/* Day tabs */}
          <Box sx={{ mb: 3, borderBottom: "1px solid rgba(59,130,246,0.15)" }}>
            <Tabs value={activeDay} onChange={(_, v) => setActiveDay(v)} variant="scrollable" scrollButtons="auto"
              sx={{ "& .MuiTab-root": { color: "#94a3b8", textTransform: "none", fontSize: 14, minWidth: 0, px: 2.5, py: 1.5 }, "& .MuiTab-root.Mui-selected": { color: "#3B82F6" }, "& .MuiTabs-indicator": { bgcolor: "#3B82F6" } }}>
              {DAYS.map((d) => {
                const filled = days[d.key].foods.length > 0 || days[d.key].supplements.length > 0;
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
            {/* LEFT: Food catalog */}
            <Grid xs={12} lg={4}>
              <Box sx={{ p: 2.5, borderRadius: "20px", background: "#141d2b", border: "1px solid rgba(59,130,246,0.25)", height: "78vh", display: "flex", flexDirection: "column" }}>
                <Typography fontSize={13} color="#94a3b8" fontWeight={600} textTransform="uppercase" letterSpacing="0.06em" mb={2}>
                  Catálogo de alimentos
                </Typography>
                <TextField
                  placeholder="Buscar alimento..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  size="small"
                  fullWidth
                  sx={{ mb: 2, ...fieldSx }}
                  slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#64748b", fontSize: 16 }} /></InputAdornment> } }}
                />
                <Box sx={{ overflowY: "auto", flex: 1, pr: 0.5 }}>
                  {search.trim() ? (
                    <Box display="flex" flexDirection="column" gap={1}>
                      {filteredCatalog.length === 0
                        ? <Typography fontSize={12} color="#64748b" textAlign="center" py={3}>Sin resultados</Typography>
                        : filteredCatalog.map((f) => <DraggableFoodCard key={f.id} food={f} />)
                      }
                    </Box>
                  ) : (
                    FOOD_CATEGORIES.map((cat) => {
                      const foods = FOOD_CATALOG.filter((f) => f.cat === cat);
                      return (
                        <Box key={cat} mb={2.5}>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: CAT_COLOR[cat], flexShrink: 0 }} />
                            <Typography fontSize={11} color={CAT_COLOR[cat]} fontWeight={700} textTransform="uppercase" letterSpacing="0.06em">{cat}</Typography>
                          </Box>
                          <Box display="flex" flexDirection="column" gap={0.8}>
                            {foods.map((f) => <DraggableFoodCard key={f.id} food={f} />)}
                          </Box>
                        </Box>
                      );
                    })
                  )}
                </Box>
              </Box>
            </Grid>

            {/* RIGHT: Day plan */}
            <Grid xs={12} lg={8}>
              <Box sx={{ p: 3, borderRadius: "20px", background: "#141d2b", border: "1px solid rgba(59,130,246,0.25)" }}>
                {/* Day total */}
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5}>
                  <Typography fontSize={14} fontWeight={700} color="#ddd">{DAYS[activeDay].label}</Typography>
                  {dayTotalKcal > 0 && (
                    <Chip
                      label={`${dayTotalKcal} kcal totales`}
                      size="small"
                      sx={{ bgcolor: "rgba(34,197,94,0.1)", color: "#22c55e", fontWeight: 700, fontSize: 11 }}
                    />
                  )}
                </Box>

                {/* Meal slots */}
                <Box display="flex" flexDirection="column" gap={1.5} mb={3}>
                  {MEAL_SLOTS.map((slot) => (
                    <DroppableSlot
                      key={slot}
                      slot={slot}
                      foods={dayData.foods.filter((f) => f.slot === slot)}
                      onRemove={(foodUid) => removeFood(dk, foodUid)}
                    />
                  ))}
                </Box>

                <Divider sx={{ borderColor: "rgba(139,92,246,0.2)", mb: 2.5 }} />

                {/* Supplements */}
                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                  <Box sx={{ width: 30, height: 30, borderRadius: "9px", bgcolor: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ScienceIcon sx={{ color: "#8B5CF6", fontSize: 16 }} />
                  </Box>
                  <Typography fontSize={13} fontWeight={700} color="#ddd">Suplementos</Typography>
                  <Box sx={{ ml: "auto", px: 1.2, py: 0.2, borderRadius: "6px", bgcolor: "rgba(139,92,246,0.08)", color: "#8B5CF6", fontSize: 11, fontWeight: 700 }}>
                    {dayData.supplements.length}
                  </Box>
                </Box>

                <Box display="flex" flexDirection="column" gap={1.5}>
                  {dayData.supplements.map((s, idx) => (
                    <Box key={idx} sx={{ p: 2, borderRadius: "12px", background: "#0e1623", border: "1px solid rgba(139,92,246,0.12)" }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: s.color }} />
                          <Typography fontSize={12} color="#94a3b8" fontWeight={600}>Suplemento {idx + 1}</Typography>
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
                        <TextField label="Cantidad" placeholder="30g, 2 cáps." value={s.amount} onChange={(e) => updateSupp(dk, idx, "amount", e.target.value)}
                          sx={{ ...fieldSx, width: 110, flexShrink: 0 }} />
                      </Box>
                      <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                        <Typography fontSize={11} color="#94a3b8">Color:</Typography>
                        {SUPP_COLORS.map((c) => (
                          <Box key={c} onClick={() => updateSupp(dk, idx, "color", c)}
                            sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: c, cursor: "pointer", border: s.color === c ? "2.5px solid white" : "2.5px solid transparent", transition: "border 0.15s" }} />
                        ))}
                      </Box>
                      <TextField label="Instrucciones" placeholder="Ej: Tomar después del entrenamiento"
                        value={s.instructions} onChange={(e) => updateSupp(dk, idx, "instructions", e.target.value)} fullWidth sx={fieldSx} />
                    </Box>
                  ))}
                  <Button startIcon={<AddIcon />} onClick={() => addSupp(dk)}
                    sx={{ textTransform: "none", fontSize: 13, color: "#8B5CF6", px: 2, py: 1, borderRadius: "10px", bgcolor: "rgba(139,92,246,0.07)", "&:hover": { bgcolor: "rgba(139,92,246,0.12)" } }}>
                    Agregar suplemento
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Drag overlay (ghost card while dragging) */}
          <DragOverlay>
            {draggingFood && (
              <Box sx={{ p: 1.3, borderRadius: "10px", background: "#1a2a3a", border: "1px solid #3B82F6", display: "flex", alignItems: "center", gap: 1.2, boxShadow: "0 8px 32px rgba(59,130,246,0.4)", minWidth: 160, opacity: 0.95 }}>
                <Typography fontSize={20}>{draggingFood.emoji}</Typography>
                <Box>
                  <Typography fontSize={12} color="#fff" fontWeight={600}>{draggingFood.name}</Typography>
                  <Typography fontSize={10} color="#64748b">{draggingFood.kcal} kcal/{draggingFood.countable ? draggingFood.unit : "100g"}</Typography>
                </Box>
              </Box>
            )}
          </DragOverlay>

          {/* Footer */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
            <Button startIcon={<ArrowBackIcon fontSize="small" />} onClick={() => setStep(0)}
              sx={{ color: "#64748b", textTransform: "none", fontSize: 13, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", px: 2.5, py: 1 }}>
              Anterior
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={saving || !hasContent}
              startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
              sx={{ textTransform: "none", fontWeight: 600, fontSize: 13, px: 4, py: 1.2, borderRadius: "10px", background: "#3B82F6", boxShadow: "0 0 20px rgba(59,130,246,0.25)", "&:hover": { background: "#2563eb" }, "&:disabled": { opacity: 0.4 } }}>
              {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Guardar plan"}
            </Button>
          </Box>
        </DndContext>
      )}

      {/* ── Quantity modal ── */}
      <Dialog open={!!pendingDrop} onClose={() => setPendingDrop(null)}
        PaperProps={{ sx: { background: "#141d2b", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "18px", minWidth: 320 } }}>
        <DialogTitle sx={{ color: "white", fontSize: 16, fontWeight: 700, pb: 1 }}>
          {pendingDrop?.food.emoji} {pendingDrop?.food.name}
          <Typography fontSize={12} color="#64748b" mt={0.5}>→ {pendingDrop?.slot}</Typography>
        </DialogTitle>
        <DialogContent>
          {/* Count / Weight switch */}
          <Box display="flex" alignItems="center" justifyContent="center" gap={1.5} mb={2.5}
            sx={{ p: 1.2, borderRadius: "10px", background: "#0e1623", border: "1px solid rgba(59,130,246,0.12)" }}>
            <Typography fontSize={12} color={!pendingByCount ? "#3B82F6" : "#64748b"} fontWeight={!pendingByCount ? 700 : 400}>
              Peso (g)
            </Typography>
            <Switch
              checked={pendingByCount}
              onChange={(e) => {
                setPendingByCount(e.target.checked);
                setPendingQty(e.target.checked ? "1" : "100");
              }}
              size="small"
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#3B82F6" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#3B82F6" },
                "& .MuiSwitch-track": { bgcolor: "#334155" },
              }}
            />
            <Typography fontSize={12} color={pendingByCount ? "#3B82F6" : "#64748b"} fontWeight={pendingByCount ? 700 : 400}>
              Cantidad ({pendingDrop?.food.unit ?? "pza"})
            </Typography>
          </Box>

          <Box mb={2}>
            <Typography fontSize={12} color="#94a3b8" mb={1.5}>
              {pendingByCount ? `¿Cuántas ${pendingDrop?.food.unit}s?` : "¿Cuántos gramos?"}
            </Typography>
            <TextField
              type="number"
              value={pendingQty}
              onChange={(e) => setPendingQty(e.target.value)}
              fullWidth
              autoFocus
              slotProps={{ input: { endAdornment: <InputAdornment position="end"><Typography fontSize={13} color="#64748b">{pendingByCount ? (pendingDrop?.food.unit ?? "pza") : "g"}</Typography></InputAdornment> } }}
              sx={fieldSx}
            />
          </Box>
          {pendingCalories > 0 && (
            <Box sx={{ p: 1.5, borderRadius: "10px", background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)", textAlign: "center" }}>
              <Typography fontSize={22} fontWeight={700} color="#22c55e">{pendingCalories} kcal</Typography>
              <Typography fontSize={11} color="#64748b">estimadas</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setPendingDrop(null)} sx={{ color: "#64748b", textTransform: "none", borderRadius: "8px" }}>Cancelar</Button>
          <Button variant="contained" onClick={confirmDrop} disabled={!pendingQty || parseInt(pendingQty) <= 0}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: "8px", background: "#3B82F6", "&:hover": { background: "#2563eb" } }}>
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
