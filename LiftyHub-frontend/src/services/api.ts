const API_URL = import.meta.env.VITE_API_URL

export const apiFetch = async (endpoint:string, options:any = {}) => {

const token = localStorage.getItem("token")

const headers:any = {
Authorization:`Bearer ${token}`,
Accept:"application/json"
}

if(!(options.body instanceof FormData)){
headers["Content-Type"] = "application/json"
}

const res = await fetch(`${API_URL}${endpoint}`,{
...options,
headers
})

const data = await res.json()

if(!res.ok){
throw data
}

return data

}

export const getImageUrl = (path:string) => {

const serverURL = API_URL.replace("/api","")

return `${serverURL}/users/${path}`

}