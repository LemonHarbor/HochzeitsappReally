import React from "react";
import { ChevronDown } from "lucide-react";
import "../landing.css";
import "../mobile.css";

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "Wie beginne ich mit der Nutzung von HochzeitsappReally?",
      answer: "Sie können sich kostenlos registrieren und sofort mit der Basis-Version beginnen. Füllen Sie einfach das Registrierungsformular aus, bestätigen Sie Ihre E-Mail-Adresse und schon können Sie mit der Planung Ihrer Hochzeit starten."
    },
    {
      question: "Kann ich die App auch auf meinem Smartphone nutzen?",
      answer: "Ja, HochzeitsappReally ist vollständig für mobile Geräte optimiert. Sie können die App im Browser Ihres Smartphones nutzen oder unsere native App für iOS und Android herunterladen."
    },
    {
      question: "Wie funktioniert das RSVP-Tracking?",
      answer: "Sie können personalisierte Einladungslinks an Ihre Gäste senden. Über diese Links können Ihre Gäste ihre Teilnahme bestätigen oder absagen, Essensvorlieben angeben und weitere Informationen mitteilen. Sie sehen alle Antworten in Echtzeit in Ihrem Dashboard."
    },
    {
      question: "Kann ich zwischen den Preisplänen wechseln?",
      answer: "Ja, Sie können jederzeit zwischen den Preisplänen wechseln. Wenn Sie von einem höheren zu einem niedrigeren Plan wechseln, bleibt der höhere Plan bis zum Ende des Abrechnungszeitraums aktiv."
    },
    {
      question: "Wie sicher sind meine Daten?",
      answer: "Die Sicherheit Ihrer Daten hat für uns höchste Priorität. Wir verwenden modernste Verschlüsselungstechnologien und speichern alle Daten auf sicheren Servern in Deutschland. Ihre Daten werden niemals ohne Ihre Zustimmung an Dritte weitergegeben."
    },
    {
      question: "Kann ich die App auch nach der Hochzeit noch nutzen?",
      answer: "Natürlich! Viele Paare nutzen HochzeitsappReally auch nach ihrer Hochzeit, um Fotos mit Gästen zu teilen, Danksagungen zu organisieren oder einfach als Erinnerung an ihren besonderen Tag. Ihr Konto bleibt aktiv, solange Sie es wünschen."
    }
  ];

  return (
    <section id="faq" className="faq-section">
      <div className="faq-container">
        <div className="section-header">
          <h2 className="section-title">
            Häufig gestellte Fragen
          </h2>
          <p className="section-subtitle">
            Antworten auf die häufigsten Fragen zu HochzeitsappReally
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details 
              key={index} 
              className="faq-item"
            >
              <summary className="faq-question">
                {faq.question}
                <ChevronDown className="faq-icon" size={20} />
              </summary>
              <div className="faq-answer">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        <div className="faq-more">
          <p className="faq-more-text">
            Haben Sie weitere Fragen?
          </p>
          <a href="#contact" className="faq-more-link">
            Kontaktieren Sie unser Support-Team
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
