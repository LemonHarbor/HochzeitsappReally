import React from "react";
import { Button } from "../../../components/ui/button";
import "../landing.css";
import "../mobile.css";

const Contact: React.FC = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-info">
          <h2 className="contact-title">
            Kontaktieren Sie uns
          </h2>
          <p className="contact-description">
            Haben Sie Fragen zu HochzeitsappReally oder benötigen Sie Unterstützung bei der Planung Ihrer Hochzeit? 
            Unser Team steht Ihnen gerne zur Verfügung.
          </p>
          <div className="contact-method">
            <div className="contact-method-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div className="contact-method-content">
              <h3>Telefon</h3>
              <p>+49 (0) 123 456 789</p>
              <p>Mo-Fr, 9:00-18:00 Uhr</p>
            </div>
          </div>
          <div className="contact-method">
            <div className="contact-method-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            </div>
            <div className="contact-method-content">
              <h3>E-Mail</h3>
              <p>info@hochzeitsapp-really.de</p>
              <p>Wir antworten innerhalb von 24 Stunden</p>
            </div>
          </div>
        </div>
        <div className="contact-form">
          <h3 className="contact-form-title">Schreiben Sie uns</h3>
          <form>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  id="name"
                  className="form-input"
                  placeholder="Ihr Name"
                  aria-required="true"
                  autoComplete="name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">E-Mail</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="ihre.email@beispiel.de"
                  aria-required="true"
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="subject" className="form-label">Betreff</label>
              <input
                id="subject"
                className="form-input"
                placeholder="Worum geht es?"
                aria-required="true"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message" className="form-label">Nachricht</label>
              <textarea
                id="message"
                className="form-textarea"
                placeholder="Ihre Nachricht..."
                aria-required="true"
                rows={4}
              ></textarea>
            </div>
            <Button className="btn btn-primary btn-block">Nachricht senden</Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
