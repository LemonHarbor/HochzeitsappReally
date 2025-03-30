import React from "react";
import { Link } from "react-router-dom";
import "../landing.css";
import "../mobile.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <img 
                src="/icons/icon-144x144.png" 
                alt="HochzeitsappReally Logo" 
                className="h-8 w-8" 
                loading="lazy"
                width="32"
                height="32"
              />
              <span>HochzeitsappReally</span>
            </div>
            <p className="footer-description">
              Ihre All-in-One-Lösung für eine stressfreie und perfekt organisierte Hochzeitsplanung.
            </p>
            <div className="footer-social">
              <a href="#" className="footer-social-link" aria-label="Facebook">
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
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="footer-social-link" aria-label="Instagram">
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
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="footer-social-link" aria-label="Twitter">
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
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="footer-social-link" aria-label="LinkedIn">
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
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
          <div className="footer-links">
            <h3>Funktionen</h3>
            <ul>
              <li>
                <a href="#features">Gästemanagement</a>
              </li>
              <li>
                <a href="#features">Budget-Planung</a>
              </li>
              <li>
                <a href="#features">Aufgabenlisten</a>
              </li>
              <li>
                <a href="#features">Lieferantenmanagement</a>
              </li>
              <li>
                <a href="#features">Sitzplatzplanung</a>
              </li>
              <li>
                <a href="#features">Fotogalerie</a>
              </li>
            </ul>
          </div>
          <div className="footer-links">
            <h3>Unternehmen</h3>
            <ul>
              <li>
                <a href="#">Über uns</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Karriere</a>
              </li>
              <li>
                <a href="#testimonials">Kundenstimmen</a>
              </li>
              <li>
                <a href="#contact">Kontakt</a>
              </li>
            </ul>
          </div>
          <div className="footer-links">
            <h3>Rechtliches</h3>
            <ul>
              <li>
                <a href="#">Datenschutz</a>
              </li>
              <li>
                <a href="#">AGB</a>
              </li>
              <li>
                <a href="#">Impressum</a>
              </li>
              <li>
                <a href="#">Cookie-Einstellungen</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} HochzeitsappReally. Alle Rechte vorbehalten.
          </p>
          <div className="footer-bottom-links">
            <Link to="/login" className="footer-bottom-link">
              Anmelden
            </Link>
            <Link to="/login?register=true" className="footer-bottom-link">
              Registrieren
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
