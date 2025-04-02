import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="sidebar bg-white shadow-md h-screen w-64 fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-primary">LemonVows</h2>
        <p className="text-sm text-gray-600">Hochzeitsplanung</p>
      </div>
      
      <nav className="mt-4">
        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
          Hauptmenü
        </div>
        <ul>
          <li>
            <Link 
              to="/dashboard" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">📊</span>
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/guests" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">👥</span>
              Gästemanagement
            </Link>
          </li>
          <li>
            <Link 
              to="/budget" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">💰</span>
              Budget
            </Link>
          </li>
          <li>
            <Link 
              to="/vendors" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">🏢</span>
              Dienstleister
            </Link>
          </li>
          <li>
            <Link 
              to="/seating" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">🪑</span>
              Sitzordnung
            </Link>
          </li>
          <li>
            <Link 
              to="/photos" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">📸</span>
              Fotogalerie
            </Link>
          </li>
        </ul>
        
        <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-500 uppercase">
          JGA-Planung
        </div>
        <ul>
          <li>
            <Link 
              to="/jga" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">🎉</span>
              JGA Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/jga/date-poll" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">📅</span>
              Terminplanung
            </Link>
          </li>
          <li>
            <Link 
              to="/jga/budget" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">💸</span>
              JGA-Budget
            </Link>
          </li>
          <li>
            <Link 
              to="/jga/activities" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">🎯</span>
              Aktivitäten
            </Link>
          </li>
          <li>
            <Link 
              to="/jga/tasks" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">✅</span>
              Aufgaben
            </Link>
          </li>
          <li>
            <Link 
              to="/jga/surprise-ideas" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">🎁</span>
              Überraschungen
            </Link>
          </li>
          <li>
            <Link 
              to="/jga/invitations" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">✉️</span>
              Einladungen
            </Link>
          </li>
          <li>
            <Link 
              to="/jga/photos" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">📷</span>
              JGA-Fotos
            </Link>
          </li>
        </ul>
        
        <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-500 uppercase">
          Hochzeitshomepage
        </div>
        <ul>
          <li>
            <Link 
              to="/wedding-homepage" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">🌐</span>
              Homepage Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/wedding-homepage/design" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">🎨</span>
              Design & Themes
            </Link>
          </li>
          <li>
            <Link 
              to="/wedding-homepage/content" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">📝</span>
              Inhalte
            </Link>
          </li>
          <li>
            <Link 
              to="/wedding-homepage/rsvp" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">📨</span>
              RSVP-Formular
            </Link>
          </li>
          <li>
            <Link 
              to="/wedding-homepage/gift-registry" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">🎀</span>
              Geschenkeliste
            </Link>
          </li>
          <li>
            <Link 
              to="/wedding-homepage/guestbook" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">📔</span>
              Gästebuch
            </Link>
          </li>
          <li>
            <Link 
              to="/wedding-homepage/accommodation" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">🏨</span>
              Unterkünfte
            </Link>
          </li>
          <li>
            <Link 
              to="/wedding-homepage/faq" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">❓</span>
              FAQ
            </Link>
          </li>
          <li>
            <Link 
              to="/wedding-homepage/preview" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">👁️</span>
              Vorschau
            </Link>
          </li>
        </ul>
        
        <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-500 uppercase">
          Konto
        </div>
        <ul>
          <li>
            <Link 
              to="/profile" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">👤</span>
              Profil
            </Link>
          </li>
          <li>
            <Link 
              to="/settings" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <span className="mr-2">⚙️</span>
              Einstellungen
            </Link>
          </li>
          <li>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-red-500 hover:text-white transition-colors"
            >
              <span className="mr-2">🚪</span>
              Abmelden
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
