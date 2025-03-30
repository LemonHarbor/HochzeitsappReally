import React from "react";
import { useLanguage } from "@/lib/language";

export function TablePlanner() {
  const { t } = useLanguage();
  
  // Dummy table data for demonstration
  const tables = [
    { id: 1, name: "Tisch 1", capacity: 8, shape: "round", assignedGuests: 6 },
    { id: 2, name: "Tisch 2", capacity: 8, shape: "round", assignedGuests: 4 },
    { id: 3, name: "Tisch 3", capacity: 6, shape: "rectangular", assignedGuests: 5 },
    { id: 4, name: "Ehrentisch", capacity: 10, shape: "rectangular", assignedGuests: 8 },
  ];
  
  // Dummy unassigned guests
  const unassignedGuests = [
    { id: 1, name: "Max Mustermann" },
    { id: 2, name: "Erika Musterfrau" },
    { id: 3, name: "Peter Schmidt" },
  ];
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("tables.title")}</h1>
        <p className="text-muted-foreground">{t("admin.sections.tables.description")}</p>
      </header>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md">
          <span className="mr-2">+</span> {t("tables.addTable")}
        </button>
        <button className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md">
          <span className="mr-2">💾</span> {t("tables.saveLayout")}
        </button>
        <button className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md">
          <span className="mr-2">📂</span> {t("tables.loadLayout")}
        </button>
        <button className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md">
          <span className="mr-2">🔄</span> {t("tables.resetLayout")}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t("tables.title")}</h2>
          <div className="relative w-full h-[400px] border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
            <div className="text-center p-6">
              <p className="text-muted-foreground mb-4">{t("admin.tablePlannerCanvas")}</p>
              <p className="text-sm text-muted-foreground">{t("admin.dragAndDropTables")}</p>
            </div>
            
            {/* Table visualization would be implemented here with drag-and-drop functionality */}
            {tables.map((table) => (
              <div 
                key={table.id}
                className="absolute bg-white border rounded-lg shadow-sm p-3 cursor-move"
                style={{ 
                  width: table.shape === "round" ? "100px" : "150px",
                  height: table.shape === "round" ? "100px" : "80px",
                  borderRadius: table.shape === "round" ? "50%" : "4px",
                  top: `${50 + (table.id * 30)}px`,
                  left: `${50 + (table.id * 40)}px`,
                }}
              >
                <div className="text-center">
                  <p className="font-medium text-sm">{table.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {table.assignedGuests}/{table.capacity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t("tables.unassignedGuests")}</h2>
          <div className="space-y-2 mb-4">
            {unassignedGuests.map((guest) => (
              <div 
                key={guest.id}
                className="bg-gray-50 p-3 rounded-md flex justify-between items-center cursor-move"
              >
                <span>{guest.name}</span>
                <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {t("admin.assign")}
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">{t("tables.tableType")}</h3>
            <div className="flex space-x-2 mb-4">
              <button className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm">
                {t("tables.round")}
              </button>
              <button className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                {t("tables.rectangular")}
              </button>
              <button className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                {t("tables.custom")}
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("tables.tableName")}</label>
                <input type="text" className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("tables.capacity")}</label>
                <input type="number" min="1" className="w-full px-3 py-2 border rounded-md" />
              </div>
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md">
                {t("common.add")}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">{t("admin.tableList")}</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">{t("tables.tableName")}</th>
                <th className="px-4 py-3 text-left">{t("tables.capacity")}</th>
                <th className="px-4 py-3 text-left">{t("tables.assignedGuests")}</th>
                <th className="px-4 py-3 text-left">{t("tables.tableType")}</th>
                <th className="px-4 py-3 text-left">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((table) => (
                <tr key={table.id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3">{table.name}</td>
                  <td className="px-4 py-3">{table.capacity}</td>
                  <td className="px-4 py-3">{table.assignedGuests}</td>
                  <td className="px-4 py-3">{t(`tables.${table.shape}`)}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {t("common.edit")}
                      </button>
                      <button className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                        {t("common.delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TablePlanner;
