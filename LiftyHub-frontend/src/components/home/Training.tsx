const items = [
  {
    title: "Fuerza",
    desc: "Gana masa muscular",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80"
  },
  {
    title: "Movilidad",
    desc: "Mejora tu rango de movimiento",
    img: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=600&q=80"
  },
  {
    title: "Cardio",
    desc: "Aumenta tu resistencia",
    img: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=600&q=80"
  },
  {
    title: "HIIT",
    desc: "Quema grasa en menos tiempo",
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80"
  },
  {
    title: "Full Body",
    desc: "Condicionamiento atlético total",
    img: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=600&q=80"
  }
]

export default function Training(){
return(

<section className="training-section py-5" id="entrenamientos">

<div className="container">

<div className="text-center mb-5">

  <span className="section-badge mb-3 d-inline-block">
    CATEGORÍAS
  </span>

  <h2 className="text-light fw-bold mt-2">
    Entrena a tu manera
  </h2>

  <p className="text-secondary">
    Filtra rutinas por categoría y encuentra el estilo que más se adapta a ti
  </p>

</div>

<div className="row g-4">

{items.map((item, index) => (

<div className={index < 2 ? "col-md-6" : "col-md-4"} key={index}>

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
