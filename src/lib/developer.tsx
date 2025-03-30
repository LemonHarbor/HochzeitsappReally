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
    const savedMode = localStorage.getItem("developer_mode");
    return savedMode === "true";
  });

  // Save developer mode state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("developer_mode", isDeveloperMode.toString());
    
    // Log state change for debugging
    console.log(`Developer mode ${isDeveloperMode ? 'enabled' : 'disabled'}`);
    
    // Add a class to the body for global styling when in developer mode
    if (isDeveloperMode) {
      document.body.classList.add('developer-mode');
    } else {
      document.body.classList.remove('developer-mode');
    }
  }, [isDeveloperMode]);

  const toggleDeveloperMode = () => {
    setIsDeveloperMode((prev) => !prev);
  };

  const enableDeveloperMode = () => {
    setIsDeveloperMode(true);
  };

  const disableDeveloperMode = () => {
    setIsDeveloperMode(false);
  };

  return (
    <DeveloperContext.Provider value={{ 
      isDeveloperMode, 
      toggleDeveloperMode,
      enableDeveloperMode,
      disableDeveloperMode
    }}>
      {children}
    </DeveloperContext.Provider>
  );
};
