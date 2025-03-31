// Best Man Section Service für LemonVows
// Diese Klasse implementiert die Logik für den geschützten Bereich für Trauzeugen

import bestManSectionModel from './best-man-section-model.json';

class BestManSectionService {
  constructor() {
    this.dataModel = bestManSectionModel.dataModel;
    this.defaultRoles = bestManSectionModel.defaultRoles;
    this.users = [];
    this.tasks = [];
    this.notes = [];
    this.events = [];
    this.maxUsers = 5; // Standard für Free-Version
    this.currentUser = null;
  }

  /**
   * Setzt das Limit für die maximale Anzahl an Trauzeugen basierend auf der Preisstufe
   * @param {number} limit - Das neue Limit
   */
  setUserLimit(limit) {
    this.maxUsers = limit;
  }

  /**
   * Prüft, ob das Benutzerlimit erreicht ist
   * @returns {boolean} - True, wenn das Limit erreicht ist, sonst False
   */
  isUserLimitReached() {
    return this.users.length >= this.maxUsers;
  }

  /**
   * Initialisiert den Trauzeugenbereich
   */
  initialize() {
    // Event auslösen
    this.triggerEvent('onBestManSectionInitialized', {
      defaultRoles: this.defaultRoles
    });
    
    return {
      defaultRoles: this.defaultRoles
    };
  }

  /**
   * Fügt einen neuen Trauzeugen hinzu
   * @param {Object} user - Der hinzuzufügende Trauzeuge
   * @returns {Object} - Der hinzugefügte Trauzeuge mit ID
   */
  addUser(user) {
    if (this.isUserLimitReached()) {
      throw new Error(`Das Benutzerlimit von ${this.maxUsers} ist erreicht. Upgrade auf einen höheren Plan, um mehr Trauzeugen hinzuzufügen.`);
    }

    // Pflichtfelder prüfen
    if (!user.name || !user.email) {
      throw new Error('Name und E-Mail sind Pflichtfelder');
    }

    // Prüfen, ob die E-Mail bereits verwendet wird
    if (this.users.some(u => u.email === user.email)) {
      throw new Error('Diese E-Mail-Adresse wird bereits verwendet');
    }

    const now = new Date();
    
    // Zugangscode generieren
    const accessCode = this.generateAccessCode();
    
    // ID generieren
    const newUser = {
      ...user,
      id: this.generateUniqueId('user_'),
      role: user.role || 'other',
      accessCode,
      isActive: true,
      createdAt: now
    };

    this.users.push(newUser);
    
    // Event auslösen
    this.triggerEvent('onUserAdded', newUser);
    
    return newUser;
  }

  /**
   * Aktualisiert einen Trauzeugen
   * @param {string} id - Die ID des zu aktualisierenden Trauzeugen
   * @param {Object} updatedUser - Die aktualisierten Benutzerdaten
   * @returns {Object} - Der aktualisierte Trauzeuge
   */
  updateUser(id, updatedUser) {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error('Benutzer nicht gefunden');
    }
    
    // Prüfen, ob die E-Mail bereits verwendet wird
    if (updatedUser.email && updatedUser.email !== this.users[userIndex].email && 
        this.users.some(u => u.email === updatedUser.email)) {
      throw new Error('Diese E-Mail-Adresse wird bereits verwendet');
    }
    
