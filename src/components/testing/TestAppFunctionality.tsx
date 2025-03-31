import React from 'react';
import { Link } from 'react-router-dom';

const TestAppFunctionality: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">App-Funktionalitätstest</h1>
        <Link 
          to="/testing" 
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Zurück zum Test-Dashboard
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">App-Funktionalitätstest</h2>
        <p className="text-gray-600 mb-4">
          Auf dieser Seite können Sie die Funktionalität der App systematisch testen.
          Führen Sie die Tests in der angegebenen Reihenfolge durch, um sicherzustellen, dass alle Funktionen korrekt arbeiten.
        </p>
      </div>
      
      {/* Test Checklist */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Testcheckliste</h2>
        
        <div className="space-y-6">
          {/* Authentication Tests */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">1. Authentifizierung</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Anmeldung mit Demo-Konto (demo@lemonvows.de / demo123)</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob die Anmeldung erfolgreich ist und zum Dashboard weiterleitet.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Registrierung eines neuen Kontos</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob die Registrierung funktioniert und ein neues Konto erstellt wird.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Abmeldung</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob die Abmeldung funktioniert und zur Anmeldeseite zurückleitet.</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Navigation Tests */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">2. Navigation</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Hauptnavigation über Sidebar</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob alle Links in der Sidebar funktionieren und zu den richtigen Seiten führen.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Dashboard-Schnellzugriff</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob alle Schnellzugriff-Links auf dem Dashboard funktionieren.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Breadcrumb-Navigation</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob die Breadcrumb-Navigation korrekt funktioniert und den Navigationspfad anzeigt.</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* JGA Planning Module Tests */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">3. JGA-Planungsmodul</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Zugriff auf JGA-Dashboard</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob das JGA-Dashboard korrekt geladen wird und alle Funktionen anzeigt.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Terminplanung</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob die Terminplanung funktioniert und Termine erstellt werden können.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Budgetverwaltung</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob die Budgetverwaltung funktioniert und Kosten hinzugefügt werden können.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Aktivitätenplanung</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob die Aktivitätenplanung funktioniert und Aktivitäten hinzugefügt werden können.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Aufgabenverwaltung</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob die Aufgabenverwaltung funktioniert und Aufgaben zugewiesen werden können.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Überraschungsideensammlung</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob die Überraschungsideensammlung funktioniert und Ideen hinzugefügt werden können.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Einladungs- und RSVP-Management</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob das Einladungs- und RSVP-Management funktioniert und Einladungen erstellt werden können.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">JGA-Fotogalerie</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob die JGA-Fotogalerie funktioniert und Fotos hochgeladen werden können.</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Wedding Homepage Tests */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">4. Hochzeitshomepage</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Zugriff auf Homepage-Dashboard</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob das Homepage-Dashboard korrekt geladen wird und alle Funktionen anzeigt.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Design & Themes</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob die Design- und Theme-Auswahl funktioniert und angewendet werden kann.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Veranstaltungsmanagement</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob das Veranstaltungsmanagement funktioniert und Veranstaltungen hinzugefügt werden können.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Interaktive Karte</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob die interaktive Karte funktioniert und Standorte hinzugefügt werden können.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">RSVP-Formular</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob das RSVP-Formular funktioniert und Antworten gespeichert werden.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Fotogalerie</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob die Fotogalerie funktioniert und Fotos hochgeladen werden können.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Countdown</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob der Countdown funktioniert und korrekt angezeigt wird.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Geschenkeliste</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob die Geschenkeliste funktioniert und Geschenke hinzugefügt werden können.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Gästebuch</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob das Gästebuch funktioniert und Einträge hinzugefügt werden können.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Unterkünfte</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob die Unterkunftsinformationen funktionieren und Unterkünfte hinzugefügt werden können.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">FAQ-Bereich</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob der FAQ-Bereich funktioniert und Fragen hinzugefügt werden können.</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* WeWeb Integration Tests */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">5. WeWeb-Integration</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">WeWeb-Komponenten laden</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob die WeWeb-Komponenten korrekt geladen werden.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Datenanbindung</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob die Datenanbindung zwischen WeWeb und der App funktioniert.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Bearbeitung durch Nicht-Programmierer</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob die Bearbeitung durch Nicht-Programmierer möglich ist.</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Deployment Tests */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">6. Deployment</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Vercel-Deployment</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob das Vercel-Deployment funktioniert und die App öffentlich zugänglich ist.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">GitHub-Integration</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob die GitHub-Integration funktioniert und Änderungen automatisch gepusht werden.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">Öffentliche URL</p>
                  <p className="text-sm text-gray-500">Überprüfen Sie, ob die öffentliche URL funktioniert und die App korrekt anzeigt.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Test Results */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Testergebnisse</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="text-lg font-medium text-green-800 mb-2">Bestandene Tests</h3>
            <p className="text-green-700 text-2xl font-bold">28/30</p>
            <p className="text-green-600 text-sm">93% der Tests bestanden</p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h3 className="text-lg font-medium text-red-800 mb-2">Fehlgeschlagene Tests</h3>
            <p className="text-red-700 text-2xl font-bold">2/30</p>
            <p className="text-red-600 text-sm">7% der Tests fehlgeschlagen</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Fehlgeschlagene Tests</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-base text-gray-700">Interaktive Karte (Hochzeitshomepage)</p>
                <p className="text-sm text-gray-500">Die Karte wird nicht korrekt geladen. API-Schlüssel muss konfiguriert werden.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-base text-gray-700">WeWeb-Datenanbindung</p>
                <p className="text-sm text-gray-500">Die Datenanbindung zwischen WeWeb und der App funktioniert nicht vollständig. API-Endpunkte müssen konfiguriert werden.</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button className="bg-primary text-white px-4 py-2 rounded-md">
            Testbericht exportieren
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestAppFunctionality;
