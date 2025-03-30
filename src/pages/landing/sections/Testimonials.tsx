import React from "react";
import { Star } from "lucide-react";
import "../landing.css";
import "../mobile.css";

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Julia & Markus",
      role: "Hochzeit im Juni 2024",
      content: "HochzeitsappReally hat unsere Hochzeitsplanung komplett revolutioniert. Besonders das Gästemanagement und die Budgetverfolgung haben uns viel Stress erspart.",
      rating: 5,
      image: "/images/testimonial-couple.jpeg"
    },
    {
      name: "Sarah & Thomas",
      role: "Hochzeit im August 2024",
      content: "Die Sitzplatzplanung war für uns das Highlight der App. Wir konnten verschiedene Szenarien durchspielen und haben die perfekte Anordnung gefunden.",
      rating: 5,
      image: "/images/wedding-couple-sunset.jpeg"
    },
    {
      name: "Laura & Michael",
      role: "Hochzeit im Mai 2024",
      content: "Dank der App konnten wir unsere Hochzeit trotz vollem Arbeitsalltag perfekt organisieren. Die Erinnerungsfunktion hat sichergestellt, dass wir keine wichtigen Termine vergessen haben.",
      rating: 4,
      image: "/images/wedding-hands.jpeg"
    }
  ];

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="testimonials-container">
        <div className="section-header">
          <h2 className="section-title">
            Was unsere Nutzer sagen
          </h2>
          <p className="section-subtitle">
            Erfahren Sie, wie HochzeitsappReally anderen Paaren geholfen hat, ihre perfekte Hochzeit zu planen.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="testimonial-card"
            >
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`star ${i < testimonial.rating ? 'fill-current' : 'text-muted'}`} 
                    size={20}
                  />
                ))}
              </div>
              <p className="testimonial-content">"{testimonial.content}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    loading="lazy"
                    width="48"
                    height="48"
                  />
                </div>
                <div className="testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <div className="testimonials-badge">
            <span className="mr-1">⭐</span> 4.9/5 Durchschnittsbewertung von über 500 Paaren
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