    // Aktualisieren des Benutzers
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updatedUser,
      id // ID beibehalten
    };
    
    // Event auslösen
    this.triggerEvent('onUserUpdated', this.users[userIndex]);
    
    return this.users[userIndex];
  }

  /**
   * Entfernt einen Trauzeugen
   * @param {string} id - Die ID des zu entfernenden Trauzeugen
   * @returns {boolean} - True, wenn der Trauzeuge erfolgreich entfernt wurde
   */
  removeUser(id) {
    // Prüfen, ob dem Benutzer Aufgaben zugewiesen sind
    const assignedTasks = this.tasks.filter(task => task.assignedTo === id).length;
    
    if (assignedTasks > 0) {
      throw new Error(`Dieser Benutzer kann nicht entfernt werden, da ihm ${assignedTasks} Aufgaben zugewiesen sind. Bitte weisen Sie die Aufgaben zuerst einem anderen Benutzer zu.`);
    }
    
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    
    const removed = this.users.length < initialLength;
    
    if (removed) {
      // Notizen dieses Benutzers entfernen
      this.notes = this.notes.filter(note => note.author !== id);
      
      // Event auslösen
      this.triggerEvent('onUserRemoved', { id });
    }
    
    return removed;
  }

  /**
   * Deaktiviert einen Trauzeugen
   * @param {string} id - Die ID des zu deaktivierenden Trauzeugen
   * @returns {Object} - Der aktualisierte Trauzeuge
   */
  deactivateUser(id) {
    const user = this.getUserById(id);
    
    if (!user) {
      throw new Error('Benutzer nicht gefunden');
    }
    
    return this.updateUser(id, { isActive: false });
  }

  /**
   * Aktiviert einen Trauzeugen
   * @param {string} id - Die ID des zu aktivierenden Trauzeugen
   * @returns {Object} - Der aktualisierte Trauzeuge
   */
  activateUser(id) {
    const user = this.getUserById(id);
    
    if (!user) {
      throw new Error('Benutzer nicht gefunden');
    }
    
    return this.updateUser(id, { isActive: true });
  }

  /**
   * Generiert einen neuen Zugangscode für einen Trauzeugen
   * @param {string} id - Die ID des Trauzeugen
   * @returns {Object} - Der aktualisierte Trauzeuge
   */
  regenerateAccessCode(id) {
    const user = this.getUserById(id);
    
    if (!user) {
      throw new Error('Benutzer nicht gefunden');
    }
    
    const accessCode = this.generateAccessCode();
    
    return this.updateUser(id, { accessCode });
  }

  /**
   * Authentifiziert einen Trauzeugen
   * @param {string} email - Die E-Mail-Adresse
   * @param {string} accessCode - Der Zugangscode
   * @returns {Object|null} - Der authentifizierte Trauzeuge oder null, wenn die Authentifizierung fehlschlägt
   */
  authenticateUser(email, accessCode) {
    const user = this.users.find(user => user.email === email && user.accessCode === accessCode);
    
    if (!user) {
      return null;
    }
    
    if (!user.isActive) {
      return null;
    }
    
    // Letzten Login aktualisieren
    this.updateUser(user.id, { lastLogin: new Date() });
    
    // Aktuellen Benutzer setzen
    this.currentUser = user;
    
    // Event auslösen
    this.triggerEvent('onUserAuthenticated', user);
    
    return user;
  }

  /**
   * Meldet den aktuellen Benutzer ab
   */
  logout() {
    const user = this.currentUser;
    this.currentUser = null;
    
    if (user) {
      // Event auslösen
      this.triggerEvent('onUserLoggedOut', user);
    }
  }

  /**
   * Fügt eine neue Aufgabe hinzu
   * @param {Object} task - Die hinzuzufügende Aufgabe
   * @returns {Object} - Die hinzugefügte Aufgabe mit ID
   */
  addTask(task) {
    // Pflichtfelder prüfen
    if (!task.title) {
      throw new Error('Der Titel ist ein Pflichtfeld');
    }

    // Prüfen, ob der zugewiesene Benutzer existiert
    if (task.assignedTo && !this.getUserById(task.assignedTo)) {
      throw new Error('Der zugewiesene Benutzer existiert nicht');
    }

    const now = new Date();
    
    // ID generieren
    const newTask = {
      ...task,
      id: this.generateUniqueId('task_'),
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      isPrivate: task.isPrivate !== undefined ? task.isPrivate : true,
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
    
    // Prüfen, ob der zugewiesene Benutzer existiert
    if (updatedTask.assignedTo && !this.getUserById(updatedTask.assignedTo)) {
      throw new Error('Der zugewiesene Benutzer existiert nicht');
    }
    
    const now = new Date();
    
    // Aktualisieren der Aufgabe
    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updatedTask,
      id, // ID beibehalten
      updatedAt: now
    };
    
    // Wenn als erledigt markiert, Abschlussdatum setzen
    if (updatedTask.status === 'done' && !this.tasks[taskIndex].completedAt) {
      this.tasks[taskIndex].completedAt = now;
    } else if (updatedTask.status && updatedTask.status !== 'done') {
      // Wenn von erledigt zu nicht erledigt, Abschlussdatum entfernen
      this.tasks[taskIndex].completedAt = null;
    }
    
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
    
    return this.updateTask(id, {
      status: completed ? 'done' : 'todo',
      completedAt: completed ? new Date() : null
    });
  }

  /**
   * Weist eine Aufgabe einem Benutzer zu
   * @param {string} taskId - Die ID der Aufgabe
   * @param {string} userId - Die ID des Benutzers
   * @returns {Object} - Die aktualisierte Aufgabe
   */
  assignTask(taskId, userId) {
    const task = this.getTaskById(taskId);
    
    if (!task) {
      throw new Error('Aufgabe nicht gefunden');
    }
    
    const user = this.getUserById(userId);
    
    if (!user) {
      throw new Error('Benutzer nicht gefunden');
    }
    
    return this.updateTask(taskId, { assignedTo: userId });
  }

  /**
   * Fügt eine neue Notiz hinzu
   * @param {Object} note - Die hinzuzufügende Notiz
   * @returns {Object} - Die hinzugefügte Notiz mit ID
   */
  addNote(note) {
    // Pflichtfelder prüfen
    if (!note.title) {
      throw new Error('Der Titel ist ein Pflichtfeld');
    }

    // Prüfen, ob der Autor existiert
    if (note.author && !this.getUserById(note.author)) {
      throw new Error('Der angegebene Autor existiert nicht');
    }

    const now = new Date();
    
    // ID generieren
    const newNote = {
      ...note,
      id: this.generateUniqueId('note_'),
      isPrivate: note.isPrivate !== undefined ? note.isPrivate : true,
      createdAt: now,
      updatedAt: now
    };

    this.notes.push(newNote);
    
    // Event auslösen
    this.triggerEvent('onNoteAdded', newNote);
    
    return newNote;
  }

  /**
   * Aktualisiert eine Notiz
   * @param {string} id - Die ID der zu aktualisierenden Notiz
   * @param {Object} updatedNote - Die aktualisierten Notizdaten
   * @returns {Object} - Die aktualisierte Notiz
   */
  updateNote(id, updatedNote) {
    const noteIndex = this.notes.findIndex(note => note.id === id);
    
    if (noteIndex === -1) {
      throw new Error('Notiz nicht gefunden');
    }
    
    const now = new Date();
    
    // Aktualisieren der Notiz
    this.notes[noteIndex] = {
      ...this.notes[noteIndex],
      ...updatedNote,
      id, // ID beibehalten
      updatedAt: now
    };
    
    // Event auslösen
    this.triggerEvent('onNoteUpdated', this.notes[noteIndex]);
    
    return this.notes[noteIndex];
  }

  /**
   * Entfernt eine Notiz
   * @param {string} id - Die ID der zu entfernenden Notiz
   * @returns {boolean} - True, wenn die Notiz erfolgreich entfernt wurde
   */
  removeNote(id) {
    const initialLength = this.notes.length;
    this.notes = this.notes.filter(note => note.id !== id);
    
    const removed = this.notes.length < initialLength;
    
    if (removed) {
      // Event auslösen
      this.triggerEvent('onNoteRemoved', { id });
    }
    
    return removed;
  }

  /**
   * Fügt ein neues Ereignis hinzu
   * @param {Object} event - Das hinzuzufügende Ereignis
   * @returns {Object} - Das hinzugefügte Ereignis mit ID
   */
  addEvent(event) {
    // Pflichtfelder prüfen
    if (!event.title || !event.startDate) {
      throw new Error('Titel und Startdatum sind Pflichtfelder');
    }

    const now = new Date();
    
    // ID generieren
    const newEvent = {
      ...event,
      id: this.generateUniqueId('event_'),
      isPrivate: event.isPrivate !== undefined ? event.isPrivate : true,
      createdAt: now,
      updatedAt: now
    };

    this.events.push(newEvent);
    
    // Event auslösen
    this.triggerEvent('onEventAdded', newEvent);
    
    return newEvent;
  }

  /**
   * Aktualisiert ein Ereignis
   * @param {string} id - Die ID des zu aktualisierenden Ereignisses
   * @param {Object} updatedEvent - Die aktualisierten Ereignisdaten
   * @returns {Object} - Das aktualisierte Ereignis
   */
  updateEvent(id, updatedEvent) {
    const eventIndex = this.events.findIndex(event => event.id === id);
    
    if (eventIndex === -1) {
      throw new Error('Ereignis nicht gefunden');
    }
    
    const now = new Date();
    
    // Aktualisieren des Ereignisses
    this.events[eventIndex] = {
      ...this.events[eventIndex],
      ...updatedEvent,
      id, // ID beibehalten
      updatedAt: now
    };
    
    // Event auslösen
    this.triggerEvent('onEventUpdated', this.events[eventIndex]);
    
    return this.events[eventIndex];
  }

  /**
   * Entfernt ein Ereignis
   * @param {string} id - Die ID des zu entfernenden Ereignisses
   * @returns {boolean} - True, wenn das Ereignis erfolgreich entfernt wurde
   */
  removeEvent(id) {
    const initialLength = this.events.length;
    this.events = this.events.filter(event => event.id !== id);
    
    const removed = this.events.length < initialLength;
    
    if (removed) {
      // Event auslösen
      this.triggerEvent('onEventRemoved', { id });
    }
    
    return removed;
  }

  /**
   * Ruft einen Benutzer anhand seiner ID ab
   * @param {string} id - Die ID des Benutzers
   * @returns {Object|null} - Der Benutzer oder null, wenn nicht gefunden
   */
  getUserById(id) {
    return this.users.find(user => user.id === id) || null;
  }

  /**
   * Ruft alle Benutzer ab
   * @returns {Array} - Alle Benutzer
   */
  getAllUsers() {
    return [...this.users];
  }

  /**
   * Ruft aktive Benutzer ab
   * @returns {Array} - Aktive Benutzer
   */
  getActiveUsers() {
    return this.users.filter(user => user.isActive);
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
   * Ruft Aufgaben für einen Benutzer ab
   * @param {string} userId - Die ID des Benutzers
   * @returns {Array} - Aufgaben für den Benutzer
   */
  getTasksForUser(userId) {
    return this.tasks.filter(task => task.assignedTo === userId);
  }

  /**
   * Ruft öffentliche Aufgaben ab
   * @returns {Array} - Öffentliche Aufgaben
   */
  getPublicTasks() {
    return this.tasks.filter(task => !task.isPrivate);
  }

  /**
   * Ruft eine Notiz anhand ihrer ID ab
   * @param {string} id - Die ID der Notiz
   * @returns {Object|null} - Die Notiz oder null, wenn nicht gefunden
   */
  getNoteById(id) {
    return this.notes.find(note => note.id === id) || null;
  }

  /**
   * Ruft alle Notizen ab
   * @returns {Array} - Alle Notizen
   */
  getAllNotes() {
    return [...this.notes];
  }

  /**
   * Ruft Notizen für einen Benutzer ab
   * @param {string} userId - Die ID des Benutzers
   * @returns {Array} - Notizen für den Benutzer
   */
  getNotesForUser(userId) {
    return this.notes.filter(note => note.author === userId);
  }

  /**
   * Ruft öffentliche Notizen ab
   * @returns {Array} - Öffentliche Notizen
   */
  getPublicNotes() {
    return this.notes.filter(note => !note.isPrivate);
  }

  /**
   * Ruft ein Ereignis anhand seiner ID ab
   * @param {string} id - Die ID des Ereignisses
   * @returns {Object|null} - Das Ereignis oder null, wenn nicht gefunden
   */
  getEventById(id) {
    return this.events.find(event => event.id === id) || null;
  }

  /**
   * Ruft alle Ereignisse ab
   * @returns {Array} - Alle Ereignisse
   */
  getAllEvents() {
    return [...this.events];
  }

  /**
   * Ruft öffentliche Ereignisse ab
   * @returns {Array} - Öffentliche Ereignisse
   */
  getPublicEvents() {
    return this.events.filter(event => !event.isPrivate);
  }

  /**
   * Ruft anstehende Ereignisse ab
   * @param {number} days - Anzahl der Tage in die Zukunft
   * @returns {Array} - Anstehende Ereignisse
   */
  getUpcomingEvents(days = 30) {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);
    
    return this.events.filter(event => {
      const startDate = new Date(event.startDate);
      return startDate >= now && startDate <= future;
    });
  }

  /**
   * Generiert einen Zugangscode
   * @returns {string} - Ein zufälliger Zugangscode
   */
  generateAccessCode() {
    // 6-stelliger alphanumerischer Code
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return code;
  }

  /**
   * Generiert eine eindeutige ID
   * @param {string} prefix - Das Präfix für die ID
   * @returns {string} - Eine eindeutige ID
   */
  generateUniqueId(prefix = 'bestman_') {
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

// Exportieren des BestManSectionService
export default new BestManSectionService();
