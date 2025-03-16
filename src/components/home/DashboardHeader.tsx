import React from "react";

interface DashboardHeaderProps {
  title: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title }) => {
  return (
    <header className="py-4">
      <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
    </header>
  );
};
