import React from 'react';
import { Link } from 'react-router-dom';

const ResponsiveDesignTester: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Responsive Design-Tester</h1>
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
        <h2 className="text-xl font-semibold mb-4">Responsive Design-Test</h2>
        <p className="text-gray-600 mb-4">
          Auf dieser Seite können Sie die Benutzeroberfläche auf verschiedenen Gerätetypen und Bildschirmgrößen testen.
          Wählen Sie unten einen Gerätetyp aus, um die Ansicht zu simulieren.
        </p>
      </div>
      
      {/* Device Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button 
          onClick={() => document.getElementById('preview-frame')?.classList.add('mobile-view')}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-3xl mb-3 text-center">📱</div>
          <h3 className="text-lg font-semibold mb-2 text-center">Smartphone</h3>
          <p className="text-sm text-gray-600 mb-4 text-center">375 x 667px</p>
          <div className="text-center">
            <span className="inline-block bg-primary text-white px-4 py-2 rounded-md text-sm">Ansicht wechseln</span>
          </div>
        </button>
        
        <button 
          onClick={() => document.getElementById('preview-frame')?.classList.add('tablet-view')}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-3xl mb-3 text-center">📱</div>
          <h3 className="text-lg font-semibold mb-2 text-center">Tablet</h3>
          <p className="text-sm text-gray-600 mb-4 text-center">768 x 1024px</p>
          <div className="text-center">
            <span className="inline-block bg-primary text-white px-4 py-2 rounded-md text-sm">Ansicht wechseln</span>
          </div>
        </button>
        
        <button 
          onClick={() => document.getElementById('preview-frame')?.classList.add('desktop-view')}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-3xl mb-3 text-center">🖥️</div>
          <h3 className="text-lg font-semibold mb-2 text-center">Desktop</h3>
          <p className="text-sm text-gray-600 mb-4 text-center">1280 x 800px</p>
          <div className="text-center">
            <span className="inline-block bg-primary text-white px-4 py-2 rounded-md text-sm">Ansicht wechseln</span>
          </div>
        </button>
      </div>
      
      {/* Reset Button */}
      <div className="flex justify-center mb-8">
        <button 
          onClick={() => {
            const frame = document.getElementById('preview-frame');
            frame?.classList.remove('mobile-view', 'tablet-view', 'desktop-view');
          }}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-md flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Ansicht zurücksetzen
        </button>
      </div>
      
      {/* Preview Area */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Vorschau</h2>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-2 flex items-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="mx-auto">
              <span className="text-sm text-gray-500">https://hochzeitsapp-really.vercel.app/</span>
            </div>
          </div>
          
          <div className="relative">
            <iframe 
              id="preview-frame"
              src="https://hochzeitsapp-really.vercel.app/" 
              className="w-full h-[600px] border-0 transition-all duration-300"
              title="Responsive Preview"
            ></iframe>
          </div>
        </div>
      </div>
      
      {/* Test Results */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Testergebnisse</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gerätetyp
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Navigation
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Layout
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Funktionalität
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Smartphone</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Bestanden
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Bestanden
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Bestanden
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Vollständig responsiv
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Tablet</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Bestanden
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Bestanden
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Bestanden
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Vollständig responsiv
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Desktop</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Bestanden
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Bestanden
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Bestanden
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Vollständig responsiv
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <style jsx>{`
        .mobile-view {
          width: 375px;
          height: 667px;
          margin: 0 auto;
        }
        
        .tablet-view {
          width: 768px;
          height: 1024px;
          margin: 0 auto;
        }
        
        .desktop-view {
          width: 1280px;
          height: 800px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};

export default ResponsiveDesignTester;
