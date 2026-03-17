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

<div className="container">

<h1 className="display-4 fw-bold">
Track your workouts. <br/>
<span style={{color:"#4f8cff"}}>Build your strength.</span>
</h1>

<p className="mt-3">
The ultimate companion for your fitness journey.
</p>

<button className="btn btn-primary me-3">
Download App
</button>

<button className="btn btn-outline-light">
Learn More
</button>

</div>

</div>
)
}

export default Hero