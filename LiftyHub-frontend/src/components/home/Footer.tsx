import LanguageIcon from "@mui/icons-material/Language";
import SearchIcon from "@mui/icons-material/Search";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export default function Footer(){

return(

<footer className="footer-section">

<div className="container py-5">

<div className="row gy-4">

{/* LOGO + DESC */}

<div className="col-lg-3">

<h5 className="text-light fw-bold">
<span style={{color:"#3B82F6"}}>✕</span> LiftyHub
</h5>

<p className="text-secondary mt-3">

La app de fitness definitiva para atletas
que quieren entrenar con inteligencia y constancia.

</p>

<div className="d-flex gap-3 mt-3 social-icons">

<LanguageIcon sx={{ fontSize: 20, color: "#6b7280" }} />
<SearchIcon sx={{ fontSize: 20, color: "#6b7280" }} />
<PlayArrowIcon sx={{ fontSize: 20, color: "#6b7280" }} />

</div>

</div>


{/* PRODUCT */}

<div className="col-lg-3">

<h6 className="text-light fw-bold mb-3">
Producto
</h6>

<ul className="footer-links">

<li>Funciones</li>
<li>Rutinas</li>
<li>Dieta</li>
<li>Planes</li>

</ul>

</div>


{/* COMPANY */}

<div className="col-lg-3">

<h6 className="text-light fw-bold mb-3">
Empresa
</h6>

<ul className="footer-links">

<li>Sobre nosotros</li>
<li>Trabaja con nosotros</li>
<li>Blog</li>
<li>Prensa</li>

</ul>

</div>


{/* SUPPORT */}

<div className="col-lg-3">

<h6 className="text-light fw-bold mb-3">
Soporte
</h6>

<ul className="footer-links">

<li>Centro de ayuda</li>
<li>Contacto</li>
<li>Comunidad</li>

</ul>

</div>

</div>

<hr className="footer-line"/>


{/* BOTTOM */}

<div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-3">

<p className="text-secondary small">

© 2026 LiftyHub. Todos los derechos reservados.

</p>

<div className="d-flex gap-4 small text-secondary">

<span>Política de privacidad</span>
<span>Términos de servicio</span>
<span>Cookies</span>

</div>

</div>

</div>

</footer>

)

}