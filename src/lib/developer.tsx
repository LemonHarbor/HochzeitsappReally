import React, { createContext, useContext, useState, useEffect } from "react";

type DeveloperContextType = {
  isDeveloperMode: boolean;
  toggleDeveloperMode: () => void;
};

const DeveloperContext = createContext<DeveloperContextType>({
  isDeveloperMode: false,
  toggleDeveloperMode: () => {},
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
  }, [isDeveloperMode]);

  const toggleDeveloperMode = () => {
    setIsDeveloperMode((prev) => !prev);
  };

  return (
    <DeveloperContext.Provider value={{ isDeveloperMode, toggleDeveloperMode }}>
      {children}
    </DeveloperContext.Provider>
  );
};
