// Task Management Service für LemonVows
// Diese Klasse implementiert die Logik für das Aufgabenmanagement

import taskManagementModel from './task-management-model.json';

class TaskManagementService {
  constructor() {
    this.dataModel = taskManagementModel.dataModel;
    this.defaultCategories = taskManagementModel.defaultCategories;
    this.tasks = [];
    this.categories = [];
    this.maxTasks = 50; // Standard für Free-Version
  }

  /**
   * Setzt das Limit für die maximale Anzahl an Aufgaben basierend auf der Preisstufe
   * @param {number} limit - Das neue Limit
   */
  setTaskLimit(limit) {
    this.maxTasks = limit;
  }

  /**
   * Prüft, ob das Aufgabenlimit erreicht ist
   * @returns {boolean} - True, wenn das Limit erreicht ist, sonst False
   */
  isTaskLimitReached() {
    return this.tasks.length >= this.maxTasks;
  }

  /**
   * Initialisiert das Aufgabenmanagement mit Standardkategorien
   */
  initialize() {
    // Standardkategorien erstellen
    this.categories = this.defaultCategories.map(category => ({
      ...category,
      id: this.generateUniqueId('category_')
    }));
    
    // Event auslösen
    this.triggerEvent('onTaskManagementInitialized', {
      categories: this.categories
    });
    
    return {
      categories: this.categories
    };
  }

  /**
   * Fügt eine neue Aufgabe hinzu
   * @param {Object} task - Die hinzuzufügende Aufgabe
   * @returns {Object} - Die hinzugefügte Aufgabe mit ID
   */
  addTask(task) {
    if (this.isTaskLimitReached()) {
      throw new Error(`Das Aufgabenlimit von ${this.maxTasks} ist erreicht. Upgrade auf einen höheren Plan, um mehr Aufgaben hinzuzufügen.`);
    }

    // Pflichtfelder prüfen
    if (!task.title) {
      throw new Error('Der Titel ist ein Pflichtfeld');
    }

    const now = new Date();
    
    // ID generieren
    const newTask = {
      ...task,
      id: this.generateUniqueId(),
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      createdAt: now,
      updatedAt: now
    };

    this.tasks.push(newTask);
    
    // Event auslösen
    this.triggerEvent('onTaskAdded', newTask);
    
    return newTask;
  }

  /**
   * Aktualisiert eine Aufgabe
   * @param {string} id - Die ID der zu aktualisierenden Aufgabe
   * @param {Object} updatedTask - Die aktualisierten Aufgabendaten
   * @returns {Object} - Die aktualisierte Aufgabe
   */
  updateTask(id, updatedTask) {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      throw new Error('Aufgabe nicht gefunden');
    }
    
    const now = new Date();
    
