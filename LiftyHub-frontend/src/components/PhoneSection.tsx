export default function PhoneSection(){

const phone =
"https://lh3.googleusercontent.com/aida-public/AB6AXuCNKkISGs5i8Ro7r4DOUWYzkf2dc-rMmSDWNvR8tbspZpZ-PbODJK5CNhxuQhdkqQzsIwXZhWiosVskY3EljyIJwFs9qWUjGptI3_FKsE1O8WB4WoIg59uT1J2aQC-i4JfobtS9pkOaUCXACJmIOwBrJf5vfWOrOIxremCzj7skIsyQr1dbZPbvCB3hRP0673Hvqm7ifQhvUg70OOcx3zd1JVhiEZ3HNGYFHyqMGDhQ8k1iMitN-Y67OU9pn8LMdx3IRXTBpCv01N0"

return(

<section className="app-preview py-5">

<div className="container">

<div className="row align-items-center">


{/* PHONE */}

<div className="col-lg-6 text-center">

<div className="phone-container">

<img
src={phone}
className="img-fluid phone-img"
/>

</div>

</div>


{/* TEXT */}

<div className="col-lg-6">

<h2 className="fw-bold text-light display-6">

Focus on the lift,
<br/>
we'll handle the rest.

</h2>

<p className="text-secondary mt-4 fs-5">

LiftyHub helps you organize your routines,
track progress, and stay consistent.
No more spreadsheets or paper logs.
Just pure performance in the palm
of your hand.

</p>


<ul className="feature-list mt-4">

<li>✔ Automatic rest timers</li>

<li>✔ Offline logging capability</li>

<li>✔ Apple Health & Google Fit sync</li>

</ul>

</div>

</div>

</div>

</section>

)

}