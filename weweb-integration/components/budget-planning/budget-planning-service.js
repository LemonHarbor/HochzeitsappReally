// Budget Planning Service für LemonVows
// Diese Klasse implementiert die Logik für die Budget-Planung

import budgetPlanningModel from './budget-planning-model.json';

class BudgetPlanningService {
  constructor() {
    this.dataModel = budgetPlanningModel.dataModel;
    this.defaultCategories = budgetPlanningModel.defaultCategories;
    this.budgetItems = [];
    this.budgetCategories = [];
    this.totalBudget = 10000; // Standard-Gesamtbudget
    this.currency = 'EUR'; // Standard-Währung
  }

  /**
   * Initialisiert die Budget-Planung mit Standardkategorien
   * @param {number} totalBudget - Das Gesamtbudget
   * @param {string} currency - Die Währung
   */
  initialize(totalBudget = 10000, currency = 'EUR') {
    this.totalBudget = totalBudget;
    this.currency = currency;
    
    // Standardkategorien erstellen
    this.budgetCategories = this.defaultCategories.map(category => ({
      ...category,
      id: this.generateUniqueId('category_'),
      allocation: (category.allocation / 100) * totalBudget
    }));
    
    // Event auslösen
    this.triggerEvent('onBudgetInitialized', {
      totalBudget,
      currency,
      categories: this.budgetCategories
    });
    
    return {
      totalBudget,
      currency,
      categories: this.budgetCategories
    };
  }

  /**
   * Setzt das Gesamtbudget
   * @param {number} amount - Der neue Betrag
   * @param {boolean} adjustAllocations - Ob die Kategoriezuweisungen angepasst werden sollen
   * @returns {Object} - Das aktualisierte Budget
   */
  setTotalBudget(amount, adjustAllocations = true) {
    if (amount <= 0) {
      throw new Error('Das Gesamtbudget muss größer als 0 sein');
    }
    
    const oldBudget = this.totalBudget;
    this.totalBudget = amount;
    
    // Kategoriezuweisungen anpassen, wenn gewünscht
    if (adjustAllocations && this.budgetCategories.length > 0) {
      const ratio = amount / oldBudget;
      
      this.budgetCategories = this.budgetCategories.map(category => ({
        ...category,
        allocation: category.allocation * ratio
      }));
    }
    
    // Event auslösen
    this.triggerEvent('onTotalBudgetChanged', {
      oldBudget,
      newBudget: amount,
      adjustedAllocations: adjustAllocations
    });
    
    return {
      totalBudget: this.totalBudget,
      currency: this.currency,
      categories: this.budgetCategories
    };
  }

  /**
   * Setzt die Währung
   * @param {string} currency - Die neue Währung
   * @returns {string} - Die aktualisierte Währung
   */
  setCurrency(currency) {
    this.currency = currency;
    
    // Event auslösen
    this.triggerEvent('onCurrencyChanged', { currency });
    
    return this.currency;
  }

  /**
   * Fügt eine neue Budgetkategorie hinzu
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
      allocation: category.allocation || 0,
      color: category.color || this.getRandomColor(),
      icon: category.icon || 'misc',
      description: category.description || ''
    };
    
    this.budgetCategories.push(newCategory);
    
    // Event auslösen
    this.triggerEvent('onCategoryAdded', newCategory);
    
    return newCategory;
  }

  /**
   * Aktualisiert eine Budgetkategorie
   * @param {string} id - Die ID der zu aktualisierenden Kategorie
   * @param {Object} updatedCategory - Die aktualisierten Kategoriedaten
   * @returns {Object} - Die aktualisierte Kategorie
   */
  updateCategory(id, updatedCategory) {
    const categoryIndex = this.budgetCategories.findIndex(category => category.id === id);
    
    if (categoryIndex === -1) {
      throw new Error('Kategorie nicht gefunden');
    }
    
    this.budgetCategories[categoryIndex] = {
      ...this.budgetCategories[categoryIndex],
      ...updatedCategory,
      id // ID beibehalten
    };
    
    // Event auslösen
    this.triggerEvent('onCategoryUpdated', this.budgetCategories[categoryIndex]);
    
    return this.budgetCategories[categoryIndex];
  }

