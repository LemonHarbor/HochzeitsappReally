import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const JGADashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">JGA-Planungsmodul</h1>
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
        <h2 className="text-xl font-semibold mb-4">Willkommen zum JGA-Planungsmodul!</h2>
        <p className="text-gray-600 mb-4">
          Hier können Sie den perfekten Junggesellenabschied planen. Nutzen Sie die verschiedenen Funktionen, 
          um Termine abzustimmen, das Budget zu verwalten, Aktivitäten zu planen und vieles mehr.
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Alle Informationen in diesem Bereich sind vor dem Brautpaar verborgen, sofern Sie dies nicht anders festlegen.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Access Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link to="/jga/date-poll" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">📅</div>
          <h3 className="text-lg font-semibold mb-2">Terminplanung</h3>
          <p className="text-sm text-gray-600 mb-4">Erstellen Sie Terminvorschläge und lassen Sie die Teilnehmer abstimmen</p>
          <span className="text-primary text-sm font-medium">Jetzt planen →</span>
        </Link>
        
        <Link to="/jga/budget" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">💰</div>
          <h3 className="text-lg font-semibold mb-2">Budgetverwaltung</h3>
          <p className="text-sm text-gray-600 mb-4">Verwalten Sie das Budget und teilen Sie die Kosten unter den Teilnehmern auf</p>
          <span className="text-primary text-sm font-medium">Budget verwalten →</span>
        </Link>
        
        <Link to="/jga/activities" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="text-lg font-semibold mb-2">Aktivitätenplanung</h3>
          <p className="text-sm text-gray-600 mb-4">Entdecken Sie Aktivitäten basierend auf Standort und Budget</p>
          <span className="text-primary text-sm font-medium">Aktivitäten entdecken →</span>
        </Link>
        
        <Link to="/jga/tasks" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">✓</div>
          <h3 className="text-lg font-semibold mb-2">Aufgabenverwaltung</h3>
          <p className="text-sm text-gray-600 mb-4">Weisen Sie Aufgaben zu und verfolgen Sie den Fortschritt</p>
          <span className="text-primary text-sm font-medium">Aufgaben verwalten →</span>
        </Link>
        
        <Link to="/jga/surprise-ideas" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">🎁</div>
          <h3 className="text-lg font-semibold mb-2">Überraschungsideen</h3>
          <p className="text-sm text-gray-600 mb-4">Sammeln Sie Ideen für Überraschungen (vor dem Brautpaar verborgen)</p>
          <span className="text-primary text-sm font-medium">Ideen sammeln →</span>
        </Link>
        
        <Link to="/jga/invitations" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">✉️</div>
          <h3 className="text-lg font-semibold mb-2">Einladungen</h3>
          <p className="text-sm text-gray-600 mb-4">Erstellen und verwalten Sie Einladungen für den JGA</p>
          <span className="text-primary text-sm font-medium">Einladungen verwalten →</span>
        </Link>
        
        <Link to="/jga/photos" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">📸</div>
          <h3 className="text-lg font-semibold mb-2">Fotogalerie</h3>
          <p className="text-sm text-gray-600 mb-4">Teilen Sie Fotos vom JGA (optional erst nach der Hochzeit freigeben)</p>
          <span className="text-primary text-sm font-medium">Galerie öffnen →</span>
        </Link>
      </div>
      
      {/* Participants Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Teilnehmer</h2>
          <button className="bg-primary text-white px-4 py-2 rounded-md text-sm">
            Teilnehmer hinzufügen
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rolle
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Beitrag
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Bearbeiten</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                      TM
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        Thomas Müller
                      </div>
                      <div className="text-sm text-gray-500">
                        thomas@example.com
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Zugesagt
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Trauzeuge
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  €150.00
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-primary hover:text-primary-dark">Bearbeiten</a>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 text-white flex items-center justify-center">
                      MS
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        Michael Schmidt
                      </div>
                      <div className="text-sm text-gray-500">
                        michael@example.com
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Ausstehend
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Freund
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  €0.00
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-primary hover:text-primary-dark">Bearbeiten</a>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 text-white flex items-center justify-center">
                      FK
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        Felix Klein
                      </div>
                      <div className="text-sm text-gray-500">
                        felix@example.com
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Zugesagt
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Cousin
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  €120.00
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-primary hover:text-primary-dark">Bearbeiten</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Timeline Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">JGA-Zeitplan</h2>
        
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="relative mb-8">
            <div className="flex items-center mb-2">
              <div className="absolute left-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                1
              </div>
              <div className="ml-16">
                <h3 className="text-lg font-medium">Planung starten</h3>
                <p className="text-sm text-gray-500">Bis 15. Mai 2025</p>
              </div>
            </div>
            <div className="ml-16">
              <p className="text-gray-600">
                Teilnehmer einladen, Termine abstimmen und Budget festlegen
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Erledigt
                </span>
              </div>
            </div>
          </div>
          
          <div className="relative mb-8">
            <div className="flex items-center mb-2">
              <div className="absolute left-0 w-10 h-10 rounded-full bg-gray-300 text-white flex items-center justify-center">
                2
              </div>
              <div className="ml-16">
                <h3 className="text-lg font-medium">Aktivitäten planen</h3>
                <p className="text-sm text-gray-500">Bis 30. Mai 2025</p>
              </div>
            </div>
            <div className="ml-16">
              <p className="text-gray-600">
                Aktivitäten auswählen, Reservierungen vornehmen und Aufgaben zuweisen
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  In Bearbeitung
                </span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="flex items-center mb-2">
              <div className="absolute left-0 w-10 h-10 rounded-full bg-gray-300 text-white flex items-center justify-center">
                3
              </div>
              <div className="ml-16">
                <h3 className="text-lg font-medium">JGA durchführen</h3>
                <p className="text-sm text-gray-500">15. Juni 2025</p>
              </div>
            </div>
            <div className="ml-16">
              <p className="text-gray-600">
                Den großen Tag genießen und unvergessliche Erinnerungen schaffen
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Ausstehend
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JGADashboard;
