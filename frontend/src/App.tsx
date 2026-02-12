
import { Contact} from './section/Contact'
import { About } from './section/About.tsx'
import { Experience } from './section/Experience'
import { Hero } from './section/Hero'
import { Projects } from './section/Projects'
import { Testimonials } from './section/Testimonials'
import { Navbar } from './layout/Navbar'
function App() {
  

  return (
    <>
     <div className="min-h-screen overflow-x-hidden">
      <Navbar/>
      <main>
        <Hero/>
        <About/>
        <Projects/>
        <Experience/>
        <Testimonials/>
        <Contact/>


      </main>
     </div>
    </>
  )
}

export default App
