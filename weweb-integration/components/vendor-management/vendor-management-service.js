// Vendor Management Service für LemonVows
// Diese Klasse implementiert die Logik für das Lieferantenmanagement

import vendorManagementModel from './vendor-management-model.json';

class VendorManagementService {
  constructor() {
    this.dataModel = vendorManagementModel.dataModel;
    this.defaultCategories = vendorManagementModel.defaultCategories;
    this.vendors = [];
    this.categories = [];
    this.maxVendors = 10; // Standard für Free-Version
  }

  /**
   * Setzt das Limit für die maximale Anzahl an Lieferanten basierend auf der Preisstufe
   * @param {number} limit - Das neue Limit
   */
  setVendorLimit(limit) {
    this.maxVendors = limit;
  }

  /**
   * Prüft, ob das Lieferantenlimit erreicht ist
   * @returns {boolean} - True, wenn das Limit erreicht ist, sonst False
   */
  isVendorLimitReached() {
    return this.vendors.length >= this.maxVendors;
  }

  /**
   * Initialisiert das Lieferantenmanagement mit Standardkategorien
   */
  initialize() {
    // Standardkategorien erstellen
    this.categories = this.defaultCategories.map(category => ({
      ...category,
      id: this.generateUniqueId('category_')
    }));
    
    // Event auslösen
    this.triggerEvent('onVendorManagementInitialized', {
      categories: this.categories
    });
    
    return {
      categories: this.categories
    };
  }

  /**
   * Fügt einen neuen Lieferanten hinzu
   * @param {Object} vendor - Der hinzuzufügende Lieferant
   * @returns {Object} - Der hinzugefügte Lieferant mit ID
   */
  addVendor(vendor) {
    if (this.isVendorLimitReached()) {
      throw new Error(`Das Lieferantenlimit von ${this.maxVendors} ist erreicht. Upgrade auf einen höheren Plan, um mehr Lieferanten hinzuzufügen.`);
    }

    // Pflichtfelder prüfen
    if (!vendor.name) {
      throw new Error('Der Name ist ein Pflichtfeld');
    }

    const now = new Date();
    
    // ID generieren
    const newVendor = {
      ...vendor,
      id: this.generateUniqueId(),
      rating: vendor.rating || 0,
      contractSigned: vendor.contractSigned || false,
      depositPaid: vendor.depositPaid || false,
      finalPaymentPaid: vendor.finalPaymentPaid || false,
      createdAt: now,
      updatedAt: now
    };

    this.vendors.push(newVendor);
    
    // Event auslösen
    this.triggerEvent('onVendorAdded', newVendor);
    
    return newVendor;
  }

  /**
   * Aktualisiert einen Lieferanten
   * @param {string} id - Die ID des zu aktualisierenden Lieferanten
   * @param {Object} updatedVendor - Die aktualisierten Lieferantendaten
   * @returns {Object} - Der aktualisierte Lieferant
   */
  updateVendor(id, updatedVendor) {
    const vendorIndex = this.vendors.findIndex(vendor => vendor.id === id);
    
    if (vendorIndex === -1) {
      throw new Error('Lieferant nicht gefunden');
    }
    
    const now = new Date();
    
    // Aktualisieren des Lieferanten
    this.vendors[vendorIndex] = {
      ...this.vendors[vendorIndex],
      ...updatedVendor,
      id, // ID beibehalten
      updatedAt: now
    };
    
    // Event auslösen
    this.triggerEvent('onVendorUpdated', this.vendors[vendorIndex]);
    
    return this.vendors[vendorIndex];
  }

  /**
   * Entfernt einen Lieferanten
   * @param {string} id - Die ID des zu entfernenden Lieferanten
   * @returns {boolean} - True, wenn der Lieferant erfolgreich entfernt wurde
   */
  removeVendor(id) {
    const initialLength = this.vendors.length;
    this.vendors = this.vendors.filter(vendor => vendor.id !== id);
    
    const removed = this.vendors.length < initialLength;
    
    if (removed) {
      // Event auslösen
      this.triggerEvent('onVendorRemoved', { id });
    }
    
    return removed;
  }

  /**
   * Bewertet einen Lieferanten
   * @param {string} id - Die ID des Lieferanten
   * @param {number} rating - Die Bewertung (1-5)
   * @returns {Object} - Der aktualisierte Lieferant
   */
  rateVendor(id, rating) {
    if (rating < 1 || rating > 5) {
      throw new Error('Die Bewertung muss zwischen 1 und 5 liegen');
    }
    
    const vendor = this.getVendorById(id);
    
    if (!vendor) {
      throw new Error('Lieferant nicht gefunden');
    }
    
    const updatedVendor = this.updateVendor(id, { rating });
    
    // Event auslösen
    this.triggerEvent('onVendorRated', updatedVendor);
    
    return updatedVendor;
  }