    // Aktualisieren der Aufgabe
    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updatedTask,
      id, // ID beibehalten
      updatedAt: now
    };
    
    // Event auslösen
    this.triggerEvent('onTaskUpdated', this.tasks[taskIndex]);
    
    return this.tasks[taskIndex];
  }

  /**
   * Entfernt eine Aufgabe
   * @param {string} id - Die ID der zu entfernenden Aufgabe
   * @returns {boolean} - True, wenn die Aufgabe erfolgreich entfernt wurde
   */
  removeTask(id) {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== id);
    
    const removed = this.tasks.length < initialLength;
    
    if (removed) {
      // Event auslösen
      this.triggerEvent('onTaskRemoved', { id });
    }
    
    return removed;
  }

  /**
   * Markiert eine Aufgabe als erledigt oder nicht erledigt
   * @param {string} id - Die ID der Aufgabe
   * @param {boolean} completed - Ob die Aufgabe erledigt ist
   * @returns {Object} - Die aktualisierte Aufgabe
   */
  completeTask(id, completed = true) {
    const task = this.getTaskById(id);
    
    if (!task) {
      throw new Error('Aufgabe nicht gefunden');
    }
    
    const now = new Date();
    
    return this.updateTask(id, {
      status: completed ? 'done' : 'todo',
      completedAt: completed ? now : null
    });
  }

  /**
   * Ändert den Status einer Aufgabe
   * @param {string} id - Die ID der Aufgabe
   * @param {string} status - Der neue Status (todo, in-progress, done)
   * @returns {Object} - Die aktualisierte Aufgabe
   */
  changeTaskStatus(id, status) {
    if (!['todo', 'in-progress', 'done'].includes(status)) {
      throw new Error('Ungültiger Status. Erlaubte Werte: todo, in-progress, done');
    }
    
    const task = this.getTaskById(id);
    
    if (!task) {
      throw new Error('Aufgabe nicht gefunden');
    }
    
    const now = new Date();
    const updates = { status };
    
    // Wenn als erledigt markiert, Abschlussdatum setzen
    if (status === 'done') {
      updates.completedAt = now;
    } else if (task.status === 'done' && status !== 'done') {
      // Wenn von erledigt zu nicht erledigt, Abschlussdatum entfernen
      updates.completedAt = null;
    }
    
    return this.updateTask(id, updates);
  }

  /**
   * Ändert die Priorität einer Aufgabe
   * @param {string} id - Die ID der Aufgabe
   * @param {string} priority - Die neue Priorität (low, medium, high)
   * @returns {Object} - Die aktualisierte Aufgabe
   */
  changeTaskPriority(id, priority) {
    if (!['low', 'medium', 'high'].includes(priority)) {
      throw new Error('Ungültige Priorität. Erlaubte Werte: low, medium, high');
    }
    
    const task = this.getTaskById(id);
    
    if (!task) {
      throw new Error('Aufgabe nicht gefunden');
    }
    
    return this.updateTask(id, { priority });
  }

  /**
   * Weist eine Aufgabe einer Person zu
   * @param {string} id - Die ID der Aufgabe
   * @param {string} assignee - Der Name der Person
   * @returns {Object} - Die aktualisierte Aufgabe
   */
  assignTask(id, assignee) {
    const task = this.getTaskById(id);
    
    if (!task) {
      throw new Error('Aufgabe nicht gefunden');
    }
    
    return this.updateTask(id, { assignee });
  }

  /**
   * Setzt eine Erinnerung für eine Aufgabe
   * @param {string} id - Die ID der Aufgabe
   * @param {Date} reminderDate - Das Datum der Erinnerung
   * @returns {Object} - Die aktualisierte Aufgabe
   */
  setReminder(id, reminderDate) {
    const task = this.getTaskById(id);
    
    if (!task) {
      throw new Error('Aufgabe nicht gefunden');
    }
    
    return this.updateTask(id, { reminder: reminderDate });
  }

  /**
   * Ruft eine Aufgabe anhand ihrer ID ab
   * @param {string} id - Die ID der Aufgabe
   * @returns {Object|null} - Die Aufgabe oder null, wenn nicht gefunden
   */
  getTaskById(id) {
    return this.tasks.find(task => task.id === id) || null;
  }

  /**
   * Ruft alle Aufgaben ab
   * @returns {Array} - Alle Aufgaben
   */
  getAllTasks() {
    return [...this.tasks];
  }

  /**
   * Filtert Aufgaben nach verschiedenen Kriterien
   * @param {Object} filters - Die anzuwendenden Filter
   * @returns {Array} - Die gefilterten Aufgaben
   */
  filterTasks(filters = {}) {
    return this.tasks.filter(task => {
      let match = true;
      
      // Nach Status filtern
      if (filters.status && task.status !== filters.status) {
        match = false;
      }
      
      // Nach Priorität filtern
      if (filters.priority && task.priority !== filters.priority) {
        match = false;
      }
      
      // Nach Kategorie filtern
      if (filters.category && task.category !== filters.category) {
        match = false;
      }
      
      // Nach Zugewiesenem filtern
      if (filters.assignee && task.assignee !== filters.assignee) {
        match = false;
      }
      
      // Nach Fälligkeitsdatum filtern
      if (filters.dueDateFrom && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const fromDate = new Date(filters.dueDateFrom);
        
        if (dueDate < fromDate) {
          match = false;
        }
      }
      
      if (filters.dueDateTo && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const toDate = new Date(filters.dueDateTo);
        
        if (dueDate > toDate) {
          match = false;
        }
      }
      
      // Nach Suchbegriff filtern
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const title = (task.title || '').toLowerCase();
        const description = (task.description || '').toLowerCase();
        const notes = (task.notes || '').toLowerCase();
        
        if (!title.includes(query) && !description.includes(query) && !notes.includes(query)) {
          match = false;
        }
      }
      
      return match;
    });
  }

  /**
   * Ruft überfällige Aufgaben ab
   * @returns {Array} - Überfällige Aufgaben
   */
  getOverdueTasks() {
    const now = new Date();
    
    return this.tasks.filter(task => {
      if (!task.dueDate || task.status === 'done') return false;
      
      const dueDate = new Date(task.dueDate);
      return dueDate < now;
    });
  }

  /**
   * Ruft anstehende Aufgaben ab
   * @param {number} days - Anzahl der Tage in die Zukunft
   * @returns {Array} - Anstehende Aufgaben
   */
  getUpcomingTasks(days = 7) {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);
    
    return this.tasks.filter(task => {
      if (!task.dueDate || task.status === 'done') return false;
      
      const dueDate = new Date(task.dueDate);
      return dueDate >= now && dueDate <= future;
    });
  }

  /**
   * Ruft fällige Erinnerungen ab
   * @returns {Array} - Fällige Erinnerungen
   */
  getDueReminders() {
    const now = new Date();
    
    return this.tasks.filter(task => {
      if (!task.reminder || task.status === 'done') return false;
      
      const reminderDate = new Date(task.reminder);
      return reminderDate <= now;
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
      color: category.color || this.getRandomColor(),
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
    // Prüfen, ob Aufgaben mit dieser Kategorie existieren
    const tasksWithCategory = this.tasks.filter(task => task.category === id);
    
    if (tasksWithCategory.length > 0) {
      throw new Error('Diese Kategorie kann nicht entfernt werden, da sie von Aufgaben verwendet wird');
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
   * Exportiert die Aufgabenliste in verschiedenen Formaten
   * @param {string} format - Das Exportformat (csv, json)
   * @returns {string} - Die exportierte Aufgabenliste
   */
  exportTasks(format = 'json') {
    switch (format.toLowerCase()) {
      case 'csv':
        return this.exportAsCSV();
      case 'json':
      default:
        return JSON.stringify(this.tasks, null, 2);
    }
  }

  /**
   * Exportiert die Aufgabenliste als CSV
   * @returns {string} - Die Aufgabenliste im CSV-Format
   */
  exportAsCSV() {
    const headers = [
      'Titel',
      'Beschreibung',
      'Fälligkeitsdatum',
      'Kategorie',
      'Priorität',
      'Status',
      'Zugewiesen an',
      'Erinnerung',
      'Notizen',
      'Erstellt am',
      'Aktualisiert am',
      'Abgeschlossen am'
    ];
    
    const rows = this.tasks.map(task => {
      const category = this.getCategoryById(task.category);
      
      return [
        task.title,
        task.description || '',
        task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '',
        category ? category.name : '',
        task.priority || 'medium',
        task.status || 'todo',
        task.assignee || '',
        task.reminder ? new Date(task.reminder).toLocaleDateString() : '',
        task.notes || '',
        task.createdAt ? new Date(task.createdAt).toLocaleDateString() : '',
        task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : '',
        task.completedAt ? new Date(task.completedAt).toLocaleDateString() : ''
      ];
    });
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csvContent;
  }

  /**
   * Berechnet Aufgabenstatistiken
   * @returns {Object} - Aufgabenstatistiken
   */
  getTaskStatistics() {
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter(task => task.status === 'done').length;
    const inProgressTasks = this.tasks.filter(task => task.status === 'in-progress').length;
    const todoTasks = this.tasks.filter(task => task.status === 'todo').length;
    
    const highPriorityTasks = this.tasks.filter(task => task.priority === 'high').length;
    const mediumPriorityTasks = this.tasks.filter(task => task.priority === 'medium').length;
    const lowPriorityTasks = this.tasks.filter(task => task.priority === 'low').length;
    
    const overdueTasks = this.getOverdueTasks().length;
    const upcomingTasks = this.getUpcomingTasks().length;
    
    // Statistiken pro Kategorie
    const categoryStats = {};
    
    this.categories.forEach(category => {
      const tasksInCategory = this.tasks.filter(task => task.category === category.id);
      
      const total = tasksInCategory.length;
      const completed = tasksInCategory.filter(task => task.status === 'done').length;
      const inProgress = tasksInCategory.filter(task => task.status === 'in-progress').length;
      const todo = tasksInCategory.filter(task => task.status === 'todo').length;
      
      categoryStats[category.id] = {
        name: category.name,
        color: category.color,
        total,
        completed,
        inProgress,
        todo,
        completionRate: total > 0 ? (completed / total) * 100 : 0
      };
    });
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      highPriorityTasks,
      mediumPriorityTasks,
      lowPriorityTasks,
      overdueTasks,
      upcomingTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      categoryStats
    };
  }

  /**
   * Generiert eine eindeutige ID
   * @param {string} prefix - Das Präfix für die ID
   * @returns {string} - Eine eindeutige ID
   */
  generateUniqueId(prefix = 'task_') {
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

// Exportieren des TaskManagementService
export default new TaskManagementService();
