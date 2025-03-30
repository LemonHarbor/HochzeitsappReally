import React from "react";
import { useLanguage } from "@/lib/language";

export function VendorManager() {
  const { t } = useLanguage();
  
  // Dummy vendor data for demonstration
  const vendors = [
    { id: 1, name: "Schloss Schönbrunn", category: "venue", contact: "Herr Müller", phone: "+43 123 456789", email: "schloss@example.com", website: "www.schloss-schoenbrunn.at", price: 5000, notes: "Historischer Veranstaltungsort", status: "booked" },
    { id: 2, name: "Gourmet Catering", category: "catering", contact: "Frau Schmidt", phone: "+43 987 654321", email: "catering@example.com", website: "www.gourmet-catering.at", price: 80, notes: "Preis pro Person", status: "booked" },
    { id: 3, name: "Foto Schmidt", category: "photography", contact: "Herr Schmidt", phone: "+43 555 123456", email: "foto@example.com", website: "www.foto-schmidt.at", price: 1500, notes: "Inkl. Fotoalbum", status: "booked" },
    { id: 4, name: "Blumen Meyer", category: "flowers", contact: "Frau Meyer", phone: "+43 444 789123", email: "blumen@example.com", website: "www.blumen-meyer.at", price: 800, notes: "Brautstrauß, Tischdeko, Anstecker", status: "contacted" },
    { id: 5, name: "DJ Beats", category: "music", contact: "DJ Mike", phone: "+43 333 456789", email: "dj@example.com", website: "www.dj-beats.at", price: 1200, notes: "Inkl. Lichtanlage", status: "pending" },
  ];
  
  // Status options
  const statusOptions = [
    { value: "booked", label: t("vendors.booked"), color: "bg-green-100 text-green-800" },
    { value: "contacted", label: t("vendors.contacted"), color: "bg-blue-100 text-blue-800" },
    { value: "pending", label: t("vendors.pending"), color: "bg-yellow-100 text-yellow-800" },
    { value: "rejected", label: t("vendors.rejected"), color: "bg-red-100 text-red-800" },
  ];
  
  // Get color for status
  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : "bg-gray-100 text-gray-800";
  };
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("vendors.title")}</h1>
        <p className="text-muted-foreground">{t("admin.sections.vendors.description")}</p>
      </header>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md">
          <span className="mr-2">+</span> {t("vendors.addVendor")}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statusOptions.map((status) => (
          <div 
            key={status.value}
            className={`${status.color.split(' ')[0].replace('text', 'bg')} rounded-lg p-6 shadow-sm`}
          >
            <h3 className="text-xl font-semibold mb-2">{status.label}</h3>
            <p className="text-4xl font-bold">
              {vendors.filter(v => v.status === status.value).length}
            </p>
          </div>
        ))}
      </div>
      
      <div className="bg-card rounded-lg shadow overflow-hidden mb-8">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <input 
              type="text" 
              placeholder={t("common.search")} 
              className="px-3 py-2 border rounded-md w-full max-w-md"
            />
            <button className="ml-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md">
              {t("common.search")}
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">{t("vendors.name")}</th>
                <th className="px-4 py-3 text-left">{t("vendors.category")}</th>
                <th className="px-4 py-3 text-left">{t("vendors.contact")}</th>
                <th className="px-4 py-3 text-left">{t("vendors.price")}</th>
                <th className="px-4 py-3 text-left">{t("vendors.status")}</th>
                <th className="px-4 py-3 text-left">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3">{vendor.name}</td>
                  <td className="px-4 py-3">{t(`budget.categories.${vendor.category}`)}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div>{vendor.contact}</div>
                      <div className="text-xs text-muted-foreground">{vendor.phone}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{vendor.price} €</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
                      {t(`vendors.${vendor.status}`)}
                    </span>
                  </td>
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
      
      <div className="bg-card rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">{t("admin.addVendor")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("vendors.name")}</label>
                <input type="text" className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("vendors.category")}</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  {Object.keys(t("budget.categories", { returnObjects: true })).map((category) => (
                    <option key={category} value={category}>
                      {t(`budget.categories.${category}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("vendors.contact")}</label>
                <input type="text" className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("vendors.phone")}</label>
                <input type="tel" className="w-full px-3 py-2 border rounded-md" />
              </div>
            </div>
          </div>
          
          <div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("vendors.email")}</label>
                <input type="email" className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("vendors.website")}</label>
                <input type="url" className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("vendors.price")}</label>
                <input type="number" className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("vendors.notes")}</label>
                <textarea className="w-full px-3 py-2 border rounded-md"></textarea>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
            {t("common.add")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VendorManager;
