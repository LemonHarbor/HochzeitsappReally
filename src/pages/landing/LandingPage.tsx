import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Menu, X } from "lucide-react";
import "./landing.css";
import "./mobile.css";
import SEO from "../../components/SEO";

// Komponenten für die Landingpage
import Hero from "./sections/Hero";
import Features from "./sections/Features";
import Testimonials from "./sections/Testimonials";
import Pricing from "./sections/Pricing";
import FAQ from "./sections/FAQ";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="landing-page">
      <SEO 
        title="HochzeitsappReally - Ihre perfekte Hochzeitsplanung"
        description="HochzeitsappReally ist Ihre All-in-One-Lösung für eine stressfreie Hochzeitsplanung. Gästemanagement, Budgetplanung, Sitzordnung und mehr."
        keywords="Hochzeitsplanung, Hochzeitsapp, Gästemanagement, Budgetplanung, Hochzeit, Sitzordnung, Gästeliste, Hochzeitsorganisation"
        canonicalUrl="https://hochzeitsapp-really.vercel.app"
      />

      {/* Navigation */}
      <header className="landing-header">
        <div className="container">
          <div className="landing-logo">
            <img 
              src="/icons/icon-144x144.png" 
              alt="HochzeitsappReally Logo" 
            />
            <span>HochzeitsappReally</span>
          </div>
          
          <nav className="landing-nav">
            <a href="#features">Funktionen</a>
            <a href="#testimonials">Erfahrungen</a>
            <a href="#pricing">Preise</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Kontakt</a>
          </nav>
          
          <div className="landing-cta">
            <Link to="/login">
              <Button variant="outline" size="sm">Anmelden</Button>
            </Link>
            <Link to="/login?register=true">
              <Button size="sm">Kostenlos testen</Button>
            </Link>
          </div>

          <button 
            className="mobile-nav-toggle" 
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-links">
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Funktionen</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Erfahrungen</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Preise</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Kontakt</a>
          </div>
          <div className="mobile-nav-cta">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">Anmelden</Button>
            </Link>
            <Link to="/login?register=true" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full">Kostenlos testen</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
