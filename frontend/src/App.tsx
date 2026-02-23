import './App.css'
import Hero from './components/Hero'
import Features from './components/Features'
import Testimonials from './components/Testimonials'
import QuickStart from './components/QuickStart'
import Integrations from './components/Integrations'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <Hero />
      <Testimonials />
      <QuickStart />
      <Features />
      <Integrations />
      <Footer />
    </div>
  )
}

export default App
