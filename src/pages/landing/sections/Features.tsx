import React from "react";
import { Check } from "lucide-react";
import "../landing.css";
import "../mobile.css";

const Features: React.FC = () => {
  const features = [
    {
      title: "Gästemanagement & RSVP-Tracking",
      description: "Verwalten Sie Ihre Gästeliste, verfolgen Sie Zu- und Absagen und behalten Sie den Überblick über spezielle Anforderungen.",
      icon: "users"
    },
    {
      title: "Budget-Planung & -Verfolgung",
      description: "Behalten Sie die Kontrolle über Ihre Ausgaben mit detaillierten Budgetkategorien und Echtzeit-Kostenübersicht.",
      icon: "wallet"
    },
    {
      title: "Aufgabenlisten & Zeitpläne",
      description: "Organisieren Sie Ihre To-Dos mit personalisierten Checklisten und Erinnerungen für wichtige Meilensteine.",
      icon: "calendar"
    },
    {
      title: "Lieferantenmanagement & -bewertungen",
      description: "Vergleichen und verwalten Sie Ihre Dienstleister und behalten Sie alle Verträge und Termine im Blick.",
      icon: "store"
    },
    {
      title: "Sitzplatzplanung mit interaktivem Tool",
      description: "Erstellen Sie mühelos Ihre Tischordnung mit unserem intuitiven Drag-and-Drop-Tool.",
      icon: "layout"
    },
    {
      title: "Fotogalerie für Hochzeitsfotos",
      description: "Sammeln und teilen Sie Ihre schönsten Momente in einer privaten Galerie mit Ihren Gästen.",
      icon: "image"
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="features-container">
        <div className="section-header">
          <h2 className="section-title">
            Alles was Sie für Ihre Hochzeitsplanung brauchen
          </h2>
          <p className="section-subtitle">
            HochzeitsappReally bietet alle Werkzeuge, die Sie für eine perfekte Hochzeitsplanung benötigen - 
            übersichtlich und einfach zu bedienen.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
            >
              <div className="feature-icon">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <div className="features-badge">
            <span className="mr-1">✨</span> Neue Funktionen werden regelmäßig hinzugefügt
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
