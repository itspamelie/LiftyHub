import {
  Box, TextField,Button
} from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { apiFetch } from "../services/api";
import TopNavbar from "../components/somatotypes/TopNavbar";
import SearchIcon from "@mui/icons-material/Search";
import SomatotypesCard from "../components/somatotypes/SomatotypesCard"
import CreateSomatotypeModal from "../components/somatotypes/CreateSomatotypeModal"
import EditSomatotypeModal from "../components/somatotypes/EditSomatotypeModal"

export default function SomatotypesDashboard() {

  // STATES
  const [somatotypes, setSomatotypes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false)

  const [openEdit, setOpenEdit] = useState(false)
  const [editSomatotype, setEditSomatotype] = useState<any>(null)

  const openEditModal = (somatotype:any) => {
    setEditSomatotype(somatotype)
    setOpenEdit(true)
  }

  const closeEditModal = () => {
    setOpenEdit(false)
    setEditSomatotype(null)
  }


  // GET SOMATOTYPES
  useEffect(() => {
    apiFetch("/somatotypes")
      .then((data) => {
        setSomatotypes(data.data || []);
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
        title: "Cargando somatotipos...",
        text: "Obteniendo información",
        background: "#0f172a",
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
  const searchSomatotypes = async (value: string) => {
    setSearch(value);

    try {
      if (value.trim() === "") {
        const data = await apiFetch("/somatotypes");
        setSomatotypes(data.data || []);
        return;
      }

      const data = await apiFetch(`/search-somatotypes?search=${value}`);
      setSomatotypes(data.data || []);
    } catch (error) {
      console.error("Error buscando somatotipos", error);
    }
  };

  // DELETE
  const deleteSomatotype = async (id:number) => {

    const result = await Swal.fire({
      title: "¿Eliminar somatotipo?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor:"#e71d1d",
      background:"#0f172a",
      color:"#fff"
    })

    if(!result.isConfirmed) return

    try{
      await apiFetch(`/somatotypes/${id}`,{
        method:"DELETE"
      })

      setSomatotypes(somatotypes.filter(s => s.id !== id))

      Swal.fire({
        icon:"success",
        title:"Somatotipo eliminado",
        background:"#0f172a",
        confirmButtonColor:"#60a5fa",
        color:"#fff"
      })

    }catch(error){
      console.error(error)

      Swal.fire({
        icon:"error",
        title:"Error al eliminar",
        background:"#0f172a",
        confirmButtonColor:"#60a5fa",
        color:"#fff"
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
        width: "100%" 

      }}
    >

      <TopNavbar />

 <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: 5,
    mt: 4
  }}
>
  {/* BUSCADOR */}
  <TextField
    size="medium"
    placeholder="Buscar Somatotipo..."
    variant="outlined"
    value={search}
    onChange={(e) => searchSomatotypes(e.target.value)}
    sx={{
      width: "300px",
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
      startAdornment: <SearchIcon sx={{ mr: 2 }} />
    }}
  />

  {/* BOTÓN */}
<Button
  variant="contained"
  onClick={() => setOpenCreate(true)}
  sx={{
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)"
  }}
>
  + Agregar
</Button>
</Box>

      <Box
        sx={{
          flexGrow:1,
          display:"grid",
          gridTemplateColumns:"2fr 1fr",
          gap:3,
          p:5
        }}
      >


<Box
  sx={{
    display: "grid",
gridTemplateColumns: "repeat(4, minmax(280px, 1fr))",
    gap: 2,
    p: 4
  }}
>
  {somatotypes.map((s) => (
<SomatotypesCard
  key={s.id}
  data={s}
  onEdit={openEditModal}
  onDelete={deleteSomatotype}
/>
  ))}
</Box>

      </Box>


<CreateSomatotypeModal
  open={openCreate}
  onClose={() => setOpenCreate(false)}
  onCreated={(newSomatotype:any) =>
    setSomatotypes([...somatotypes, newSomatotype])
  }
/>

<EditSomatotypeModal
  open={openEdit}
  onClose={closeEditModal}
  somatotype={editSomatotype}
  onUpdated={(updated:any) =>
    setSomatotypes(prev =>
      prev.map(s => s.id === updated.id ? updated : s)
    )
  }
/>

    </Box>
    
  );
}