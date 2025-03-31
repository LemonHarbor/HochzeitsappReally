import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Willkommen, {user?.user_metadata?.name || 'Hochzeitsplaner'}!</h2>
        <p className="text-gray-600 mb-4">
          Hier finden Sie eine Übersicht über Ihre Hochzeitsplanung und können schnell auf alle Funktionen zugreifen.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3">Gäste</h3>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold text-primary">42</span>
            <span className="text-sm text-gray-500">von 120 haben zugesagt</span>
          </div>
          <div className="mt-4">
            <Link to="/guests" className="text-primary hover:underline text-sm">Gästeliste verwalten →</Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3">Budget</h3>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold text-primary">€8,450</span>
            <span className="text-sm text-gray-500">von €15,000 ausgegeben</span>
          </div>
          <div className="mt-4">
            <Link to="/budget" className="text-primary hover:underline text-sm">Budget verwalten →</Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3">Aufgaben</h3>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold text-primary">18</span>
            <span className="text-sm text-gray-500">von 32 erledigt</span>
          </div>
          <div className="mt-4">
            <Link to="/tasks" className="text-primary hover:underline text-sm">Aufgaben verwalten →</Link>
          </div>
        </div>
      </div>
      
      {/* Quick Access Modules */}
      <h2 className="text-2xl font-semibold mb-4">Schnellzugriff</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/jga" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">🎉</div>
          <h3 className="text-lg font-semibold mb-2">JGA-Planung</h3>
          <p className="text-sm text-gray-600">Planen Sie den perfekten Junggesellenabschied</p>
        </Link>
        
        <Link to="/wedding-homepage" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">🌐</div>
          <h3 className="text-lg font-semibold mb-2">Hochzeitshomepage</h3>
          <p className="text-sm text-gray-600">Erstellen und verwalten Sie Ihre Hochzeitswebsite</p>
        </Link>
        
        <Link to="/vendors" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">🏢</div>
          <h3 className="text-lg font-semibold mb-2">Dienstleister</h3>
          <p className="text-sm text-gray-600">Verwalten Sie Ihre Hochzeitsdienstleister</p>
        </Link>
        
        <Link to="/seating" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">🪑</div>
          <h3 className="text-lg font-semibold mb-2">Sitzordnung</h3>
          <p className="text-sm text-gray-600">Erstellen Sie Ihre perfekte Tischordnung</p>
        </Link>
      </div>
      
      {/* Recent Activity */}
      <h2 className="text-2xl font-semibold mb-4">Letzte Aktivitäten</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <ul className="divide-y divide-gray-200">
          <li className="py-3">
            <div className="flex items-center">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Gast</span>
              <p className="ml-3 text-sm">Familie Müller hat zugesagt (3 Personen)</p>
              <span className="ml-auto text-xs text-gray-500">Vor 2 Stunden</span>
            </div>
          </li>
          <li className="py-3">
            <div className="flex items-center">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Aufgabe</span>
              <p className="ml-3 text-sm">Blumendekoration bestellt</p>
              <span className="ml-auto text-xs text-gray-500">Vor 1 Tag</span>
            </div>
          </li>
          <li className="py-3">
            <div className="flex items-center">
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">JGA</span>
              <p className="ml-3 text-sm">Neuer Terminvorschlag für den JGA hinzugefügt</p>
              <span className="ml-auto text-xs text-gray-500">Vor 2 Tagen</span>
            </div>
          </li>
          <li className="py-3">
            <div className="flex items-center">
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Budget</span>
              <p className="ml-3 text-sm">Zahlung für Location bestätigt</p>
              <span className="ml-auto text-xs text-gray-500">Vor 3 Tagen</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
