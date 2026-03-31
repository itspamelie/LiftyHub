import {
  Box, TextField
} from "@mui/material";
import PlansTable from "../components/plans/PlansTable"
import CreatePlanForm from "../components/plans/CreatePlanForm"
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { apiFetch } from "../services/api";
import EditPlanModal from "../components/plans/EditPlanModal"
import TopNavbar from "../components/dashboard/TopNavbar";
import SearchIcon from "@mui/icons-material/Search";


export default function PlansDashboard() {
  // STATES
  const [plans, setPlans] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [level, setLevel] = useState("");
  const [max_routines, setMax_routines] = useState("");

  const [openEdit, setOpenEdit] = useState(false)
const [editPlan, setEditPlan] = useState<any>(null)
const openEditModal = (plan:any) => {
setEditPlan(plan)
setOpenEdit(true)
}

const closeEditModal = () => {
setOpenEdit(false)
setEditPlan(null)
}
const handleEditChange = (e:any) => {

setEditPlan({
...editPlan,
[e.target.name]: e.target.value
})

}

  // GET PLANS
  useEffect(() => {
    apiFetch("/plans")
      .then((data) => {
        setPlans(data.data || []);
        setLoading(false);
        Swal.close();
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        Swal.close();
      });
  }, []);

  // LOADING ALERT
  useEffect(() => {
    if (loading) {
      Swal.fire({
        title: "Cargando planes...",
        text: "Obteniendo información",
        background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
        color: "#fff",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    }
  }, [loading]);

  if (loading) return null;

  // SEARCH
  const searchPlans = async (value: string) => {
    setSearch(value);

    try {
      if (value.trim() === "") {
        const data = await apiFetch("/plans");
        setPlans(data.data || []);
        return;
      }

      const data = await apiFetch(`/search-plans?search=${value}`);
      setPlans(data.data || []);
    } catch (error) {
      console.error("Error buscando planes", error);
    }
  };

  // CREATE PLAN
  const createPlan = async () => {
    try {
      const response = await apiFetch("/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          description,
          price,
          level,
          max_routines
        })
      });

      Swal.fire({
        icon: "success",
        title: "Plan creado",
        background:"linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
        confirmButtonColor:"#60a5fa",
        color: "#fff"
      });

      setPlans([...plans, response.data]);
      setName("");
      setDescription("");
      setPrice("");
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error al crear plan",
        background: "linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
        color: "#fff",
        confirmButtonColor:"#60a5fa",

      });
    }
  };

  const deletePlan = async (id:number) => {

const result = await Swal.fire({
title: "¿Eliminar plan?",
text: "Esta acción no se puede deshacer",
icon: "warning",
showCancelButton: true,
confirmButtonText: "Sí, eliminar",
cancelButtonText: "Cancelar",
confirmButtonColor:"#e71d1d",
background:"linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
color:"#fff"
})

if(!result.isConfirmed) return

try{

await apiFetch(`/plans/${id}`,{
method:"DELETE"
})

setPlans(plans.filter(plan => plan.id !== id))

Swal.fire({
icon:"success",
title:"Plan eliminado",
background:"linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
confirmButtonColor:"#60a5fa",
color:"#fff"
})

}catch(error){

console.error(error)

Swal.fire({
icon:"error",
title:"Error al eliminar",
background:"linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
confirmButtonColor:"#60a5fa",
color:"#fff"
})

}

}
const updatePlan = async () => {

try{

await apiFetch(`/plans/${editPlan.id}`,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(editPlan)
})

setPlans(plans.map(p =>
p.id === editPlan.id ? editPlan : p
))

Swal.fire({
icon:"success",
title:"Plan actualizado",
background:"linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
color:"#fff",
confirmButtonColor:"#60a5fa",

})

closeEditModal()

}catch(error){

console.error(error)

Swal.fire({
icon:"error",
title:"Error al actualizar",
background:"linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
color:"#fff",
confirmButtonColor:"#60a5fa",

})

}

}
return (
<Box
sx={{
minHeight: "100vh",
display: "flex",
flexDirection: "column",
background:"#000000",
}}
>

<TopNavbar />
<TextField
  size="medium"
  placeholder="Buscar Plan..."
  variant="outlined"
  value={search}
  onChange={(e) => searchPlans(e.target.value)}
  sx={{
    width: "300px", 
    mb: 1,
    pl:7,
    input: { color: "white" },
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      color: "white",
      "& fieldset": {
        borderColor: "#2d3561"
      }
    }
  }}
  InputProps={{
    startAdornment: <SearchIcon sx={{ mr: 3 }} />
  }}
/>


<Box
sx={{
flexGrow:1,
display:"grid",
gridTemplateColumns:"2fr 1fr",
gap:3,
p:7
}}
>



<PlansTable
plans={plans}
onEdit={openEditModal}
onDelete={deletePlan}
/>

<CreatePlanForm
  name={name}
  description={description}
  price={price}
  level={level}
  max_routines={max_routines}
  setName={setName}
  setDescription={setDescription}
  setPrice={setPrice}
  setLevel={setLevel}
  setMax_routines={setMax_routines}
  onSubmit={createPlan}
/>

</Box>

<EditPlanModal
open={openEdit}
onClose={closeEditModal}
plan={editPlan}
onChange={handleEditChange}
onUpdate={updatePlan}
/>

</Box>
);
}