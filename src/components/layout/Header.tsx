import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
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

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold text-primary">
          LemonVows
        </Link>
        
        {!user && (
          <nav className="ml-10 hidden md:flex space-x-6">
            <Link to="/#features" className="text-gray-600 hover:text-primary transition-colors">
              Funktionen
            </Link>
            <Link to="/#pricing" className="text-gray-600 hover:text-primary transition-colors">
              Preise
            </Link>
            <Link to="/#faq" className="text-gray-600 hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link to="/#contact" className="text-gray-600 hover:text-primary transition-colors">
              Kontakt
            </Link>
          </nav>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <div className="hidden md:flex items-center mr-4">
              <span className="text-sm text-gray-600 mr-2">
                Willkommen, {user.displayName || user.email}
              </span>
            </div>
            
            <div className="relative group">
              <button className="flex items-center focus:outline-none">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <Link 
                  to="/dashboard" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profil
                </Link>
                <Link 
                  to="/settings" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Einstellungen
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Abmelden
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Anmelden
            </Link>
            <Link 
              to="/register" 
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
            >
              Kostenlos starten
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
