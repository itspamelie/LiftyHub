import {
Card,
CardContent,
Typography,
TextField,
FormControl,
Select,
MenuItem,
Button
} from "@mui/material"
import { useState } from "react"
import { apiFetch } from "../../services/api"
import Swal from "sweetalert2"



export default function UserForm({onUserCreated}:any){


const inputWhite = {
mb:2,

"& .MuiOutlinedInput-root":{
background:"#f8fafc",
borderRadius:"10px",
height:"40px"
},

"& fieldset":{
borderColor:"#d1d5db"
},

"& input":{
color:"#111827"
},

"& input::placeholder":{
color:"#6b7280",
opacity:1
}
}
const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [gender,setGender] = useState("")
const [role,setRole] = useState("")
const [birthdate,setBirthdate] = useState("")
const [img,setImg] = useState<File | null>(null)

const createUser = async () => {

try{

const formData = new FormData()

formData.append("name",name)
formData.append("email",email)
formData.append("password",password)
formData.append("gender",gender)
formData.append("birthdate",birthdate)
formData.append("role",role)

if(img){
formData.append("img",img)
}

await apiFetch("/users",{
method:"POST",
body:formData
})

if(onUserCreated){
onUserCreated()
}
Swal.fire({
icon:"success",
title:"Usuario creado",
text:"El usuario se registró correctamente",
      background:"linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
      confirmButtonColor:"#60a5fa",
      color:"#fff",
})

}catch(error){

Swal.fire({
icon:"error",
title:"Error",
text:"No se pudo crear el usuario",
      background:"linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",
      color:"#fff",
      confirmButtonColor: "#3b82f6"
})

}

}
return(

<Card sx={{background:"linear-gradient(180deg, #1e1f24 0%, #1e1e24 100%)",color:"white",borderRadius:"16px"}}>

<CardContent>

<Typography variant="h6" mb={3}>
Crear Usuario
</Typography>

<TextField
placeholder="Nombre"
fullWidth
size="small"
value={name}
onChange={(e)=>setName(e.target.value)}
sx={inputWhite}
/>

<TextField
placeholder="Email"
fullWidth
size="small"
value={email}
onChange={(e)=>setEmail(e.target.value)}
sx={inputWhite}
/>

<TextField
placeholder="Password"
type="password"
fullWidth
size="small"
value={password}
onChange={(e)=>setPassword(e.target.value)}
sx={inputWhite}
/>
{/* GENERO */}

<FormControl fullWidth size="small" sx={inputWhite}>

<Select
value={gender}
displayEmpty
onChange={(e)=>setGender(e.target.value)}
sx={{
background:"#f8fafc",
borderRadius:"10px",
height:"40px",
color: gender ? "#111827" : "#6b7280"
}}
>

<MenuItem value="" disabled>
Genero
</MenuItem>

<MenuItem value="Masculino">Masculino</MenuItem>
<MenuItem value="Femenino">Femenino</MenuItem>

</Select>

</FormControl>
{/* FOTO */}

<Button
variant="outlined"
component="label"
fullWidth
sx={{
mb:2,
height:"40px",
borderColor:"#d1d5db",
color:"#374151",
background:"#f8fafc"
}}
>
Subir foto
<input hidden type="file" accept="image/*"
onChange={(e)=>setImg(e.target.files?.[0] || null)}/>
</Button>

{/* FECHA */}

<TextField
type="date"
fullWidth
size="small"
value={birthdate}
onChange={(e)=>setBirthdate(e.target.value)}
sx={inputWhite}
/>

{/* ROL */}

<FormControl fullWidth size="small" sx={inputWhite}>

<Select
value={role}
displayEmpty
onChange={(e)=>setRole(e.target.value)}
sx={{
background:"#f8fafc",
borderRadius:"10px",
height:"40px",
color: role ? "#111827" : "#6b7280"
}}
>

<MenuItem value="" disabled>
Rol
</MenuItem>

<MenuItem value="user">
Usuario
</MenuItem>

<MenuItem value="nutritionist">
Nutriólogo
</MenuItem>

<MenuItem value="admin">
Administrador
</MenuItem>

</Select>

</FormControl>

<Button
variant="contained"
fullWidth
onClick={createUser}
sx={{
mt:1,
background:"#3b82f6",
borderRadius:"10px",
height:"42px",
fontWeight:"bold"
}}
>
Crear Usuario
</Button>

</CardContent>

</Card>

)

}