import React, { useEffect } from 'react';

export const ClickInteractionFix = () => {
  useEffect(() => {
    // Remove any potential event blockers
    const removeEventBlockers = () => {
      // Find and remove any overlay elements that might block clicks
      const overlays = document.querySelectorAll('.overlay, .modal-backdrop, [style*="position: fixed"]');
      overlays.forEach(overlay => {
        if (overlay instanceof HTMLElement) {
          overlay.style.pointerEvents = 'none';
        }
      });
      
      // Ensure body and html have proper event handling
      document.body.style.pointerEvents = 'auto';
      document.documentElement.style.pointerEvents = 'auto';
    };
    
    // Run immediately and then periodically to catch dynamically added elements
    removeEventBlockers();
    const interval = setInterval(removeEventBlockers, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return null;
};
