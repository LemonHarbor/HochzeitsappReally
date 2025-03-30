import React from "react";
import { useLanguage } from "../../../../src/lib/language";

export function MobileResponsiveTable({ columns, data, actions = [] }) {
  const { t } = useLanguage();
  const [expandedRow, setExpandedRow] = React.useState(null);
  
  // Function to toggle row expansion on mobile
  const toggleRowExpansion = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };
  
  return (
    <div className="w-full">
      {/* Desktop view - traditional table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left">
                  {column.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-4 py-3 text-left">{t("common.actions")}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-t hover:bg-muted/50">
                {columns.map((column) => (
                  <td key={`${row.id}-${column.key}`} className="px-4 py-3">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      {actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => action.onClick(row)}
                          className={`px-2 py-1 text-xs rounded ${action.className}`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile view - card-based layout */}
      <div className="md:hidden">
        {data.map((row) => (
          <div 
            key={row.id} 
            className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden border"
          >
            <div 
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleRowExpansion(row.id)}
            >
              <div>
                <h3 className="font-medium">
                  {/* Display the first column as the title */}
                  {columns[0].render ? columns[0].render(row) : row[columns[0].key]}
                </h3>
                {/* Display the second column as subtitle if available */}
                {columns.length > 1 && (
                  <p className="text-sm text-muted-foreground">
                    {columns[1].render ? columns[1].render(row) : row[columns[1].key]}
                  </p>
                )}
              </div>
              <span className="text-xl">{expandedRow === row.id ? '▼' : '▶'}</span>
            </div>
            
            {/* Expanded content */}
            {expandedRow === row.id && (
              <div className="border-t p-4">
                <dl className="space-y-2">
                  {/* Skip the first column as it's already shown as the title */}
                  {columns.slice(2).map((column) => (
                    <div key={`mobile-${row.id}-${column.key}`}>
                      <dt className="text-sm text-muted-foreground">{column.label}:</dt>
                      <dd className="font-medium">
                        {column.render ? column.render(row) : row[column.key]}
                      </dd>
                    </div>
                  ))}
                </dl>
                
                {actions.length > 0 && (
                  <div className="mt-4 flex space-x-2">
                    {actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => action.onClick(row)}
                        className={`px-3 py-1 text-sm rounded ${action.className}`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MobileResponsiveTable;
