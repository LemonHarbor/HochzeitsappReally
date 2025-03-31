import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/landing';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Willkommen bei LemonVows</h2>
        <p className="mb-4">
          Hallo {user?.email || 'Benutzer'}, willkommen in Ihrer Hochzeitsplanungs-App!
        </p>
        <p className="mb-6">
          Wählen Sie einen der folgenden Bereiche, um mit der Planung zu beginnen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* JGA-Planungsmodul */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-primary text-white p-4">
            <h3 className="text-xl font-semibold">JGA-Planungsmodul</h3>
          </div>
          <div className="p-6">
            <p className="mb-4">
              Planen Sie den perfekten Junggesellenabschied mit Terminplanung, Budgetverwaltung und mehr.
            </p>
            <Link 
              to="/jga" 
              className="block w-full text-center bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
            >
              Zum JGA-Modul
            </Link>
          </div>
        </div>

        {/* Hochzeitshomepage */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-primary text-white p-4">
            <h3 className="text-xl font-semibold">Hochzeitshomepage</h3>
          </div>
          <div className="p-6">
            <p className="mb-4">
              Erstellen Sie Ihre eigene Hochzeitshomepage mit allen wichtigen Informationen für Ihre Gäste.
            </p>
            <Link 
              to="/wedding-homepage" 
              className="block w-full text-center bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
            >
              Zur Homepage-Verwaltung
            </Link>
          </div>
        </div>

        {/* Test-Bereich */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-primary text-white p-4">
            <h3 className="text-xl font-semibold">Test-Bereich</h3>
          </div>
          <div className="p-6">
            <p className="mb-4">
              Testen Sie alle Funktionen der App und überprüfen Sie die Responsivität auf verschiedenen Geräten.
            </p>
            <Link 
              to="/testing" 
              className="block w-full text-center bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
            >
              Zum Test-Bereich
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded"
        >
          Abmelden
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
