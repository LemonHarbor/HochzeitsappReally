import React from "react";
import { useLanguage } from "../../../../src/lib/language";
import { MobileResponsiveTable } from "../../../../src/components/ui/mobile-responsive-table";
import { 
  MobileResponsiveSection, 
  MobileResponsiveGrid, 
  MobileResponsiveGridItem,
  MobileResponsiveButton,
  MobileResponsiveActionBar
} from "../../../../src/components/ui/mobile-responsive-components";

export function MobileOptimizedGuestManager() {
  const { t } = useLanguage();
  
  // Dummy guest data for demonstration
  const guests = [
    { id: 1, name: "Anna & Thomas Schmidt", email: "schmidt@example.com", phone: "+49 123 456789", rsvpStatus: "confirmed", mealPreference: "vegetarian", group: "Familie" },
    { id: 2, name: "Julia Müller", email: "mueller@example.com", phone: "+49 987 654321", rsvpStatus: "pending", mealPreference: "standard", group: "Freunde" },
    { id: 3, name: "Michael Weber", email: "weber@example.com", phone: "+49 555 123456", rsvpStatus: "declined", mealPreference: "vegan", group: "Arbeit" },
  ];
  
  // RSVP status options
  const rsvpStatusOptions = [
    { value: "confirmed", label: t("guests.confirmed"), color: "bg-green-100 text-green-800" },
    { value: "pending", label: t("guests.pending"), color: "bg-yellow-100 text-yellow-800" },
    { value: "declined", label: t("guests.declined"), color: "bg-red-100 text-red-800" },
  ];
  
  // Get color for RSVP status
  const getRsvpStatusColor = (status) => {
    const option = rsvpStatusOptions.find(opt => opt.value === status);
    return option ? option.color : "bg-gray-100 text-gray-800";
  };
  
  // Table columns definition
  const columns = [
    { key: "name", label: t("guests.name") },
    { key: "email", label: t("guests.email") },
    { key: "phone", label: t("guests.phone") },
    { 
      key: "rsvpStatus", 
      label: t("guests.rsvpStatus"),
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRsvpStatusColor(row.rsvpStatus)}`}>
          {t(`guests.${row.rsvpStatus}`)}
        </span>
      )
    },
    { key: "mealPreference", label: t("guests.mealPreference") },
    { key: "group", label: t("guests.group") },
  ];
  
  // Table actions
  const actions = [
    { 
      label: t("guests.edit"), 
      className: "bg-blue-100 text-blue-800", 
      onClick: (row) => console.log("Edit", row) 
    },
    { 
      label: t("guests.delete"), 
      className: "bg-red-100 text-red-800", 
      onClick: (row) => console.log("Delete", row) 
    },
  ];
  
  // State for mobile filter drawer
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  
  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{t("guests.title")}</h1>
        <p className="text-muted-foreground">{t("admin.sections.guests.description")}</p>
      </header>
      
      <MobileResponsiveActionBar position="top" sticky={false}>
        <MobileResponsiveButton 
          icon="+"
          className="bg-primary text-primary-foreground"
        >
          {t("guests.addGuest")}
        </MobileResponsiveButton>
        <MobileResponsiveButton 
          icon="↓"
          className="bg-secondary text-secondary-foreground"
        >
          {t("guests.importGuests")}
        </MobileResponsiveButton>
        <MobileResponsiveButton 
          icon="↑"
          className="bg-secondary text-secondary-foreground"
        >
          {t("guests.exportGuests")}
        </MobileResponsiveButton>
      </MobileResponsiveActionBar>
      
      <div className="my-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input 
                type="text" 
                placeholder={t("guests.searchGuests")} 
                className="w-full px-3 py-2 pl-10 border rounded-md"
              />
              <span className="absolute left-3 top-2.5">🔍</span>
            </div>
          </div>
          <MobileResponsiveButton 
            icon="🔍"
            className="bg-secondary text-secondary-foreground md:hidden"
            onClick={() => setIsFilterOpen(true)}
          >
            {t("common.filter")}
          </MobileResponsiveButton>
        </div>
        
        <MobileResponsiveTable 
          columns={columns}
          data={guests}
          actions={actions}
        />
      </div>
      
      <MobileResponsiveSection 
        title={t("guests.statistics")} 
        description={t("guests.statisticsDescription")}
      >
        <MobileResponsiveGrid columns={{ sm: 1, md: 3, lg: 3 }}>
          <MobileResponsiveGridItem className="bg-green-50">
            <h3 className="text-lg font-semibold mb-2">{t("guests.confirmedGuests")}</h3>
            <p className="text-3xl font-bold">1</p>
          </MobileResponsiveGridItem>
          <MobileResponsiveGridItem className="bg-yellow-50">
            <h3 className="text-lg font-semibold mb-2">{t("guests.pendingGuests")}</h3>
            <p className="text-3xl font-bold">1</p>
          </MobileResponsiveGridItem>
          <MobileResponsiveGridItem className="bg-red-50">
            <h3 className="text-lg font-semibold mb-2">{t("guests.declinedGuests")}</h3>
            <p className="text-3xl font-bold">1</p>
          </MobileResponsiveGridItem>
        </MobileResponsiveGrid>
      </MobileResponsiveSection>
      
      {/* Mobile-specific filter drawer that appears from bottom */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" onClick={() => setIsFilterOpen(false)}>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{t("common.filter")}</h3>
              <button onClick={() => setIsFilterOpen(false)} className="p-1">✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("guests.rsvpStatus")}</label>
                <div className="space-y-2">
                  {rsvpStatusOptions.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input type="checkbox" id={option.value} className="mr-2" />
                      <label htmlFor={option.value}>{option.label}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t("guests.group")}</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="">{t("common.all")}</option>
                  <option value="Familie">Familie</option>
                  <option value="Freunde">Freunde</option>
                  <option value="Arbeit">Arbeit</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t("guests.mealPreference")}</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="">{t("common.all")}</option>
                  <option value="standard">Standard</option>
                  <option value="vegetarian">Vegetarisch</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <button className="px-4 py-2 border rounded-md">{t("common.reset")}</button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">{t("common.apply")}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileOptimizedGuestManager;