  /**
   * Entfernt eine Budgetkategorie
   * @param {string} id - Die ID der zu entfernenden Kategorie
   * @returns {boolean} - True, wenn die Kategorie erfolgreich entfernt wurde
   */
  removeCategory(id) {
    // Prüfen, ob Budgetposten mit dieser Kategorie existieren
    const itemsWithCategory = this.budgetItems.filter(item => item.category === id);
    
    if (itemsWithCategory.length > 0) {
      throw new Error('Diese Kategorie kann nicht entfernt werden, da sie von Budgetposten verwendet wird');
    }
    
    const initialLength = this.budgetCategories.length;
    this.budgetCategories = this.budgetCategories.filter(category => category.id !== id);
    
    const removed = this.budgetCategories.length < initialLength;
    
    if (removed) {
      // Event auslösen
      this.triggerEvent('onCategoryRemoved', { id });
    }
    
    return removed;
  }

  /**
   * Ruft alle Budgetkategorien ab
   * @returns {Array} - Alle Budgetkategorien
   */
  getAllCategories() {
    return [...this.budgetCategories];
  }

  /**
   * Ruft eine Budgetkategorie anhand ihrer ID ab
   * @param {string} id - Die ID der Kategorie
   * @returns {Object|null} - Die Kategorie oder null, wenn nicht gefunden
   */
  getCategoryById(id) {
    return this.budgetCategories.find(category => category.id === id) || null;
  }

  /**
   * Fügt einen neuen Budgetposten hinzu
   * @param {Object} item - Der hinzuzufügende Budgetposten
   * @returns {Object} - Der hinzugefügte Budgetposten mit ID
   */
  addBudgetItem(item) {
    if (!item.description || !item.category) {
      throw new Error('Beschreibung und Kategorie sind Pflichtfelder');
    }
    
    // Kategorie überprüfen
    const category = this.getCategoryById(item.category);
    
    if (!category) {
      throw new Error('Die angegebene Kategorie existiert nicht');
    }
    
    const now = new Date();
    
    const newItem = {
      ...item,
      id: this.generateUniqueId('item_'),
      estimatedCost: item.estimatedCost || 0,
      actualCost: item.actualCost || 0,
      paid: item.paid || false,
      createdAt: now,
      updatedAt: now
    };
    
    this.budgetItems.push(newItem);
    
    // Event auslösen
    this.triggerEvent('onBudgetItemAdded', newItem);
    
    // Prüfen, ob das Budget überschritten wurde
    this.checkBudgetExceeded();
    
    return newItem;
  }

  /**
   * Aktualisiert einen Budgetposten
   * @param {string} id - Die ID des zu aktualisierenden Budgetpostens
   * @param {Object} updatedItem - Die aktualisierten Budgetpostendaten
   * @returns {Object} - Der aktualisierte Budgetposten
   */
  updateBudgetItem(id, updatedItem) {
    const itemIndex = this.budgetItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      throw new Error('Budgetposten nicht gefunden');
    }
    
    // Kategorie überprüfen, wenn sie geändert wurde
    if (updatedItem.category && updatedItem.category !== this.budgetItems[itemIndex].category) {
      const category = this.getCategoryById(updatedItem.category);
      
      if (!category) {
        throw new Error('Die angegebene Kategorie existiert nicht');
      }
    }
    
    this.budgetItems[itemIndex] = {
      ...this.budgetItems[itemIndex],
      ...updatedItem,
      id, // ID beibehalten
      updatedAt: new Date()
    };
    
    // Event auslösen
    this.triggerEvent('onBudgetItemUpdated', this.budgetItems[itemIndex]);
    
    // Prüfen, ob das Budget überschritten wurde
    this.checkBudgetExceeded();
    
