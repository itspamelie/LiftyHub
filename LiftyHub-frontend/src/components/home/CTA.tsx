import AppleIcon from "@mui/icons-material/Apple";
import AndroidIcon from "@mui/icons-material/Android";

export default function CTA(){
return(

<section className="cta-section py-5">
<div className="container">
<div className="cta-box text-center">

  <span className="cta-badge">DISPONIBLE PRÓXIMAMENTE</span>

  <h2 className="fw-bold text-white display-5 mt-4 mb-3">
    Empieza tu transformación hoy
  </h2>

  <p className="text-secondary fs-5 mx-auto mb-5" style={{maxWidth:"500px"}}>
    Únete a miles de atletas que ya usan LiftyHub para alcanzar sus metas
  </p>

  <div className="cta-stats mb-5">

    <div className="cta-stat">
      <span className="cta-stat-number">+10K</span>
      <span className="cta-stat-label">Usuarios activos</span>
    </div>

    <div className="cta-stat-divider"/>

    <div className="cta-stat">
      <span className="cta-stat-number">+500</span>
      <span className="cta-stat-label">Rutinas creadas</span>
    </div>

    <div className="cta-stat-divider"/>

    <div className="cta-stat">
      <span className="cta-stat-number">+100</span>
      <span className="cta-stat-label">Ejercicios</span>
    </div>

  </div>

  <div className="d-flex justify-content-center gap-3 flex-wrap">

    <button className="cta-store-btn">
      <AppleIcon sx={{fontSize:26}}/>
      <div className="text-start">
        <div className="cta-store-small">Disponible en</div>
        <div className="cta-store-name">App Store</div>
      </div>
    </button>

    <button className="cta-store-btn">
      <AndroidIcon sx={{fontSize:26}}/>
      <div className="text-start">
        <div className="cta-store-small">Disponible en</div>
        <div className="cta-store-name">Google Play</div>
      </div>
    </button>

  </div>

</div>
</div>
</section>

)
}
