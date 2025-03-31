// Timeline Generator Service für LemonVows
// Diese Klasse implementiert die Logik für den automatischen Zeitplangenerator

import timelineTemplates from './timeline-templates.json';

class TimelineGeneratorService {
  constructor() {
    this.templates = timelineTemplates.templates;
    this.categories = timelineTemplates.categories;
  }

  /**
   * Generiert einen Zeitplan basierend auf dem Hochzeitsdatum
   * @param {Date} weddingDate - Das Datum der Hochzeit
   * @param {string} templateType - Die Art der Vorlage (standard, traditionell, modern)
   * @returns {Array} - Der generierte Zeitplan mit Ereignissen
   */
  generateTimeline(weddingDate, templateType = 'standard') {
    if (!weddingDate || !(weddingDate instanceof Date)) {
      throw new Error('Bitte geben Sie ein gültiges Hochzeitsdatum an');
    }

    // Vorlage auswählen
    const templateEvents = this.templates[templateType] || this.templates.standard;
    
    // Zeitplan-Ereignisse generieren
    const timelineEvents = templateEvents.map(template => {
      // Datum berechnen (Hochzeitsdatum - Tage vor der Hochzeit)
      const eventDate = new Date(weddingDate);
      eventDate.setDate(eventDate.getDate() - template.daysBeforeWedding);
      
      // Kategorie-Informationen abrufen
      const categoryId = this.getCategoryIdByName(template.category);
      const category = this.getCategoryById(categoryId);
      
      return {
        id: this.generateUniqueId(),
        title: template.title,
        description: template.description,
        date: eventDate,
        daysBeforeWedding: template.daysBeforeWedding,
        category: template.category,
        categoryId: categoryId,
        color: category ? category.color : '#CCCCCC',
        isCompleted: false,
        isCustom: false
      };
    });
    
    // Nach Datum sortieren (aufsteigend)
    return timelineEvents.sort((a, b) => a.date - b.date);
  }

  /**
   * Fügt ein benutzerdefiniertes Ereignis zum Zeitplan hinzu
   * @param {Object} timeline - Der bestehende Zeitplan
   * @param {Object} event - Das hinzuzufügende Ereignis
   * @param {Date} weddingDate - Das Datum der Hochzeit
   * @returns {Array} - Der aktualisierte Zeitplan
   */
  addCustomEvent(timeline, event, weddingDate) {
    if (!timeline || !Array.isArray(timeline)) {
      timeline = [];
    }
    
    if (!event || !event.title || !event.date) {
      throw new Error('Bitte geben Sie einen Titel und ein Datum für das Ereignis an');
    }
    
    // Tage vor der Hochzeit berechnen
    const eventDate = new Date(event.date);
    const weddingDateTime = new Date(weddingDate).getTime();
    const eventDateTime = eventDate.getTime();
    const daysBeforeWedding = Math.round((weddingDateTime - eventDateTime) / (1000 * 60 * 60 * 24));
    
    // Kategorie-Informationen abrufen
    const categoryId = event.categoryId || this.getCategoryIdByName(event.category) || 'planung';
    const category = this.getCategoryById(categoryId);
    
    // Neues Ereignis erstellen
    const newEvent = {
      id: this.generateUniqueId(),
      title: event.title,
      description: event.description || '',
      date: eventDate,
      daysBeforeWedding: daysBeforeWedding,
      category: category ? category.name : 'Planung',
      categoryId: categoryId,
      color: category ? category.color : '#CCCCCC',
      isCompleted: false,
      isCustom: true
    };
    
    // Zum Zeitplan hinzufügen
    timeline.push(newEvent);
    
    // Nach Datum sortieren (aufsteigend)
    return timeline.sort((a, b) => a.date - b.date);
  }

  /**
   * Aktualisiert ein Ereignis im Zeitplan
   * @param {Array} timeline - Der bestehende Zeitplan
   * @param {string} eventId - Die ID des zu aktualisierenden Ereignisses
   * @param {Object} updatedEvent - Die aktualisierten Ereignisdaten
   * @param {Date} weddingDate - Das Datum der Hochzeit
   * @returns {Array} - Der aktualisierte Zeitplan
   */
  updateEvent(timeline, eventId, updatedEvent, weddingDate) {
    if (!timeline || !Array.isArray(timeline)) {
      return [];
    }
    
    // Ereignis finden
    const eventIndex = timeline.findIndex(event => event.id === eventId);
    
    if (eventIndex === -1) {
      throw new Error('Ereignis nicht gefunden');
    }
    
    // Tage vor der Hochzeit berechnen, wenn das Datum geändert wurde
    let daysBeforeWedding = timeline[eventIndex].daysBeforeWedding;
    
    if (updatedEvent.date) {
      const eventDate = new Date(updatedEvent.date);
      const weddingDateTime = new Date(weddingDate).getTime();
      const eventDateTime = eventDate.getTime();
      daysBeforeWedding = Math.round((weddingDateTime - eventDateTime) / (1000 * 60 * 60 * 24));
    }
    
    // Kategorie-Informationen aktualisieren, wenn die Kategorie geändert wurde
    let categoryId = timeline[eventIndex].categoryId;
    let categoryName = timeline[eventIndex].category;
    let categoryColor = timeline[eventIndex].color;
    
    if (updatedEvent.categoryId || updatedEvent.category) {
      categoryId = updatedEvent.categoryId || this.getCategoryIdByName(updatedEvent.category) || categoryId;
      const category = this.getCategoryById(categoryId);
      
      if (category) {
        categoryName = category.name;
        categoryColor = category.color;
      }
    }
    
    // Ereignis aktualisieren
    timeline[eventIndex] = {
      ...timeline[eventIndex],
      title: updatedEvent.title || timeline[eventIndex].title,
      description: updatedEvent.description !== undefined ? updatedEvent.description : timeline[eventIndex].description,
      date: updatedEvent.date ? new Date(updatedEvent.date) : timeline[eventIndex].date,
      daysBeforeWedding: daysBeforeWedding,
      category: categoryName,
      categoryId: categoryId,
      color: categoryColor,
      isCompleted: updatedEvent.isCompleted !== undefined ? updatedEvent.isCompleted : timeline[eventIndex].isCompleted
    };
    
    // Nach Datum sortieren (aufsteigend)
    return timeline.sort((a, b) => a.date - b.date);
  }

