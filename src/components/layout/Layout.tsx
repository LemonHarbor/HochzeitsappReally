import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/contexts/AuthContext';

const Layout: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen bg-gray-50">
      {user && <Sidebar />}
      
      <div className={`flex flex-col flex-1 ${user ? 'ml-64' : ''}`}>
        <Header />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
        
        <footer className="p-4 text-center text-sm text-gray-500 border-t">
          <p>&copy; {new Date().getFullYear()} LemonVows by LemonHarbor. Alle Rechte vorbehalten.</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
