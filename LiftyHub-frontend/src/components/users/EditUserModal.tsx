import {
Dialog,
DialogContent,
IconButton,
TextField,
Button,
Box,
Typography,
MenuItem,
Avatar
} from "@mui/material"

import CloseIcon from "@mui/icons-material/Close"
import { useState,useEffect } from "react"
import { apiFetch, getImageUrl } from "../../services/api"
import Swal from "sweetalert2"

export default function EditUserModal({open,user,onClose,onUpdated}:any){

const [form,setForm] = useState<any>({})
const [preview,setPreview] = useState("")
const whiteInput = {
"& .MuiOutlinedInput-root": {
background: "white",
borderRadius: "10px"
},
"& .MuiInputBase-input": {
color: "#1a2035"
}
}
useEffect(()=>{

if(user){
setForm(user)

if(user.img){
    setPreview(getImageUrl(user.img) + "?" + Date.now())
}

}

},[user])

const handleChange = (e:any)=>{
setForm({
...form,
[e.target.name]: e.target.value
})
}

const handleImage = (e:any)=>{
const file = e.target.files[0]

if(file){
setForm({
...form,
img:file
})

setPreview(URL.createObjectURL(file))
}
}
const handleSubmit = async () => {

const formData = new FormData()

formData.append("_method","PUT")  

formData.append("name", form.name)
formData.append("email", form.email)
formData.append("gender", form.gender)
formData.append("birthdate", form.birthdate)
formData.append("role", form.role)

if(form.password){
formData.append("password", form.password)
}

if(form.img instanceof File){
formData.append("img", form.img)
}

try{

await apiFetch(`/users/${form.id}`,{
method:"POST",   // 👈 POST en lugar de PUT
body:formData
})

Swal.fire({
icon:"success",
title:"Usuario actualizado",
 background:"#0f172a",
timer:1500,
showConfirmButton:false
})

onUpdated()
onClose()

}catch(err){

Swal.fire({
icon:"error",
title:"Error",
background:"#0f172a",
text:"No se pudo actualizar el usuario"
})

}

}
return(

<Dialog
open={open}
onClose={onClose}
maxWidth="md"
fullWidth
PaperProps={{
sx:{
background:"#1a2035",
color:"white",
borderRadius:"16px"
}
}}
>

<DialogContent>

{/* boton cerrar */}

<IconButton
onClick={onClose}
sx={{
position:"absolute",
right:10,
top:10,
color:"white"
}}
>
<CloseIcon/>
</IconButton>

<Typography variant="h6" mb={3}>
Editar Usuario
</Typography>

<Box
display="grid"
gridTemplateColumns="1fr 2fr"
gap={4}
>

{/* preview imagen */}

<Box display="flex" flexDirection="column" alignItems="center">

<Avatar
src={preview}
sx={{
width:200,
height:200,
mb:2,
mt:10
}}
/>

<Button
variant="contained"
component="label"
sx={{
background:"#3b82f6"
}}
>

Subir foto

<input
hidden
type="file"
onChange={handleImage}
/>

</Button>

</Box>

{/* formulario */}

<Box display="flex" flexDirection="column" gap={2}>

<TextField
name="name"
value={form.name || ""}
onChange={handleChange}
placeholder="Nombre"
sx={whiteInput}
fullWidth
/>

<TextField
name="email"
value={form.email || ""}
onChange={handleChange}
placeholder="Email"
sx={whiteInput}

fullWidth
/>

<TextField
name="password"
value={form.password || ""}
onChange={handleChange}
placeholder="Contraseña"
sx={whiteInput}
type="password"
fullWidth
/>

<TextField
select
name="gender"
value={form.gender || ""}
onChange={handleChange}
sx={whiteInput}

>

<MenuItem value="Masculino">Masculino</MenuItem>
<MenuItem value="Femenino">Femenino</MenuItem>

</TextField>

<TextField
name="birthdate"
type="date"
value={form.birthdate || ""}
onChange={handleChange}
sx={whiteInput}
InputLabelProps={{shrink:true}}
/>

<TextField
select
name="role"
value={form.role || ""}
sx={whiteInput}
onChange={handleChange}
>

<MenuItem value="user">Usuario</MenuItem>
<MenuItem value="admin">Administrador</MenuItem>
<MenuItem value="nutritionist">Nutriologo</MenuItem>

</TextField>

<Button
variant="contained"
onClick={handleSubmit}
sx={{
background:"#3b82f6",
mt:2
}}
>

Actualizar usuario

</Button>

</Box>

</Box>

</DialogContent>

</Dialog>

)

}