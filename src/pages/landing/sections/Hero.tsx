import React from "react";
import { Button } from "../../../components/ui/button";
import "../landing.css";
import "../mobile.css";

const Hero: React.FC = () => {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Planen Sie Ihre Traumhochzeit mit Leichtigkeit
          </h1>
          <p className="hero-subtitle">
            HochzeitsappReally ist Ihre All-in-One-Lösung für eine stressfreie Hochzeitsplanung. 
            Von der Gästeliste bis zur Sitzordnung - alles in einer intuitiven App.
          </p>
          <div className="hero-buttons">
            <Button className="btn btn-primary btn-lg">
              Kostenlos starten
            </Button>
            <Button variant="outline" className="btn btn-outline btn-lg">
              Demo ansehen
            </Button>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="/images/hero-wedding-couple.jpeg"
            alt="Glückliches Hochzeitspaar mit der HochzeitsappReally"
            className="w-full h-auto object-cover aspect-video"
            loading="eager"
          />
          <div className="hero-badge">
            <div className="hero-badge-dot"></div>
            <span className="text-sm font-medium">98% zufriedene Paare</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
