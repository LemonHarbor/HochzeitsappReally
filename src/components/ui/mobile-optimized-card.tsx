import React from "react";
import { useLanguage } from "@/lib/language";

export function MobileOptimizedCard({ title, children, icon, className = "" }) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden mb-4 ${className}`}>
      {/* Card header - always visible */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          {icon && <span className="text-xl mr-3">{icon}</span>}
          <h3 className="font-medium">{title}</h3>
        </div>
        <span className="text-xl">{isExpanded ? '▼' : '▶'}</span>
      </div>
      
      {/* Card content - only visible when expanded on mobile */}
      <div className={`border-t ${isExpanded ? 'block' : 'hidden md:block'}`}>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default MobileOptimizedCard;
