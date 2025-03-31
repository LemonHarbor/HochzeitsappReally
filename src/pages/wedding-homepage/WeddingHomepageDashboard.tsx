import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const WeddingHomepageDashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hochzeitshomepage-Funktion</h1>
        <Link 
          to="/dashboard" 
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Zurück zum Dashboard
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Willkommen zur Hochzeitshomepage-Funktion!</h2>
        <p className="text-gray-600 mb-4">
          Erstellen Sie Ihre eigene Hochzeitswebsite mit unserer intuitiven Homepage-Funktion. 
          Wählen Sie aus verschiedenen Designs, fügen Sie Ihre Informationen hinzu und teilen Sie die Seite mit Ihren Gästen.
        </p>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <a 
            href="https://hochzeitsapp-really.vercel.app/preview/wedding-homepage" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            Vorschau anzeigen
          </a>
          <button 
            className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
            </svg>
            Homepage teilen
          </button>
        </div>
      </div>
      
      {/* Homepage Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Homepage-Status</h2>
          <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
            Veröffentlicht
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Besucher</h3>
              <span className="text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </span>
            </div>
            <p className="text-2xl font-bold">127</p>
            <p className="text-xs text-gray-500 mt-1">+23 in den letzten 7 Tagen</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">RSVP-Antworten</h3>
              <span className="text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </span>
            </div>
            <p className="text-2xl font-bold">42</p>
            <p className="text-xs text-gray-500 mt-1">+12 in den letzten 7 Tagen</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Gästebuch-Einträge</h3>
              <span className="text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </span>
            </div>
            <p className="text-2xl font-bold">18</p>
            <p className="text-xs text-gray-500 mt-1">+5 in den letzten 7 Tagen</p>
          </div>
        </div>
      </div>
      
      {/* Quick Access Modules */}
      <h2 className="text-2xl font-semibold mb-4">Homepage-Funktionen</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link to="/wedding-homepage/design" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">🎨</div>
          <h3 className="text-lg font-semibold mb-2">Design & Themes</h3>
          <p className="text-sm text-gray-600 mb-4">Wählen Sie aus verschiedenen Designs und passen Sie das Erscheinungsbild an</p>
          <span className="text-primary text-sm font-medium">Design anpassen →</span>
        </Link>
        
        <Link to="/wedding-homepage/events" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">📅</div>
          <h3 className="text-lg font-semibold mb-2">Veranstaltungen</h3>
          <p className="text-sm text-gray-600 mb-4">Fügen Sie Informationen zu Ihrer Hochzeit und anderen Veranstaltungen hinzu</p>
          <span className="text-primary text-sm font-medium">Veranstaltungen bearbeiten →</span>
        </Link>
        
        <Link to="/wedding-homepage/map" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">🗺️</div>
          <h3 className="text-lg font-semibold mb-2">Interaktive Karte</h3>
          <p className="text-sm text-gray-600 mb-4">Fügen Sie eine Karte mit Wegbeschreibung zur Location hinzu</p>
          <span className="text-primary text-sm font-medium">Karte bearbeiten →</span>
        </Link>
        
        <Link to="/wedding-homepage/rsvp" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">✉️</div>
          <h3 className="text-lg font-semibold mb-2">RSVP-Formular</h3>
          <p className="text-sm text-gray-600 mb-4">Passen Sie das RSVP-Formular an und verwalten Sie die Antworten</p>
          <span className="text-primary text-sm font-medium">RSVP verwalten →</span>
        </Link>
        
        <Link to="/wedding-homepage/photos" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">📸</div>
          <h3 className="text-lg font-semibold mb-2">Fotogalerie</h3>
          <p className="text-sm text-gray-600 mb-4">Laden Sie Paarfotos hoch und verwalten Sie die Hochzeitsfotos</p>
          <span className="text-primary text-sm font-medium">Galerie verwalten →</span>
        </Link>
        
        <Link to="/wedding-homepage/countdown" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">⏱️</div>
          <h3 className="text-lg font-semibold mb-2">Countdown</h3>
          <p className="text-sm text-gray-600 mb-4">Fügen Sie einen Countdown bis zur Hochzeit hinzu</p>
          <span className="text-primary text-sm font-medium">Countdown anpassen →</span>
        </Link>
        
        <Link to="/wedding-homepage/gifts" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">🎁</div>
          <h3 className="text-lg font-semibold mb-2">Geschenkeliste</h3>
          <p className="text-sm text-gray-600 mb-4">Erstellen und verwalten Sie Ihre Wunschliste</p>
          <span className="text-primary text-sm font-medium">Wunschliste bearbeiten →</span>
        </Link>
        
        <Link to="/wedding-homepage/guestbook" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">📖</div>
          <h3 className="text-lg font-semibold mb-2">Gästebuch</h3>
          <p className="text-sm text-gray-600 mb-4">Verwalten Sie das Gästebuch und die Einträge</p>
          <span className="text-primary text-sm font-medium">Gästebuch verwalten →</span>
        </Link>
        
        <Link to="/wedding-homepage/accommodation" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">🏨</div>
          <h3 className="text-lg font-semibold mb-2">Unterkünfte</h3>
          <p className="text-sm text-gray-600 mb-4">Fügen Sie Informationen zu Übernachtungsmöglichkeiten hinzu</p>
          <span className="text-primary text-sm font-medium">Unterkünfte bearbeiten →</span>
        </Link>
        
        <Link to="/wedding-homepage/faq" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">❓</div>
          <h3 className="text-lg font-semibold mb-2">FAQ-Bereich</h3>
          <p className="text-sm text-gray-600 mb-4">Erstellen und verwalten Sie häufig gestellte Fragen</p>
          <span className="text-primary text-sm font-medium">FAQ bearbeiten →</span>
        </Link>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Letzte Aktivitäten</h2>
        
        <ul className="divide-y divide-gray-200">
          <li className="py-3">
            <div className="flex items-center">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">RSVP</span>
              <p className="ml-3 text-sm">Familie Müller hat zugesagt (3 Personen)</p>
              <span className="ml-auto text-xs text-gray-500">Vor 2 Stunden</span>
            </div>
          </li>
          <li className="py-3">
            <div className="flex items-center">
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Gästebuch</span>
              <p className="ml-3 text-sm">Neuer Eintrag von Lisa und Mark</p>
              <span className="ml-auto text-xs text-gray-500">Vor 1 Tag</span>
            </div>
          </li>
          <li className="py-3">
            <div className="flex items-center">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Geschenk</span>
              <p className="ml-3 text-sm">Kaffeemaschine wurde von Familie Weber reserviert</p>
              <span className="ml-auto text-xs text-gray-500">Vor 2 Tagen</span>
            </div>
          </li>
          <li className="py-3">
            <div className="flex items-center">
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Foto</span>
              <p className="ml-3 text-sm">5 neue Fotos wurden zur Galerie hinzugefügt</p>
              <span className="ml-auto text-xs text-gray-500">Vor 3 Tagen</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WeddingHomepageDashboard;
