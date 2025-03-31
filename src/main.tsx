import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './lib/language';
import { BrowserRouter } from 'react-router-dom';
import { DeveloperProvider } from './lib/developer';
import App from './App';
import './index.css';

// Add global click handler to help debug click issues
document.addEventListener('click', (e) => {
  console.log('Click detected at:', e.clientX, e.clientY);
  console.log('Target:', e.target);
}, true);

// Make all elements clickable
const makeElementsClickable = () => {
  const elements = document.querySelectorAll('button, a, input, select, textarea, [role="button"]');
  elements.forEach(el => {
    if (el instanceof HTMLElement) {
      el.style.pointerEvents = 'auto';
      el.style.cursor = 'pointer';
    }
  });
};

// Run on load and periodically
window.addEventListener('load', makeElementsClickable);
setInterval(makeElementsClickable, 2000);

import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <DeveloperProvider>
            <App />
          </DeveloperProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
