import React from "react";
import { useLanguage } from "../../../../src/lib/language";

export function WeddingTimeline() {
  const { t } = useLanguage();
  
  // Dummy timeline data for demonstration
  const events = [
    { id: 1, name: "Standesamt", startTime: "10:00", endTime: "11:00", location: "Rathaus", description: "Standesamtliche Trauung", responsible: "Brautpaar" },
    { id: 2, name: "Sektempfang", startTime: "11:30", endTime: "13:00", location: "Schlossgarten", description: "Sektempfang mit kleinen Häppchen", responsible: "Catering" },
    { id: 3, name: "Kirchliche Trauung", startTime: "14:00", endTime: "15:30", location: "St. Marien Kirche", description: "Kirchliche Trauungszeremonie", responsible: "Pfarrer Schmidt" },
    { id: 4, name: "Fotoshooting", startTime: "15:45", endTime: "17:00", location: "Schlosspark", description: "Fotoshooting mit dem Brautpaar und Familie", responsible: "Fotograf" },
    { id: 5, name: "Abendempfang", startTime: "18:00", endTime: "19:30", location: "Festsaal", description: "Empfang der Abendgäste", responsible: "Trauzeugen" },
    { id: 6, name: "Dinner", startTime: "19:30", endTime: "21:30", location: "Festsaal", description: "Festliches Abendessen", responsible: "Catering" },
    { id: 7, name: "Party", startTime: "22:00", endTime: "02:00", location: "Festsaal", description: "Tanz und Feier", responsible: "DJ" },
  ];
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("timeline.title")}</h1>
        <p className="text-muted-foreground">{t("admin.sections.timeline.description")}</p>
      </header>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md">
          <span className="mr-2">+</span> {t("timeline.addEvent")}
        </button>
        <button className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md">
          <span className="mr-2">💾</span> {t("timeline.saveTimeline")}
        </button>
        <button className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md">
          <span className="mr-2">🖨️</span> {t("timeline.printTimeline")}
        </button>
        <button className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md">
          <span className="mr-2">📤</span> {t("timeline.shareTimeline")}
        </button>
      </div>
      
      <div className="bg-card rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{t("admin.weddingDate")}</h2>
        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium mb-1">{t("settings.weddingDate")}</label>
            <input type="date" className="px-3 py-2 border rounded-md" />
          </div>
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium mb-1">{t("settings.weddingLocation")}</label>
            <input type="text" className="px-3 py-2 border rounded-md" placeholder={t("timeline.location")} />
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg shadow overflow-hidden mb-8">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t("admin.timelineSchedule")}</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              {t("admin.expandAll")}
            </button>
            <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              {t("admin.collapseAll")}
            </button>
          </div>
        </div>
        
        <div className="relative pl-8 pr-4 py-4 border-l-4 border-primary">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {/* Timeline events */}
          {events.map((event, index) => (
            <div key={event.id} className="mb-8 relative">
              {/* Time marker */}
              <div className="absolute left-[-24px] w-5 h-5 rounded-full bg-primary border-4 border-white"></div>
              
              {/* Event card */}
              <div className="ml-6 bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{event.name}</h3>
                  <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                    {event.startTime} - {event.endTime}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("timeline.location")}:</p>
                    <p className="font-medium">{event.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("timeline.responsible")}:</p>
                    <p className="font-medium">{event.responsible}</p>
                  </div>
                </div>
                
                <p className="text-sm mb-3">{event.description}</p>
                
                <div className="flex justify-end space-x-2">
                  <button className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {t("common.edit")}
                  </button>
                  <button className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                    {t("common.delete")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-card rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">{t("admin.addTimelineEvent")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("timeline.eventName")}</label>
                <input type="text" className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("timeline.location")}</label>
                <input type="text" className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t("timeline.startTime")}</label>
                  <input type="time" className="w-full px-3 py-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t("timeline.endTime")}</label>
                  <input type="time" className="w-full px-3 py-2 border rounded-md" />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("timeline.responsible")}</label>
                <input type="text" className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("timeline.description")}</label>
                <textarea className="w-full px-3 py-2 border rounded-md h-[104px]"></textarea>
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

export default WeddingTimeline;
