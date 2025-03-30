import React, { createContext, useContext, useState, useEffect } from "react";

type DeveloperContextType = {
  isDeveloperMode: boolean;
  toggleDeveloperMode: () => void;
  enableDeveloperMode: () => void;
  disableDeveloperMode: () => void;
};

const DeveloperContext = createContext<DeveloperContextType>({
  isDeveloperMode: false,
  toggleDeveloperMode: () => {},
  enableDeveloperMode: () => {},
  disableDeveloperMode: () => {},
});

export const useDeveloperMode = () => useContext(DeveloperContext);

export const DeveloperProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDeveloperMode, setIsDeveloperMode] = useState<boolean>(() => {
    // Check if developer mode was previously enabled
    const savedMode = localStorage.getItem("devMode");
    return savedMode === "true";
  });

  // Save developer mode state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("devMode", isDeveloperMode.toString());
    
    // Log state change for debugging
    console.log(`Developer mode ${isDeveloperMode ? 'enabled' : 'disabled'}`);
    
    // Add a class to the body for global styling when in developer mode
    if (isDeveloperMode) {
      document.body.classList.add('developer-mode');
      // Show a notification to confirm developer mode is active
      const notification = document.createElement('div');
      notification.style.position = 'fixed';
      notification.style.bottom = '80px';
      notification.style.right = '20px';
      notification.style.backgroundColor = '#4CAF50';
      notification.style.color = 'white';
      notification.style.padding = '10px';
      notification.style.borderRadius = '5px';
      notification.style.zIndex = '9999';
      notification.textContent = 'Developer Mode Active';
      document.body.appendChild(notification);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    } else {
      document.body.classList.remove('developer-mode');
    }
  }, [isDeveloperMode]);

  const toggleDeveloperMode = () => {
    console.log("Toggling developer mode");
    setIsDeveloperMode((prev) => {
      const newValue = !prev;
      // Show alert for user feedback
      alert(`Developer mode ${newValue ? 'activated' : 'deactivated'}!`);
      return newValue;
    });
  };

  const enableDeveloperMode = () => {
    setIsDeveloperMode(true);
    alert("Developer mode activated!");
  };

  const disableDeveloperMode = () => {
    setIsDeveloperMode(false);
    alert("Developer mode deactivated!");
  };

  return (
    <DeveloperContext.Provider value={{ 
      isDeveloperMode, 
      toggleDeveloperMode,
      enableDeveloperMode,
      disableDeveloperMode
    }}>
      {children}
      {isDeveloperMode && (
        <div 
          style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            backgroundColor: '#333',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 9999
          }}
        >
          Developer Mode
        </div>
      )}
    </DeveloperContext.Provider>
  );
};
