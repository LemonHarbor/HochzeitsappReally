// Basic Component Service für WeWeb
// Diese Klasse implementiert die Geschäftslogik für die Basis-Komponente

import basicComponentModel from './basic-component-model.json';

class BasicComponentService {
  constructor() {
    this.dataModel = basicComponentModel.dataModel;
    this.items = [];
    this.settings = {
      theme: 'light',
      language: 'de',
      showHeader: true,
      showFooter: true,
      itemsPerPage: 10,
      sortOrder: 'asc'
    };
    this.translations = {
      de: {
        addButton: 'Hinzufügen',
        editButton: 'Bearbeiten',
        deleteButton: 'Löschen',
        emptyState: 'Keine Einträge vorhanden',
        confirmDelete: 'Möchten Sie diesen Eintrag wirklich löschen?',
        saveButton: 'Speichern',
        cancelButton: 'Abbrechen'
      },
      en: {
        addButton: 'Add',
        editButton: 'Edit',
        deleteButton: 'Delete',
        emptyState: 'No items available',
        confirmDelete: 'Do you really want to delete this item?',
        saveButton: 'Save',
        cancelButton: 'Cancel'
      }
    };
    this.eventListeners = {};
  }

  /**
   * Setzt die Einstellungen der Komponente
   * @param {Object} settings - Die neuen Einstellungen
   */
  setSettings(settings) {
    this.settings = {
      ...this.settings,
      ...settings
    };
  }

  /**
   * Ruft die aktuelle Sprache ab
   * @returns {string} - Der Sprachcode (de oder en)
   */
  getLanguage() {
    return this.settings.language;
  }

  /**
   * Setzt die Sprache der Komponente
   * @param {string} language - Der Sprachcode (de oder en)
   */
  setLanguage(language) {
    if (['de', 'en'].includes(language)) {
      this.settings.language = language;
    } else {
      console.warn(`Unsupported language: ${language}. Using default.`);
    }
  }

  /**
   * Ruft eine Übersetzung ab
   * @param {string} key - Der Übersetzungsschlüssel
   * @returns {string} - Die übersetzte Zeichenkette
   */
  translate(key) {
    const language = this.settings.language;
    return this.translations[language][key] || key;
  }

  /**
   * Ruft das aktuelle Theme ab
   * @returns {string} - Das Theme (light oder dark)
   */
  getTheme() {
    return this.settings.theme;
  }

  /**
   * Setzt das Theme der Komponente
   * @param {string} theme - Das Theme (light oder dark)
   */
  setTheme(theme) {
    if (['light', 'dark'].includes(theme)) {
      this.settings.theme = theme;
    } else {
      console.warn(`Unsupported theme: ${theme}. Using default.`);
    }
  }

  /**
   * Fügt ein neues Item hinzu
   * @param {Object} item - Das hinzuzufügende Item
   * @returns {Object} - Das hinzugefügte Item mit ID
   */
  addItem(item) {
    // Pflichtfelder prüfen
    if (!item.name) {
      throw new Error('Name ist ein Pflichtfeld');
    }

    // ID generieren
    const newItem = {
      ...item,
      id: this.generateUniqueId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: item.status || 'active'
    };

    this.items.push(newItem);
    
    // Event auslösen
    this.triggerEvent('onItemAdded', newItem);
    
    return newItem;
  }

  /**
   * Aktualisiert ein vorhandenes Item
   * @param {string} id - Die ID des zu aktualisierenden Items
   * @param {Object} updatedItem - Die aktualisierten Daten
   * @returns {Object} - Das aktualisierte Item
   */
  updateItem(id, updatedItem) {
    const itemIndex = this.items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      throw new Error('Item nicht gefunden');
    }
    
    // Aktualisieren des Items
    this.items[itemIndex] = {
      ...this.items[itemIndex],
      ...updatedItem,
      id, // ID beibehalten
      updated_at: new Date().toISOString()
    };
    
    // Event auslösen
    this.triggerEvent('onItemUpdated', this.items[itemIndex]);
    
    return this.items[itemIndex];
  }

  /**
   * Entfernt ein Item
   * @param {string} id - Die ID des zu entfernenden Items
   * @returns {boolean} - True, wenn das Item erfolgreich entfernt wurde
   */
  removeItem(id) {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== id);
    
    const removed = this.items.length < initialLength;
    
    if (removed) {
      // Event auslösen
      this.triggerEvent('onItemRemoved', { id });
    }
    
    return removed;
  }

  /**
   * Ruft ein Item anhand seiner ID ab
   * @param {string} id - Die ID des Items
   * @returns {Object|null} - Das Item oder null, wenn nicht gefunden
   */
  getItemById(id) {
    return this.items.find(item => item.id === id) || null;
  }

  /**
   * Ruft alle Items ab
   * @returns {Array} - Alle Items
   */
  getItems() {
    return [...this.items];
  }

  /**
   * Filtert Items nach verschiedenen Kriterien
   * @param {Object} filters - Die anzuwendenden Filter
   * @returns {Array} - Die gefilterten Items
   */
  filterItems(filters = {}) {
    return this.items.filter(item => {
      let match = true;
      
      // Nach Status filtern
      if (filters.status && item.status !== filters.status) {
        match = false;
      }
      
      // Nach Tags filtern
      if (filters.tag && item.tags && !item.tags.includes(filters.tag)) {
        match = false;
      }
      
      // Nach Suchbegriff filtern
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const name = (item.name || '').toLowerCase();
        const description = (item.description || '').toLowerCase();
        
        if (!name.includes(query) && !description.includes(query)) {
          match = false;
        }
      }
      
      return match;
    });
  }

  /**
   * Sortiert Items nach einem bestimmten Feld
   * @param {Array} items - Die zu sortierenden Items
   * @param {string} field - Das Feld, nach dem sortiert werden soll
   * @param {string} order - Die Sortierreihenfolge (asc oder desc)
   * @returns {Array} - Die sortierten Items
   */
  sortItems(items, field = 'name', order = 'asc') {
    return [...items].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];
      
      if (valueA === valueB) return 0;
      
      if (order === 'asc') {
        return valueA < valueB ? -1 : 1;
      } else {
        return valueA > valueB ? -1 : 1;
      }
    });
  }

  /**
   * Paginiert Items
   * @param {Array} items - Die zu paginierenden Items
   * @param {number} page - Die Seitennummer (beginnend bei 1)
   * @param {number} itemsPerPage - Die Anzahl der Items pro Seite
   * @returns {Array} - Die paginierten Items
   */
  paginateItems(items, page = 1, itemsPerPage = 10) {
    const startIndex = (page - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }

  /**
   * Generiert eine eindeutige ID
   * @returns {string} - Eine eindeutige ID
   */
  generateUniqueId() {
    return 'item_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Registriert einen Event-Listener
   * @param {string} event - Der Event-Name
   * @param {Function} callback - Die Callback-Funktion
   */
  addEventListener(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  /**
   * Entfernt einen Event-Listener
   * @param {string} event - Der Event-Name
   * @param {Function} callback - Die Callback-Funktion
   */
  removeEventListener(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(
        cb => cb !== callback
      );
    }
  }

  /**
   * Löst ein Event aus
   * @param {string} event - Der Event-Name
   * @param {any} data - Die Event-Daten
   */
  triggerEvent(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => {
        callback(data);
      });
    }
  }
}

export default new BasicComponentService();
