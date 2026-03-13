import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Features from "../components/Features"
import PhoneSection from "../components/PhoneSection"
import Training from "../components/Training"
import CTA from "../components/CTA"
import Footer from "../components/Footer"

function Home() {
  return (
    <div style={{background:"#0b0f14", color:"white"}}>
      <Navbar/>
      <Hero/>
      <Features/>
      <PhoneSection/>
      <Training/>
      <CTA/>
      <Footer/>
    </div>
  )
}

export default Home