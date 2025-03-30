import React from "react";
import { Button } from "../../../components/ui/button";

// Mockup für die Landingpage
const LandingPageMockup: React.FC = () => {
  return (
    <div className="mockup-container">
      <h1 className="text-3xl font-bold mb-8 text-center">HochzeitsappReally - Landingpage Mockup</h1>
      
      {/* Hero Section Mockup */}
      <div className="mb-12 p-6 border rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Hero Section</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Planen Sie Ihre Traumhochzeit mit Leichtigkeit</h3>
            <p className="mb-4">HochzeitsappReally ist Ihre All-in-One-Lösung für eine stressfreie Hochzeitsplanung. Von der Gästeliste bis zur Sitzordnung - alles in einer intuitiven App.</p>
            <div className="flex gap-2">
              <Button>Kostenlos starten</Button>
              <Button variant="outline">Demo ansehen</Button>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-2">
            <img 
              src="/images/hero-wedding-couple.jpeg" 
              alt="Hochzeitspaar" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
      
      {/* Features Section Mockup */}
      <div className="mb-12 p-6 border rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Features Section</h2>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold">Alles was Sie für Ihre Hochzeitsplanung brauchen</h3>
          <p>HochzeitsappReally bietet alle Werkzeuge, die Sie für eine perfekte Hochzeitsplanung benötigen.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="w-12 h-12 bg-primary/20 rounded-full mb-2"></div>
            <h4 className="font-bold">Gästemanagement & RSVP-Tracking</h4>
            <p className="text-sm">Verwalten Sie Ihre Gästeliste, verfolgen Sie Zu- und Absagen und behalten Sie den Überblick.</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="w-12 h-12 bg-primary/20 rounded-full mb-2"></div>
            <h4 className="font-bold">Budget-Planung & -Verfolgung</h4>
            <p className="text-sm">Behalten Sie die Kontrolle über Ihre Ausgaben mit detaillierten Budgetkategorien.</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="w-12 h-12 bg-primary/20 rounded-full mb-2"></div>
            <h4 className="font-bold">Aufgabenlisten & Zeitpläne</h4>
            <p className="text-sm">Organisieren Sie Ihre To-Dos mit personalisierten Checklisten und Erinnerungen.</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="w-12 h-12 bg-primary/20 rounded-full mb-2"></div>
            <h4 className="font-bold">Lieferantenmanagement</h4>
            <p className="text-sm">Vergleichen und verwalten Sie Ihre Dienstleister und behalten Sie alle Verträge im Blick.</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="w-12 h-12 bg-primary/20 rounded-full mb-2"></div>
            <h4 className="font-bold">Sitzplatzplanung</h4>
            <p className="text-sm">Erstellen Sie mühelos Ihre Tischordnung mit unserem intuitiven Drag-and-Drop-Tool.</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="w-12 h-12 bg-primary/20 rounded-full mb-2"></div>
            <h4 className="font-bold">Fotogalerie</h4>
            <p className="text-sm">Sammeln und teilen Sie Ihre schönsten Momente in einer privaten Galerie mit Ihren Gästen.</p>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section Mockup */}
      <div className="mb-12 p-6 border rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Testimonials Section</h2>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold">Was unsere Nutzer sagen</h3>
          <p>Erfahren Sie, wie HochzeitsappReally anderen Paaren geholfen hat.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-yellow-400">★</span>
              ))}
            </div>
            <p className="italic mb-4">"HochzeitsappReally hat unsere Hochzeitsplanung komplett revolutioniert. Besonders das Gästemanagement und die Budgetverfolgung haben uns viel Stress erspart."</p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-2">
                <img 
                  src="/images/testimonial-couple.jpeg" 
                  alt="Testimonial" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <p className="font-bold">Julia & Markus</p>
                <p className="text-sm">Hochzeit im Juni 2024</p>
              </div>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-yellow-400">★</span>
              ))}
            </div>
            <p className="italic mb-4">"Die Sitzplatzplanung war für uns das Highlight der App. Wir konnten verschiedene Szenarien durchspielen und haben die perfekte Anordnung gefunden."</p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-2">
                <img 
                  src="/images/wedding-couple-sunset.jpeg" 
                  alt="Testimonial" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <p className="font-bold">Sarah & Thomas</p>
                <p className="text-sm">Hochzeit im August 2024</p>
              </div>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex mb-2">
              {[1, 2, 3, 4].map((star) => (
                <span key={star} className="text-yellow-400">★</span>
              ))}
              <span className="text-gray-300">★</span>
            </div>
            <p className="italic mb-4">"Dank der App konnten wir unsere Hochzeit trotz vollem Arbeitsalltag perfekt organisieren. Die Erinnerungsfunktion hat sichergestellt, dass wir keine wichtigen Termine vergessen haben."</p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-2"></div>
              <div>
                <p className="font-bold">Laura & Michael</p>
                <p className="text-sm">Hochzeit im Mai 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pricing Section Mockup */}
      <div className="mb-12 p-6 border rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Pricing Section</h2>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold">Wählen Sie den passenden Plan für Ihre Traumhochzeit</h3>
          <p>Flexible Preispläne für jedes Budget. Alle Pläne beinhalten eine 14-tägige Geld-zurück-Garantie.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-bold text-lg">Basis</h4>
            <div className="my-2">
              <span className="text-2xl font-bold">0€</span>
              <span>/Monat</span>
            </div>
            <p className="text-sm mb-4">Perfekt für Paare, die gerade mit der Planung beginnen</p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Gästemanagement (bis zu 50 Gäste)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Einfache Budgetverfolgung</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Grundlegende Aufgabenlisten</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Einfache Sitzplatzplanung</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>14 Tage Testphase für Premium-Funktionen</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full">Kostenlos starten</Button>
          </div>
          <div className="p-4 border-2 border-primary rounded-lg relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs py-1 px-2 rounded-full">
              Beliebteste Wahl
            </div>
            <h4 className="font-bold text-lg">Premium</h4>
            <div className="my-2">
              <span className="text-2xl font-bold">9,99€</span>
              <span>/Monat</span>
            </div>
            <p className="text-sm mb-4">Alle Funktionen für eine stressfreie Hochzeitsplanung</p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Unbegrenzte Gästeverwaltung mit RSVP-Tracking</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Detaillierte Budgetverfolgung mit Berichten</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Erweiterte Aufgabenlisten mit Erinnerungen</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Lieferantenmanagement und -bewertungen</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Interaktive Sitzplatzplanung</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Fotogalerie für Hochzeitsfotos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Prioritäts-Support</span>
              </li>
            </ul>
            <Button className="w-full">Jetzt upgraden</Button>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-bold text-lg">Deluxe</h4>
            <div className="my-2">
              <span className="text-2xl font-bold">19,99€</span>
              <span>/Monat</span>
            </div>
            <p className="text-sm mb-4">Für Paare, die das Maximum aus ihrer Planung herausholen möchten</p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Alle Premium-Funktionen</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Persönlicher Hochzeitsplaner-Assistent</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Exklusive Design-Vorlagen</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Hochzeitswebsite mit eigenem Domain</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Unbegrenzte Fotospeicherung</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Prioritäts-Support rund um die Uhr</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full">Deluxe wählen</Button>
          </div>
        </div>
      </div>
      
      {/* FAQ Section Mockup */}
      <div className="mb-12 p-6 border rounded-lg">
        <h2 className="text-2xl font-bold mb-4">FAQ Section</h2>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold">Häufig gestellte Fragen</h3>
          <p>Antworten auf die häufigsten Fragen zu HochzeitsappReally</p>
        </div>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold">Wie beginne ich mit der Nutzung von HochzeitsappReally?</h4>
              <span>▼</span>
            </div>
            <p className="mt-2">Sie können sich kostenlos registrieren und sofort mit der Basis-Version beginnen. Füllen Sie einfach das Registrierungsformular aus, bestätigen Sie Ihre E-Mail-Adresse und schon können Sie mit der Planung Ihrer Hochzeit starten.</p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold">Kann ich die App auch auf meinem Smartphone nutzen?</h4>
              <span>▼</span>
            </div>
            <p className="mt-2">Ja, HochzeitsappReally ist vollständig für mobile Geräte optimiert. Sie können die App im Browser Ihres Smartphones nutzen oder unsere native App für iOS und Android herunterladen.</p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold">Wie funktioniert das RSVP-Tracking?</h4>
              <span>▼</span>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold">Kann ich zwischen den Preisplänen wechseln?</h4>
              <span>▼</span>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold">Wie sicher sind meine Daten?</h4>
              <span>▼</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Section Mockup */}
      <div className="mb-12 p-6 border rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Contact Section</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-4">Kontaktieren Sie uns</h3>
            <p className="mb-4">Haben Sie Fragen zu HochzeitsappReally oder benötigen Sie Unterstützung bei der Planung Ihrer Hochzeit? Unser Team steht Ihnen gerne zur Verfügung.</p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4 text-primary">📞</div>
                <div>
                  <h4 className="font-bold">Telefon</h4>
                  <p>+49 (0) 123 456 789</p>
                  <p className="text-sm">Mo-Fr, 9:00-18:00 Uhr</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 text-primary">✉️</div>
                <div>
                  <h4 className="font-bold">E-Mail</h4>
                  <p>info@hochzeitsapp-really.de</p>
                  <p className="text-sm">Wir antworten innerhalb von 24 Stunden</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-4">Schreiben Sie uns</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Name</label>
                  <input type="text" className="w-full border rounded p-2" placeholder="Ihr Name" />
                </div>
                <div>
                  <label className="block text-sm mb-1">E-Mail</label>
                  <input type="email" className="w-full border rounded p-2" placeholder="ihre.email@beispiel.de" />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Betreff</label>
                <input type="text" className="w-full border rounded p-2" placeholder="Worum geht es?" />
              </div>
              <div>
                <label className="block text-sm mb-1">Nachricht</label>
                <textarea className="w-full border rounded p-2 h-24" placeholder="Ihre Nachricht..."></textarea>
              </div>
              <Button className="w-full">Nachricht senden</Button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Footer Section Mockup */}
      <div className="p-6 border rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Footer Section</h2>
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary/20 rounded-full"></div>
              <span className="font-bold">HochzeitsappReally</span>
            </div>
            <p className="text-sm mb-4">Ihre All-in-One-Lösung für eine stressfreie und perfekt organisierte Hochzeitsplanung.</p>
            <div className="flex space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Funktionen</h3>
            <ul className="space-y-2 text-sm">
              <li>Gästemanagement</li>
              <li>Budget-Planung</li>
              <li>Aufgabenlisten</li>
              <li>Lieferantenmanagement</li>
              <li>Sitzplatzplanung</li>
              <li>Fotogalerie</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Unternehmen</h3>
            <ul className="space-y-2 text-sm">
              <li>Über uns</li>
              <li>Blog</li>
              <li>Karriere</li>
              <li>Kundenstimmen</li>
              <li>Kontakt</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Rechtliches</h3>
            <ul className="space-y-2 text-sm">
              <li>Datenschutz</li>
              <li>AGB</li>
              <li>Impressum</li>
              <li>Cookie-Einstellungen</li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-4 flex justify-between items-center">
          <p className="text-sm">© 2025 HochzeitsappReally. Alle Rechte vorbehalten.</p>
          <div>
            <span className="text-sm mr-4">Anmelden</span>
            <span className="text-sm">Registrieren</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageMockup;
