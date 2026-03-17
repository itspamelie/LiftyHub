import { useState,useEffect } from "react"
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, TablePagination
} from "@mui/material"
import { apiFetch } from "../../services/api"
import Swal from "sweetalert2"


import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import { Card, CardContent, Typography } from "@mui/material"

export default function UserTable({ users = [], onUserDeleted }: any){
const [page, setPage] = useState(0)
const rowsPerPage = 6
const [localUsers, setLocalUsers] = useState(users)

const handleChangePage = (event: unknown, newPage: number) => {
  setPage(newPage)
}

const handleDelete = async (id:number) => {

const result = await Swal.fire({
title:"¿Eliminar usuario?",
text:"Esta acción no se puede deshacer",
icon:"warning",
showCancelButton:true,
confirmButtonText:"Eliminar",
cancelButtonText:"Cancelar",
confirmButtonColor:"#3b82f6",
cancelButtonColor:"#3b82f6",
background:"#202940",
color:"#fff"
})

if(!result.isConfirmed) return

try{

await apiFetch(`/users/${id}`,{
method:"DELETE"
})

await onUserDeleted()

Swal.fire({
icon:"success",
title:"Usuario eliminado",
confirmButtonColor:"#3b82f6",
background:"#202940",
color:"#fff"
})

}catch(error){
console.error("Error eliminando usuario",error)
}

}
useEffect(()=>{
setLocalUsers(users)
},[users])
return(

<Card sx={{
  background:"#202940",
  color:"white",
  borderRadius:"16px",
  boxShadow:"none",
  border:"none"
}}>

<CardContent>

<Typography variant="h6" mb={2}>
Todos los usuarios
</Typography>

<Table>

<TableHead>
<TableRow>
<TableCell sx={{color:"white"}}>Nombre</TableCell>
<TableCell sx={{color:"white"}}>Email</TableCell>
<TableCell sx={{color:"white"}}>Genero</TableCell>
<TableCell sx={{color:"white"}}>Nacimiento</TableCell>
<TableCell sx={{color:"white"}}>Rol</TableCell>
<TableCell sx={{color:"white"}}>Acciones</TableCell>
</TableRow>
</TableHead>

<TableBody>

{localUsers
.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
.map((user:any)=>(
<TableRow
key={user.id}
sx={{
"& td, & th": {
borderBottom: "1px solid rgba(255,255,255,0.08)",
"&:hover": { backgroundColor: "#273352" }
}
}}
>

<TableCell sx={{color:"white"}}>{user?.name}</TableCell>
<TableCell sx={{color:"white"}}>{user?.email}</TableCell>
<TableCell sx={{color:"white"}}>{user?.gender}</TableCell>
<TableCell sx={{color:"white"}}>{user?.birthdate}</TableCell>
<TableCell sx={{color:"white"}}>{user?.role}</TableCell>

<TableCell>
<IconButton sx={{color:"#60a5fa"}}>
<EditIcon/>
</IconButton>

<IconButton
sx={{color:"#f87171"}}
onClick={()=>handleDelete(user.id)}
>
<DeleteIcon/>
</IconButton>
</TableCell>

</TableRow>
))}

</TableBody>
</Table>

<TablePagination
component="div"
count={localUsers.length}
page={page}
onPageChange={handleChangePage}
rowsPerPage={rowsPerPage}
rowsPerPageOptions={[6]}
sx={{
color:"white",
".MuiTablePagination-toolbar":{color:"white"}
}}
/>

</CardContent>
</Card>
)
}