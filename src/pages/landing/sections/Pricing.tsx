import React from "react";
import { Check } from "lucide-react";
import { Button } from "../../../components/ui/button";
import "../landing.css";
import "../mobile.css";

const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Basis",
      price: "0",
      description: "Perfekt für Paare, die gerade mit der Planung beginnen",
      features: [
        "Gästemanagement (bis zu 50 Gäste)",
        "Einfache Budgetverfolgung",
        "Grundlegende Aufgabenlisten",
        "Einfache Sitzplatzplanung",
        "14 Tage Testphase für Premium-Funktionen"
      ],
      cta: "Kostenlos starten",
      popular: false
    },
    {
      name: "Premium",
      price: "9,99",
      description: "Alle Funktionen für eine stressfreie Hochzeitsplanung",
      features: [
        "Unbegrenzte Gästeverwaltung mit RSVP-Tracking",
        "Detaillierte Budgetverfolgung mit Berichten",
        "Erweiterte Aufgabenlisten mit Erinnerungen",
        "Lieferantenmanagement und -bewertungen",
        "Interaktive Sitzplatzplanung",
        "Fotogalerie für Hochzeitsfotos",
        "Prioritäts-Support"
      ],
      cta: "Jetzt upgraden",
      popular: true
    },
    {
      name: "Deluxe",
      price: "19,99",
      description: "Für Paare, die das Maximum aus ihrer Planung herausholen möchten",
      features: [
        "Alle Premium-Funktionen",
        "Persönlicher Hochzeitsplaner-Assistent",
        "Exklusive Design-Vorlagen",
        "Hochzeitswebsite mit eigenem Domain",
        "Unbegrenzte Fotospeicherung",
        "Prioritäts-Support rund um die Uhr"
      ],
      cta: "Deluxe wählen",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="pricing-section">
      <div className="pricing-container">
        <div className="section-header">
          <h2 className="section-title">
            Wählen Sie den passenden Plan für Ihre Traumhochzeit
          </h2>
          <p className="section-subtitle">
            Flexible Preispläne für jedes Budget. Alle Pläne beinhalten eine 14-tägige Geld-zurück-Garantie.
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`pricing-card ${plan.popular ? 'popular' : ''}`}
            >
              {plan.popular && (
                <div className="popular-badge">
                  Beliebteste Wahl
                </div>
              )}
              <div className="pricing-header">
                <h3 className="pricing-name">{plan.name}</h3>
                <div className="pricing-price">
                  <span className="pricing-amount">{plan.price}€</span>
                  <span className="pricing-period">/Monat</span>
                </div>
                <p className="pricing-description">{plan.description}</p>
              </div>
              
              <ul className="pricing-features">
                {plan.features.map((feature, i) => (
                  <li key={i} className="pricing-feature">
                    <span className="pricing-feature-icon"><Check size={16} /></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="pricing-cta">
                <Button 
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'} btn-block`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="pricing-contact">
          <p className="pricing-contact-text">
            Benötigen Sie einen individuellen Plan für Ihre Großveranstaltung?
          </p>
          <a href="#contact" className="pricing-contact-link">
            Kontaktieren Sie uns für ein maßgeschneidertes Angebot
          </a>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
