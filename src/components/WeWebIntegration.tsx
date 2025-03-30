import React from 'react';
import { useDeveloperMode } from '../lib/developer';

const WeWebIntegration: React.FC = () => {
  const { isDeveloperMode } = useDeveloperMode();

  // Only show WeWeb integration in developer mode
  if (!isDeveloperMode) return null;

  return (
    <div className="weweb-integration">
      <div className="weweb-panel">
        <h3>WeWeb Integration</h3>
        <p>Connect your LemonVows app to WeWeb for no-code editing</p>
        
        <div className="weweb-actions">
          <button 
            className="weweb-connect-btn"
            onClick={() => {
              window.open('https://www.weweb.io/app/login', '_blank');
            }}
          >
            Connect to WeWeb
          </button>
          
          <button
            className="weweb-docs-btn"
            onClick={() => {
              window.open('https://docs.weweb.io/getting-started', '_blank');
            }}
          >
            View WeWeb Documentation
          </button>
        </div>
        
        <div className="weweb-status">
          <p>Status: Not connected</p>
          <p>Last sync: Never</p>
        </div>
      </div>
    </div>
  );
};

export default WeWebIntegration;
