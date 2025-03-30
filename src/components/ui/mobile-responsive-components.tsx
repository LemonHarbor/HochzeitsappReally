import React from "react";
import { useLanguage } from "@/lib/language";

export function MobileResponsiveGrid({ children, columns = { sm: 1, md: 2, lg: 3 } }) {
  return (
    <div className={`grid grid-cols-${columns.sm} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg} gap-4`}>
      {children}
    </div>
  );
}

export function MobileResponsiveGridItem({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      {children}
    </div>
  );
}

export function MobileResponsiveSection({ title, description, children, className = "" }) {
  return (
    <section className={`mb-8 ${className}`}>
      <header className="mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </header>
      {children}
    </section>
  );
}

export function MobileResponsiveButton({ children, icon, className = "", ...props }) {
  return (
    <button 
      className={`flex items-center justify-center px-4 py-2 rounded-md ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

export function MobileResponsiveForm({ children, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {children}
    </form>
  );
}

export function MobileResponsiveFormField({ label, children, error }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

export function MobileResponsiveActionBar({ children, sticky = false, position = "bottom" }) {
  const positionClasses = {
    top: "top-0",
    bottom: "bottom-0"
  };
  
  return (
    <div className={`
      bg-white p-4 border-t flex flex-wrap gap-2 justify-end
      ${sticky ? `sticky ${positionClasses[position]} z-10` : ""}
    `}>
      {children}
    </div>
  );
}

export function MobileResponsiveTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="mb-6">
      <div className="flex overflow-x-auto scrollbar-hide border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`
              px-4 py-2 whitespace-nowrap
              ${activeTab === tab.id ? "border-b-2 border-primary font-medium" : "text-muted-foreground"}
            `}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MobileResponsiveBottomSheet({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onClose}>
      <div 
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