  /**
   * Entfernt ein Ereignis aus dem Zeitplan
   * @param {Array} timeline - Der bestehende Zeitplan
   * @param {string} eventId - Die ID des zu entfernenden Ereignisses
   * @returns {Array} - Der aktualisierte Zeitplan
   */
  removeEvent(timeline, eventId) {
    if (!timeline || !Array.isArray(timeline)) {
      return [];
    }
    
    return timeline.filter(event => event.id !== eventId);
  }

  /**
   * Markiert ein Ereignis als abgeschlossen oder nicht abgeschlossen
   * @param {Array} timeline - Der bestehende Zeitplan
   * @param {string} eventId - Die ID des Ereignisses
   * @param {boolean} isCompleted - Ob das Ereignis abgeschlossen ist
   * @returns {Array} - Der aktualisierte Zeitplan
   */
  markEventCompleted(timeline, eventId, isCompleted = true) {
    if (!timeline || !Array.isArray(timeline)) {
      return [];
    }
    
    return timeline.map(event => {
      if (event.id === eventId) {
        return { ...event, isCompleted };
      }
      return event;
    });
  }

  /**
   * Exportiert den Zeitplan in verschiedenen Formaten
   * @param {Array} timeline - Der zu exportierende Zeitplan
   * @param {string} format - Das Exportformat (csv, ical, json)
   * @returns {string} - Der exportierte Zeitplan
   */
  exportTimeline(timeline, format = 'json') {
    if (!timeline || !Array.isArray(timeline)) {
      return '';
    }
    
    switch (format.toLowerCase()) {
      case 'csv':
        return this.exportAsCSV(timeline);
      case 'ical':
        return this.exportAsICal(timeline);
      case 'json':
      default:
        return JSON.stringify(timeline, null, 2);
    }
  }

  /**
   * Exportiert den Zeitplan als CSV
   * @param {Array} timeline - Der zu exportierende Zeitplan
   * @returns {string} - Der Zeitplan im CSV-Format
   */
  exportAsCSV(timeline) {
    const headers = ['Titel', 'Beschreibung', 'Datum', 'Tage vor der Hochzeit', 'Kategorie', 'Abgeschlossen'];
    const rows = timeline.map(event => [
      event.title,
      event.description,
      event.date.toLocaleDateString(),
      event.daysBeforeWedding,
      event.category,
      event.isCompleted ? 'Ja' : 'Nein'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csvContent;
  }

  /**
   * Exportiert den Zeitplan als iCal
   * @param {Array} timeline - Der zu exportierende Zeitplan
   * @returns {string} - Der Zeitplan im iCal-Format
   */
  exportAsICal(timeline) {
    const icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//LemonVows//Hochzeitsplaner//DE',
      ...timeline.map(event => this.formatEventAsICal(event)),
      'END:VCALENDAR'
    ].join('\r\n');
    
    return icalContent;
  }

  /**
   * Formatiert ein Ereignis im iCal-Format
   * @param {Object} event - Das zu formatierende Ereignis
   * @returns {string} - Das Ereignis im iCal-Format
   */
  formatEventAsICal(event) {
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const eventDate = formatDate(event.date);
    const endDate = formatDate(new Date(event.date.getTime() + 60 * 60 * 1000)); // +1 Stunde
    
    return [
      'BEGIN:VEVENT',
      `UID:${event.id}@lemonvows.com`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${eventDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `CATEGORIES:${event.category}`,
      `STATUS:${event.isCompleted ? 'COMPLETED' : 'NEEDS-ACTION'}`,
      'END:VEVENT'
    ].join('\r\n');
  }

  /**
   * Generiert eine eindeutige ID
   * @returns {string} - Eine eindeutige ID
   */
  generateUniqueId() {
    return 'event_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Ruft die Kategorie-ID anhand des Namens ab
   * @param {string} categoryName - Der Name der Kategorie
   * @returns {string|null} - Die ID der Kategorie oder null, wenn nicht gefunden
   */
  getCategoryIdByName(categoryName) {
    if (!categoryName) return null;
    
    const category = this.categories.find(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    
    return category ? category.id : null;
  }

  /**
   * Ruft die Kategorie anhand der ID ab
   * @param {string} categoryId - Die ID der Kategorie
   * @returns {Object|null} - Die Kategorie oder null, wenn nicht gefunden
   */
  getCategoryById(categoryId) {
    if (!categoryId) return null;
    
    return this.categories.find(cat => cat.id === categoryId) || null;
  }

  /**
   * Ruft alle verfügbaren Kategorien ab
   * @returns {Array} - Alle Kategorien
   */
  getAllCategories() {
    return this.categories;
  }

  /**
   * Ruft alle verfügbaren Vorlagentypen ab
   * @returns {Array} - Alle Vorlagentypen
   */
  getTemplateTypes() {
    return Object.keys(this.templates);
  }
}

// Exportieren des TimelineGeneratorService
export default new TimelineGeneratorService();
