function Hero(){

const heroImage = "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070"

return(

<div
className="d-flex align-items-center"
style={{
height:"80vh",
backgroundImage:`url(${heroImage})`,
backgroundSize:"cover",
backgroundPosition:"center"
}}
>

<div className="container" style={{textShadow:"0 2px 8px rgba(0,0,0,0.7)"}}>

<span className="section-badge mb-3 d-inline-block">
  TU COMPAÑERO DE ENTRENAMIENTO
</span>

<h1 className="display-4 fw-bold mt-2">
Registra tu progreso. <br/>
<span style={{color:"#4f8cff"}}>Construye tu fuerza.</span>
</h1>

<p className="mt-3 fs-5" style={{maxWidth:"500px", color:"#cbd5e1"}}>
  Rutinas personalizadas, seguimiento de ejercicios,
  plan de dieta y estadísticas en una sola app.
</p>

<div className="d-flex gap-3 mt-4">
  <button className="hero-btn-primary">
    Descargar App
  </button>
  <button className="hero-btn-ghost">
    Ver funciones
  </button>
</div>

<div className="hero-stats mt-5">
  <div className="hero-stat">
    <span className="hero-stat-number">+10K</span>
    <span className="hero-stat-label">Usuarios activos</span>
  </div>
  <div className="hero-stat-divider"/>
  <div className="hero-stat">
    <span className="hero-stat-number">+500</span>
    <span className="hero-stat-label">Rutinas creadas</span>
  </div>
  <div className="hero-stat-divider"/>
  <div className="hero-stat">
    <span className="hero-stat-number">100%</span>
    <span className="hero-stat-label">Gratis para empezar</span>
  </div>
</div>

</div>

</div>
)
}

export default Hero
