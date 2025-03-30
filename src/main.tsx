import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { DeveloperProvider } from './lib/developer.tsx'

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DeveloperProvider>
        <App />
      </DeveloperProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