  /**
   * Markiert einen Vertrag als unterzeichnet
   * @param {string} id - Die ID des Lieferanten
   * @param {Date} contractDate - Das Datum der Vertragsunterzeichnung
   * @param {string} contractFile - Die Datei des Vertrags (Pfad oder URL)
   * @returns {Object} - Der aktualisierte Lieferant
   */
  markContractSigned(id, contractDate = new Date(), contractFile = null) {
    const vendor = this.getVendorById(id);
    
    if (!vendor) {
      throw new Error('Lieferant nicht gefunden');
    }
    
    const updatedVendor = this.updateVendor(id, {
      contractSigned: true,
      contractDate,
      contractFile
    });
    
    // Event auslösen
    this.triggerEvent('onContractSigned', updatedVendor);
    
    return updatedVendor;
  }

  /**
   * Markiert eine Anzahlung als bezahlt
   * @param {string} id - Die ID des Lieferanten
   * @param {number} amount - Der Betrag der Anzahlung
   * @param {Date} depositDate - Das Datum der Anzahlung
   * @returns {Object} - Der aktualisierte Lieferant
   */
  markDepositPaid(id, amount, depositDate = new Date()) {
    const vendor = this.getVendorById(id);
    
    if (!vendor) {
      throw new Error('Lieferant nicht gefunden');
    }
    
    const updatedVendor = this.updateVendor(id, {
      depositPaid: true,
      depositAmount: amount,
      depositDate
    });
    
    // Event auslösen
    this.triggerEvent('onDepositPaid', updatedVendor);
    
    return updatedVendor;
  }

  /**
   * Markiert die Restzahlung als bezahlt
   * @param {string} id - Die ID des Lieferanten
   * @param {Date} paymentDate - Das Datum der Zahlung
   * @returns {Object} - Der aktualisierte Lieferant
   */
  markFinalPaymentPaid(id, paymentDate = new Date()) {
    const vendor = this.getVendorById(id);
    
    if (!vendor) {
      throw new Error('Lieferant nicht gefunden');
    }
    
    const updatedVendor = this.updateVendor(id, {
      finalPaymentPaid: true,
      finalPaymentDate: paymentDate
    });
    
    // Event auslösen
    this.triggerEvent('onFinalPaymentPaid', updatedVendor);
    
    return updatedVendor;
  }

  /**
   * Lädt einen Vertrag für einen Lieferanten hoch
   * @param {string} id - Die ID des Lieferanten
   * @param {string} filePath - Der Pfad zur Vertragsdatei
   * @returns {Object} - Der aktualisierte Lieferant
   */
  uploadContract(id, filePath) {
    const vendor = this.getVendorById(id);
    
    if (!vendor) {
      throw new Error('Lieferant nicht gefunden');
    }
    
    const updatedVendor = this.updateVendor(id, {
      contractFile: filePath
    });
    
    // Event auslösen
    this.triggerEvent('onContractUploaded', updatedVendor);
    
    return updatedVendor;
  }

  /**
   * Ruft einen Lieferanten anhand seiner ID ab
   * @param {string} id - Die ID des Lieferanten
   * @returns {Object|null} - Der Lieferant oder null, wenn nicht gefunden
   */
  getVendorById(id) {
    return this.vendors.find(vendor => vendor.id === id) || null;
  }

  /**
   * Ruft alle Lieferanten ab
   * @returns {Array} - Alle Lieferanten
   */
  getAllVendors() {
    return [...this.vendors];
  }

