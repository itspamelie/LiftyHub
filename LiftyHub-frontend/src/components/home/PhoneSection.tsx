import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Carousel } from "react-bootstrap";

const screenshots = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNKkISGs5i8Ro7r4DOUWYzkf2dc-rMmSDWNvR8tbspZpZ-PbODJK5CNhxuQhdkqQzsIwXZhWiosVskY3EljyIJwFs9qWUjGptI3_FKsE1O8WB4WoIg59uT1J2aQC-i4JfobtS9pkOaUCXACJmIOwBrJf5vfWOrOIxremCzj7skIsyQr1dbZPbvCB3hRP0673Hvqm7ifQhvUg70OOcx3zd1JVhiEZ3HNGYFHyqMGDhQ8k1iMitN-Y67OU9pn8LMdx3IRXTBpCv01N0",
    label: "Dashboard"
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNKkISGs5i8Ro7r4DOUWYzkf2dc-rMmSDWNvR8tbspZpZ-PbODJK5CNhxuQhdkqQzsIwXZhWiosVskY3EljyIJwFs9qWUjGptI3_FKsE1O8WB4WoIg59uT1J2aQC-i4JfobtS9pkOaUCXACJmIOwBrJf5vfWOrOIxremCzj7skIsyQr1dbZPbvCB3hRP0673Hvqm7ifQhvUg70OOcx3zd1JVhiEZ3HNGYFHyqMGDhQ8k1iMitN-Y67OU9pn8LMdx3IRXTBpCv01N0",
    label: "Rutinas"
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNKkISGs5i8Ro7r4DOUWYzkf2dc-rMmSDWNvR8tbspZpZ-PbODJK5CNhxuQhdkqQzsIwXZhWiosVskY3EljyIJwFs9qWUjGptI3_FKsE1O8WB4WoIg59uT1J2aQC-i4JfobtS9pkOaUCXACJmIOwBrJf5vfWOrOIxremCzj7skIsyQr1dbZPbvCB3hRP0673Hvqm7ifQhvUg70OOcx3zd1JVhiEZ3HNGYFHyqMGDhQ8k1iMitN-Y67OU9pn8LMdx3IRXTBpCv01N0",
    label: "Progreso"
  },
]

export default function PhoneSection(){

return(

<section className="app-preview py-5" id="la-app">

<div className="container">

<div className="row align-items-center">


{/* CAROUSEL */}

<div className="col-lg-6 text-center">

<div className="phone-container">

  <Carousel
    indicators={true}
    controls={false}
    interval={3000}
    className="phone-carousel"
  >
    {screenshots.map((s, i) => (
      <Carousel.Item key={i}>
        <img
          src={s.src}
          className="img-fluid phone-img"
          alt={s.label}
        />
      </Carousel.Item>
    ))}
  </Carousel>

</div>

</div>


{/* TEXT */}

<div className="col-lg-6">

<span className="section-badge mb-3 d-inline-block">
  LA APP
</span>

<h2 className="fw-bold text-light display-6 mt-2">

Enfócate en levantar,<br/>
nosotros llevamos el registro.

</h2>

<p className="text-secondary mt-4 fs-5">

LiftyHub te ayuda a organizar tus rutinas,
registrar tu progreso y mantenerte constante.
Sin hojas de cálculo ni libretas.
Solo rendimiento puro en la palma
de tu mano.

</p>


<ul className="feature-list mt-4">

<li>
  <CheckCircleIcon sx={{fontSize:18, color:"#3B82F6", marginRight:"10px", flexShrink:0}}/>
  Crea y gestiona tus rutinas personales
</li>

<li>
  <CheckCircleIcon sx={{fontSize:18, color:"#3B82F6", marginRight:"10px", flexShrink:0}}/>
  Seguimiento de racha y progreso mensual
</li>

<li>
  <CheckCircleIcon sx={{fontSize:18, color:"#3B82F6", marginRight:"10px", flexShrink:0}}/>
  Plan de dieta asignado por nutricionista
</li>

</ul>

</div>

</div>

</div>

</section>

)

}
