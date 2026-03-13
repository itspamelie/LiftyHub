export default function Training(){

const items = [
{
title:"Strength",
desc:"Build muscle mass",
img:"https://lh3.googleusercontent.com/aida-public/AB6AXuBzKN6hnABGOGYqFgmyoI_bivlw5kXO9tQue1X8vEIWQ7u2jpmcrhGcfrAGK4_IGO63EEg1fnvtrYlhD_jalCw2Miql5WxeXF3DgtjVy0o9Uc1dVyZXpH4iRWgJgjFWvRva8Spu0knTfRbQ37fAN5IlKd1We_0pB74rP9yy4IXFszpV_kCX7IupnQsmUZc_XL2kqGwa1c3AfNB8BQCcY3MzmmY5L5OwFnUv8KrhgGrKNHVZw6mrg4ATkN8E0FUgKpAij1D6OSnN4JA"
},
{
title:"Mobility",
desc:"Improve range of motion",
img:"https://lh3.googleusercontent.com/aida-public/AB6AXuCyMaMmzKFtGPQOCJmKamQJMF6Wv_t2LCCE4_MSzjXiJwG_DyBRQMuCucWstYJe9kuL4zWUqIuFziJ31rFlYWoGfIJJ0JuKtBFzjdLhOqI7Ra44Co9D9bKOfj7257iWXxKo-WUjtZfPy8323J4DtqyNj51rr35SHAPJ2GLwETkAbaY03UDEEjNGgZm_u6ECT6to6IjYTmgXZqN731aR4w3GqOUesLblDOI-2WBBf13q48FhmwoXgCiAhbFJnI3qv7tB7LIhhCJLA6w"
},
{
title:"Cardio",
desc:"Boost endurance",
img:"https://lh3.googleusercontent.com/aida-public/AB6AXuAB2KNwi6G5UhFLQlZlFSykQe9V111S3d9PE2x0yVf1uh4ijbMbliGO6dDZTDvhydGZWpXp9wynGZuNTg8ZS93lx_zy_eI8yxIg9GKcEHwFfx6nqGU7bemWFFJWcIckLr3u7Zu1wUoBaat0Dtr5vNN31nEwf2i3NL8-a04eVVEH7QKqiturD8gegXw3Qa3TioLgZNbRIuy76BuK7lpc6rRlnkU1jKViDWLUlImn1hmoqX58_rlG_m2sc7YbNY7B0t2nOfpb7TaGzqo"
},
{
title:"Full Body",
desc:"Total athletic conditioning",
img:"https://lh3.googleusercontent.com/aida-public/AB6AXuDsb0dftgEWXzonoKwBx9mPj71IqLSCLl-3UqJBvPsKzdkRJYGiQzovJhJync_dflcy4MdSeUEBykCp5xpf9-uYOp3fDzBK1cof-vYml7XfrMK0s-aAxn8mivffhRjEPpOQC17PjZoiQe22cqzYfGScFLGM5i7QkK0tMKsgTdW0BSC2yXGvGLbGcLvWOjT556HA26QRZwxaEmydF3KNXNgX90udAVwhdx9PG5H2TeXLP4M7_cyzTOMcWl5Xeef53cxHFJA3U5k88NY"
}
]

return(

<section className="training-section py-5">

<div className="container">

<h2 className="text-center text-light fw-bold mb-5">
Train Your Way
</h2>

<div className="row g-4">

{items.map((item,index)=>(

<div className="col-md-3" key={index}>

<div className="training-card">

<img src={item.img} />

<div className="training-overlay">

<h5>{item.title}</h5>
<p>{item.desc}</p>

</div>

</div>

</div>

))}

</div>

</div>

</section>

)

}