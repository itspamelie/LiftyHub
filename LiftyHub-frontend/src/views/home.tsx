import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from "../components/home/Navbar"
import Hero from "../components/home/Hero"
import Features from "../components/home/Features"
import PhoneSection from "../components/home/PhoneSection"
import Training from "../components/home/Training"
import CTA from "../components/home/CTA"
import Footer from "../components/home/Footer"

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