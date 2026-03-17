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

Building the world's most intuitive fitness
tracking experience for dedicated athletes.

</p>

<div className="d-flex gap-3 mt-3 social-icons">

<span>🌐</span>
<span>🔍</span>
<span>▶</span>

</div>

</div>


{/* PRODUCT */}

<div className="col-lg-3">

<h6 className="text-light fw-bold mb-3">
Product
</h6>

<ul className="footer-links">

<li>Features</li>
<li>Workouts</li>
<li>Nutrition</li>
<li>Pricing</li>

</ul>

</div>


{/* COMPANY */}

<div className="col-lg-3">

<h6 className="text-light fw-bold mb-3">
Company
</h6>

<ul className="footer-links">

<li>About Us</li>
<li>Careers</li>
<li>Blog</li>
<li>Press Kit</li>

</ul>

</div>


{/* SUPPORT */}

<div className="col-lg-3">

<h6 className="text-light fw-bold mb-3">
Support
</h6>

<ul className="footer-links">

<li>Help Center</li>
<li>Contact Support</li>
<li>Community</li>

</ul>

</div>

</div>

<hr className="footer-line"/>


{/* BOTTOM */}

<div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-3">

<p className="text-secondary small">

© 2024 LiftyHub. All rights reserved.

</p>

<div className="d-flex gap-4 small text-secondary">

<span>Privacy Policy</span>
<span>Terms of Service</span>
<span>Cookies</span>

</div>

</div>

</div>

</footer>

)

}