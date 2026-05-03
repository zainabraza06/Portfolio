import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Layout & Sections
import { Navbar } from './layout/Navbar';
import { Footer } from './layout/Footer';
import { Hero } from './section/Hero';
import { About } from './section/About';
import { Skills } from './section/Skills';
import { Projects } from './section/Projects';
import { Experience } from './section/Experience';
import { Certificates } from './section/Certificates';
import { Hackathons } from './section/Hackathons';
import { Kaggle } from './section/Kaggle';
import { Testimonials } from './section/Testimonials';
import { Contact } from './section/Contact';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Portfolio() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Hackathons />
        <Kaggle />
        <Certificates />
        <Experience />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-[#080d12] text-[#e8edf2] selection:bg-[#20b2a6]/30 font-sans">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