  /**
   * Filtert Lieferanten nach verschiedenen Kriterien
   * @param {Object} filters - Die anzuwendenden Filter
   * @returns {Array} - Die gefilterten Lieferanten
   */
  filterVendors(filters = {}) {
    return this.vendors.filter(vendor => {
      let match = true;
      
      // Nach Kategorie filtern
      if (filters.category && vendor.category !== filters.category) {
        match = false;
      }
      
      // Nach Vertragsstatus filtern
      if (filters.contractSigned !== undefined && vendor.contractSigned !== filters.contractSigned) {
        match = false;
      }
      
      // Nach Anzahlungsstatus filtern
      if (filters.depositPaid !== undefined && vendor.depositPaid !== filters.depositPaid) {
        match = false;
      }
      
      // Nach Restzahlungsstatus filtern
      if (filters.finalPaymentPaid !== undefined && vendor.finalPaymentPaid !== filters.finalPaymentPaid) {
        match = false;
      }
      
      // Nach Bewertung filtern
      if (filters.minRating !== undefined && vendor.rating < filters.minRating) {
        match = false;
      }
      
      // Nach Suchbegriff filtern
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const name = (vendor.name || '').toLowerCase();
        const contactPerson = (vendor.contactPerson || '').toLowerCase();
        const notes = (vendor.notes || '').toLowerCase();
        
        if (!name.includes(query) && !contactPerson.includes(query) && !notes.includes(query)) {
          match = false;
        }
      }
      
      return match;
    });
  }

  /**
   * Ruft Lieferanten mit ausstehenden Zahlungen ab
   * @returns {Array} - Lieferanten mit ausstehenden Zahlungen
   */
  getVendorsWithPendingPayments() {
    return this.vendors.filter(vendor => {
      // Lieferanten mit unterzeichnetem Vertrag, aber ohne bezahlte Anzahlung
      if (vendor.contractSigned && !vendor.depositPaid) {
        return true;
      }
      
      // Lieferanten mit bezahlter Anzahlung, aber ohne bezahlte Restzahlung
      if (vendor.depositPaid && !vendor.finalPaymentPaid) {
        return true;
      }
      
      return false;
    });
  }

  /**
   * Ruft Lieferanten mit bevorstehenden Zahlungen ab
   * @param {number} days - Anzahl der Tage in die Zukunft
   * @returns {Array} - Lieferanten mit bevorstehenden Zahlungen
   */
  getVendorsWithUpcomingPayments(days = 14) {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);
    
    return this.vendors.filter(vendor => {
      if (!vendor.finalPaymentDue || vendor.finalPaymentPaid) return false;
      
      const dueDate = new Date(vendor.finalPaymentDue);
      return dueDate >= now && dueDate <= future;
    });
  }

  /**
   * Fügt eine neue Kategorie hinzu
   * @param {Object} category - Die hinzuzufügende Kategorie
   * @returns {Object} - Die hinzugefügte Kategorie mit ID
   */
  addCategory(category) {
    if (!category.name) {
      throw new Error('Der Kategoriename ist ein Pflichtfeld');
    }
    
    const newCategory = {
      ...category,
      id: this.generateUniqueId('category_'),
      icon: category.icon || 'misc',
      description: category.description || ''
    };
    
    this.categories.push(newCategory);
    
    return newCategory;
  }

  /**
   * Aktualisiert eine Kategorie
   * @param {string} id - Die ID der zu aktualisierenden Kategorie
   * @param {Object} updatedCategory - Die aktualisierten Kategoriedaten
   * @returns {Object} - Die aktualisierte Kategorie
   */
  updateCategory(id, updatedCategory) {
    const categoryIndex = this.categories.findIndex(category => category.id === id);
    
    if (categoryIndex === -1) {
      throw new Error('Kategorie nicht gefunden');
    }
    
    this.categories[categoryIndex] = {
      ...this.categories[categoryIndex],
      ...updatedCategory,
      id // ID beibehalten
    };
    
    return this.categories[categoryIndex];
  }

  /**
   * Entfernt eine Kategorie
   * @param {string} id - Die ID der zu entfernenden Kategorie
   * @returns {boolean} - True, wenn die Kategorie erfolgreich entfernt wurde
   */
  removeCategory(id) {
    // Prüfen, ob Lieferanten mit dieser Kategorie existieren
    const vendorsWithCategory = this.vendors.filter(vendor => vendor.category === id);
    
    if (vendorsWithCategory.length > 0) {
      throw new Error('Diese Kategorie kann nicht entfernt werden, da sie von Lieferanten verwendet wird');
    }
    
    const initialLength = this.categories.length;
    this.categories = this.categories.filter(category => category.id !== id);
    
    return this.categories.length < initialLength;
  }

  /**
   * Ruft alle Kategorien ab
   * @returns {Array} - Alle Kategorien
   */
  getAllCategories() {
    return [...this.categories];
  }

  /**
   * Ruft eine Kategorie anhand ihrer ID ab
   * @param {string} id - Die ID der Kategorie
   * @returns {Object|null} - Die Kategorie oder null, wenn nicht gefunden
   */
  getCategoryById(id) {
    return this.categories.find(category => category.id === id) || null;
  }

  /**
   * Exportiert die Lieferantenliste in verschiedenen Formaten
   * @param {string} format - Das Exportformat (csv, json)
   * @returns {string} - Die exportierte Lieferantenliste
   */
  exportVendorList(format = 'json') {
    switch (format.toLowerCase()) {
      case 'csv':
        return this.exportAsCSV();
      case 'json':
      default:
        return JSON.stringify(this.vendors, null, 2);
    }
  }

  /**
   * Exportiert die Lieferantenliste als CSV
   * @returns {string} - Die Lieferantenliste im CSV-Format
   */
  exportAsCSV() {
    const headers = [
      'Name',
      'Kategorie',
      'Kontaktperson',
      'E-Mail',
      'Telefon',
      'Website',
      'Adresse',
      'Notizen',
      'Bewertung',
      'Vertrag unterzeichnet',
      'Vertragsdatum',
      'Preis',
      'Anzahlung bezahlt',
      'Anzahlungsbetrag',
      'Anzahlungsdatum',
      'Restzahlung fällig',
      'Restzahlung bezahlt'
    ];
    
    const rows = this.vendors.map(vendor => {
      const category = this.getCategoryById(vendor.category);
      
      return [
        vendor.name,
        category ? category.name : '',
        vendor.contactPerson || '',
        vendor.email || '',
        vendor.phone || '',
        vendor.website || '',
        vendor.address || '',
        vendor.notes || '',
        vendor.rating || '0',
        vendor.contractSigned ? 'Ja' : 'Nein',
        vendor.contractDate ? new Date(vendor.contractDate).toLocaleDateString() : '',
        vendor.price || '0',
        vendor.depositPaid ? 'Ja' : 'Nein',
        vendor.depositAmount || '0',
        vendor.depositDate ? new Date(vendor.depositDate).toLocaleDateString() : '',
        vendor.finalPaymentDue ? new Date(vendor.finalPaymentDue).toLocaleDateString() : '',
        vendor.finalPaymentPaid ? 'Ja' : 'Nein'
      ];
    });
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csvContent;
  }

  /**
   * Berechnet Lieferantenstatistiken
   * @returns {Object} - Lieferantenstatistiken
   */
  getVendorStatistics() {
    const totalVendors = this.vendors.length;
    const contractSignedCount = this.vendors.filter(vendor => vendor.contractSigned).length;
    const depositPaidCount = this.vendors.filter(vendor => vendor.depositPaid).length;
    const finalPaymentPaidCount = this.vendors.filter(vendor => vendor.finalPaymentPaid).length;
    
    const totalBudget = this.vendors.reduce((sum, vendor) => sum + (vendor.price || 0), 0);
    const totalDeposits = this.vendors.reduce((sum, vendor) => sum + (vendor.depositPaid ? (vendor.depositAmount || 0) : 0), 0);
    const totalRemaining = totalBudget - totalDeposits;
    
    // Statistiken pro Kategorie
    const categoryStats = {};
    
    this.categories.forEach(category => {
      const vendorsInCategory = this.vendors.filter(vendor => vendor.category === category.id);
      
      const total = vendorsInCategory.length;
      const contractSigned = vendorsInCategory.filter(vendor => vendor.contractSigned).length;
      const depositPaid = vendorsInCategory.filter(vendor => vendor.depositPaid).length;
      const finalPaymentPaid = vendorsInCategory.filter(vendor => vendor.finalPaymentPaid).length;
      
      const categoryBudget = vendorsInCategory.reduce((sum, vendor) => sum + (vendor.price || 0), 0);
      
      categoryStats[category.id] = {
        name: category.name,
        icon: category.icon,
        total,
        contractSigned,
        depositPaid,
        finalPaymentPaid,
        budget: categoryBudget
      };
    });
    
    return {
      totalVendors,
      contractSignedCount,
      depositPaidCount,
      finalPaymentPaidCount,
      totalBudget,
      totalDeposits,
      totalRemaining,
      contractSignedRate: totalVendors > 0 ? (contractSignedCount / totalVendors) * 100 : 0,
      depositPaidRate: totalVendors > 0 ? (depositPaidCount / totalVendors) * 100 : 0,
      finalPaymentPaidRate: totalVendors > 0 ? (finalPaymentPaidCount / totalVendors) * 100 : 0,
      categoryStats
    };
  }

  /**
   * Generiert eine eindeutige ID
   * @param {string} prefix - Das Präfix für die ID
   * @returns {string} - Eine eindeutige ID
   */
  generateUniqueId(prefix = 'vendor_') {
    return prefix + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Hilfsfunktion zum Auslösen von Events
   * @param {string} eventName - Der Name des Events
   * @param {any} data - Die Eventdaten
   */
  triggerEvent(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
  }
}

// Exportieren des VendorManagementService
export default new VendorManagementService();