    return this.budgetItems[itemIndex];
  }

  /**
   * Entfernt einen Budgetposten
   * @param {string} id - Die ID des zu entfernenden Budgetpostens
   * @returns {boolean} - True, wenn der Budgetposten erfolgreich entfernt wurde
   */
  removeBudgetItem(id) {
    const initialLength = this.budgetItems.length;
    this.budgetItems = this.budgetItems.filter(item => item.id !== id);
    
    const removed = this.budgetItems.length < initialLength;
    
    if (removed) {
      // Event auslösen
      this.triggerEvent('onBudgetItemRemoved', { id });
      
      // Prüfen, ob das Budget überschritten wurde
      this.checkBudgetExceeded();
    }
    
    return removed;
  }

  /**
   * Ruft alle Budgetposten ab
   * @returns {Array} - Alle Budgetposten
   */
  getAllBudgetItems() {
    return [...this.budgetItems];
  }

  /**
   * Ruft einen Budgetposten anhand seiner ID ab
   * @param {string} id - Die ID des Budgetpostens
   * @returns {Object|null} - Der Budgetposten oder null, wenn nicht gefunden
   */
  getBudgetItemById(id) {
    return this.budgetItems.find(item => item.id === id) || null;
  }

  /**
   * Filtert Budgetposten nach verschiedenen Kriterien
   * @param {Object} filters - Die anzuwendenden Filter
   * @returns {Array} - Die gefilterten Budgetposten
   */
  filterBudgetItems(filters = {}) {
    return this.budgetItems.filter(item => {
      let match = true;
      
      // Nach Kategorie filtern
      if (filters.category && item.category !== filters.category) {
        match = false;
      }
      
      // Nach Bezahlstatus filtern
      if (filters.paid !== undefined && item.paid !== filters.paid) {
        match = false;
      }
      
      // Nach Lieferant filtern
      if (filters.vendor && item.vendor !== filters.vendor) {
        match = false;
      }
      
      // Nach Suchbegriff filtern
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const description = (item.description || '').toLowerCase();
        const notes = (item.notes || '').toLowerCase();
        const vendor = (item.vendor || '').toLowerCase();
        
        if (!description.includes(query) && !notes.includes(query) && !vendor.includes(query)) {
          match = false;
        }
      }
      
      return match;
    });
  }

  /**
   * Markiert einen Budgetposten als bezahlt oder unbezahlt
   * @param {string} id - Die ID des Budgetpostens
   * @param {boolean} paid - Ob der Budgetposten bezahlt ist
   * @param {Date} paymentDate - Das Datum der Zahlung
   * @returns {Object} - Der aktualisierte Budgetposten
   */
  markItemPaid(id, paid = true, paymentDate = new Date()) {
    const item = this.getBudgetItemById(id);
    
    if (!item) {
      throw new Error('Budgetposten nicht gefunden');
    }
    
    return this.updateBudgetItem(id, {
      paid,
      paymentDate: paid ? paymentDate : null
    });
  }

  /**
   * Berechnet Budgetstatistiken
   * @returns {Object} - Budgetstatistiken
   */
  getBudgetStatistics() {
    const totalEstimated = this.budgetItems.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
    const totalActual = this.budgetItems.reduce((sum, item) => sum + (item.actualCost || 0), 0);
    const totalPaid = this.budgetItems.filter(item => item.paid).reduce((sum, item) => sum + (item.actualCost || 0), 0);
    const totalUnpaid = totalActual - totalPaid;
    
    // Statistiken pro Kategorie
    const categoryStats = {};
    
    this.budgetCategories.forEach(category => {
      const itemsInCategory = this.budgetItems.filter(item => item.category === category.id);
      
      const estimatedTotal = itemsInCategory.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
      const actualTotal = itemsInCategory.reduce((sum, item) => sum + (item.actualCost || 0), 0);
      const paidTotal = itemsInCategory.filter(item => item.paid).reduce((sum, item) => sum + (item.actualCost || 0), 0);
      
      categoryStats[category.id] = {
        name: category.name,
        color: category.color,
        allocation: category.allocation,
        estimatedTotal,
        actualTotal,
        paidTotal,
        unpaidTotal: actualTotal - paidTotal,
        itemCount: itemsInCategory.length,
        variance: category.allocation - actualTotal
      };
    });
    
    return {
      totalBudget: this.totalBudget,
      totalEstimated,
      totalActual,
      totalPaid,
      totalUnpaid,
      remainingBudget: this.totalBudget - totalActual,
      budgetProgress: (totalActual / this.totalBudget) * 100,
      categoryStats
    };
  }

  /**
   * Prüft, ob das Budget überschritten wurde
   * @returns {boolean} - True, wenn das Budget überschritten wurde
   */
  checkBudgetExceeded() {
    const stats = this.getBudgetStatistics();
    const budgetExceeded = stats.totalActual > this.totalBudget;
    
    if (budgetExceeded) {
      // Event auslösen
      this.triggerEvent('onBudgetExceeded', {
        totalBudget: this.totalBudget,
        totalActual: stats.totalActual,
        overage: stats.totalActual - this.totalBudget
      });
    }
    
    return budgetExceeded;
  }

  /**
   * Generiert einen detaillierten Budgetbericht
   * @param {string} format - Das Format des Berichts (json, csv)
   * @returns {string} - Der generierte Bericht
   */
  generateReport(format = 'json') {
    const stats = this.getBudgetStatistics();
    const items = this.getAllBudgetItems();
    const categories = this.getAllCategories();
    
    const report = {
      generatedAt: new Date(),
      summary: {
        totalBudget: this.totalBudget,
        currency: this.currency,
        totalEstimated: stats.totalEstimated,
        totalActual: stats.totalActual,
        totalPaid: stats.totalPaid,
        totalUnpaid: stats.totalUnpaid,
        remainingBudget: stats.remainingBudget,
        budgetProgress: stats.budgetProgress
      },
      categories: categories.map(category => ({
        ...category,
        stats: stats.categoryStats[category.id]
      })),
      items: items.map(item => {
        const category = this.getCategoryById(item.category);
        return {
          ...item,
          categoryName: category ? category.name : 'Unbekannt'
        };
      })
    };
    
    switch (format.toLowerCase()) {
      case 'csv':
        return this.exportAsCSV(report);
      case 'json':
      default:
        return JSON.stringify(report, null, 2);
    }
  }

  /**
   * Exportiert den Budgetbericht als CSV
   * @param {Object} report - Der zu exportierende Bericht
   * @returns {string} - Der Bericht im CSV-Format
   */
  exportAsCSV(report) {
    // Zusammenfassung
    const summaryRows = [
      ['Gesamtbudget', `${report.summary.totalBudget} ${this.currency}`],
      ['Geschätzte Gesamtkosten', `${report.summary.totalEstimated} ${this.currency}`],
      ['Tatsächliche Gesamtkosten', `${report.summary.totalActual} ${this.currency}`],
      ['Bezahlte Kosten', `${report.summary.totalPaid} ${this.currency}`],
      ['Unbezahlte Kosten', `${report.summary.totalUnpaid} ${this.currency}`],
      ['Verbleibendes Budget', `${report.summary.remainingBudget} ${this.currency}`],
      ['Budgetfortschritt', `${report.summary.budgetProgress.toFixed(2)}%`]
    ];
    
    const summaryCSV = summaryRows.map(row => row.join(',')).join('\n');
    
    // Kategorien
    const categoryHeaders = ['Kategorie', 'Zuweisung', 'Geschätzte Kosten', 'Tatsächliche Kosten', 'Bezahlt', 'Unbezahlt', 'Abweichung'];
    const categoryRows = report.categories.map(category => [
      category.name,
      `${category.allocation} ${this.currency}`,
      `${category.stats.estimatedTotal} ${this.currency}`,
      `${category.stats.actualTotal} ${this.currency}`,
      `${category.stats.paidTotal} ${this.currency}`,
      `${category.stats.unpaidTotal} ${this.currency}`,
      `${category.stats.variance} ${this.currency}`
    ]);
    
    const categoryCSV = [
      categoryHeaders.join(','),
      ...categoryRows.map(row => row.join(','))
    ].join('\n');
    
    // Budgetposten
    const itemHeaders = ['Beschreibung', 'Kategorie', 'Geschätzte Kosten', 'Tatsächliche Kosten', 'Bezahlt', 'Zahlungsdatum', 'Lieferant', 'Notizen'];
    const itemRows = report.items.map(item => [
      item.description,
      item.categoryName,
      `${item.estimatedCost} ${this.currency}`,
      `${item.actualCost} ${this.currency}`,
      item.paid ? 'Ja' : 'Nein',
      item.paymentDate ? new Date(item.paymentDate).toLocaleDateString() : '',
      item.vendor || '',
      item.notes || ''
    ]);
    
    const itemsCSV = [
      itemHeaders.join(','),
      ...itemRows.map(row => row.join(','))
    ].join('\n');
    
    // Alles zusammenfügen
    return `BUDGET ZUSAMMENFASSUNG\n${summaryCSV}\n\nKATEGORIEN\n${categoryCSV}\n\nBUDGETPOSTEN\n${itemsCSV}`;
  }

  /**
   * Generiert eine eindeutige ID
   * @param {string} prefix - Das Präfix für die ID
   * @returns {string} - Eine eindeutige ID
   */
  generateUniqueId(prefix = 'budget_') {
    return prefix + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Generiert eine zufällige Farbe
   * @returns {string} - Eine zufällige Farbe im Hex-Format
   */
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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

// Exportieren des BudgetPlanningService
export default new BudgetPlanningService();
