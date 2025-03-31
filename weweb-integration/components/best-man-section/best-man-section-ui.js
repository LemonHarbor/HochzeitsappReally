// Best Man Section UI Component für LemonVows
// Diese Komponente stellt die Benutzeroberfläche für den geschützten Bereich für Trauzeugen dar

import { ref, computed, onMounted, watch } from 'vue';
import bestManSectionService from './best-man-section-service.js';

export default {
  name: 'BestManSectionUI',
  
  props: {
    maxUsers: {
      type: Number,
      default: 5
    },
    enablePrivateNotes: {
      type: Boolean,
      default: true
    },
    enablePrivateTasks: {
      type: Boolean,
      default: true
    },
    enablePrivateEvents: {
      type: Boolean,
      default: true
    }
  },
  
  setup(props, { emit }) {
    // Reaktive Daten
    const users = ref([]);
    const tasks = ref([]);
    const notes = ref([]);
    const events = ref([]);
    const loading = ref(true);
    const isAuthenticated = ref(false);
    const currentUser = ref(null);
    const selectedTask = ref(null);
    const selectedNote = ref(null);
    const selectedEvent = ref(null);
    const loginData = ref({
      email: '',
      accessCode: ''
    });
    const newUser = ref({
      name: '',
      email: '',
      role: 'other'
    });
    const newTask = ref({
      title: '',
      description: '',
      assignedTo: '',
      dueDate: null,
      priority: 'medium',
      isPrivate: true
    });
    const newNote = ref({
      title: '',
      content: '',
      isPrivate: true
    });
    const newEvent = ref({
      title: '',
      description: '',
      location: '',
      startDate: null,
      endDate: null,
      isPrivate: true
    });
    
    // Beim Mounten der Komponente
    onMounted(() => {
      // Benutzerlimit setzen
      bestManSectionService.setUserLimit(props.maxUsers);
      
      // Trauzeugenbereich initialisieren
      bestManSectionService.initialize();
      
      loading.value = false;
    });
    
    // Benutzerlimit aktualisieren, wenn sich die maxUsers-Prop ändert
    watch(() => props.maxUsers, (newLimit) => {
      bestManSectionService.setUserLimit(newLimit);
    });
    
    // Daten laden
    const loadData = () => {
      loadUsers();
      loadTasks();
      loadNotes();
      loadEvents();
    };
    
    // Benutzer laden
    const loadUsers = () => {
      users.value = bestManSectionService.getAllUsers();
    };
    
    // Aufgaben laden
    const loadTasks = () => {
      tasks.value = bestManSectionService.getAllTasks();
    };
    
    // Notizen laden
    const loadNotes = () => {
      notes.value = bestManSectionService.getAllNotes();
    };
    
    // Ereignisse laden
    const loadEvents = () => {
      events.value = bestManSectionService.getAllEvents();
    };
    
    // Benutzer hinzufügen
    const addUser = () => {
      try {
        const user = bestManSectionService.addUser(newUser.value);
        
        // Formular zurücksetzen
        newUser.value = {
          name: '',
          email: '',
          role: 'other'
        };
        
        // Benutzer neu laden
        loadUsers();
        
        emit('user-added', user);
        
        return user;
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Benutzers:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Benutzer aktualisieren
    const updateUser = (id, updatedUser) => {
      try {
        const user = bestManSectionService.updateUser(id, updatedUser);
        
        // Benutzer neu laden
        loadUsers();
        
        // Wenn der aktuelle Benutzer aktualisiert wurde, auch currentUser aktualisieren
        if (currentUser.value && currentUser.value.id === id) {
          currentUser.value = user;
        }
        
        emit('user-updated', user);
        
        return user;
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Benutzers:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Benutzer entfernen
    const removeUser = (id) => {
      try {
        const removed = bestManSectionService.removeUser(id);
        
        if (removed) {
          // Benutzer neu laden
          loadUsers();
          
          emit('user-removed', { id });
        }
        
        return removed;
      } catch (error) {
        console.error('Fehler beim Entfernen des Benutzers:', error);
        emit('error', error.message);
        return false;
      }
    };
    
    // Benutzer deaktivieren
    const deactivateUser = (id) => {
      try {
        const user = bestManSectionService.deactivateUser(id);
        
        // Benutzer neu laden
        loadUsers();
        
        emit('user-deactivated', user);
        
        return user;
      } catch (error) {
        console.error('Fehler beim Deaktivieren des Benutzers:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Benutzer aktivieren
    const activateUser = (id) => {
      try {
        const user = bestManSectionService.activateUser(id);
        
        // Benutzer neu laden
        loadUsers();
        
        emit('user-activated', user);
        
        return user;
      } catch (error) {
        console.error('Fehler beim Aktivieren des Benutzers:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Zugangscode neu generieren
    const regenerateAccessCode = (id) => {
      try {
        const user = bestManSectionService.regenerateAccessCode(id);
        
        // Benutzer neu laden
        loadUsers();
        
        emit('access-code-regenerated', user);
        
        return user;
      } catch (error) {
        console.error('Fehler beim Regenerieren des Zugangscodes:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Benutzer authentifizieren
    const login = () => {
      try {
        const user = bestManSectionService.authenticateUser(loginData.value.email, loginData.value.accessCode);
        
        if (user) {
          isAuthenticated.value = true;
          currentUser.value = user;
          
          // Daten laden
          loadData();
          
          emit('login-success', user);
        } else {
          emit('login-failed', 'Ungültige E-Mail oder Zugangscode');
        }
        
        return user;
      } catch (error) {
        console.error('Fehler beim Login:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Benutzer abmelden
    const logout = () => {
      bestManSectionService.logout();
      isAuthenticated.value = false;
      currentUser.value = null;
      
      emit('logout');
    };
    
    // Aufgabe hinzufügen
    const addTask = () => {
      try {
        // Wenn ein Benutzer angemeldet ist, diesen als Autor setzen
        if (currentUser.value && !newTask.value.assignedTo) {
          newTask.value.assignedTo = currentUser.value.id;
        }
        
        const task = bestManSectionService.addTask(newTask.value);
        
        // Formular zurücksetzen
        newTask.value = {
          title: '',
          description: '',
          assignedTo: newTask.value.assignedTo, // Zugewiesenen Benutzer beibehalten
          dueDate: null,
          priority: 'medium',
          isPrivate: props.enablePrivateTasks
        };
        
        // Aufgaben neu laden
        loadTasks();
        
        emit('task-added', task);
        
        return task;
      } catch (error) {
        console.error('Fehler beim Hinzufügen der Aufgabe:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Aufgabe aktualisieren
    const updateTask = (id, updatedTask) => {
      try {
        const task = bestManSectionService.updateTask(id, updatedTask);
        
        // Aufgaben neu laden
        loadTasks();
        
        emit('task-updated', task);
        
        return task;
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Aufgabe:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Aufgabe entfernen
    const removeTask = (id) => {
      try {
        const removed = bestManSectionService.removeTask(id);
        
        if (removed) {
          // Aufgaben neu laden
          loadTasks();
          
          // Wenn die ausgewählte Aufgabe entfernt wurde, Auswahl zurücksetzen
          if (selectedTask.value && selectedTask.value.id === id) {
            selectedTask.value = null;
          }
          
          emit('task-removed', { id });
        }
        
        return removed;
      } catch (error) {
        console.error('Fehler beim Entfernen der Aufgabe:', error);
        emit('error', error.message);
        return false;
      }
    };
    
    // Aufgabe als erledigt markieren
    const completeTask = (id, completed = true) => {
      try {
        const task = bestManSectionService.completeTask(id, completed);
        
        // Aufgaben neu laden
        loadTasks();
        
        emit('task-completed', task);
        
        return task;
      } catch (error) {
        console.error('Fehler beim Markieren der Aufgabe als erledigt:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Aufgabe zuweisen
    const assignTask = (taskId, userId) => {
      try {
        const task = bestManSectionService.assignTask(taskId, userId);
        
        // Aufgaben neu laden
        loadTasks();
        
        emit('task-assigned', task);
        
        return task;
      } catch (error) {
        console.error('Fehler beim Zuweisen der Aufgabe:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Notiz hinzufügen
    const addNote = () => {
      try {
        // Wenn ein Benutzer angemeldet ist, diesen als Autor setzen
        if (currentUser.value) {
          newNote.value.author = currentUser.value.id;
        }
        
        const note = bestManSectionService.addNote(newNote.value);
        
        // Formular zurücksetzen
        newNote.value = {
          title: '',
          content: '',
          isPrivate: props.enablePrivateNotes
        };
        
        // Notizen neu laden
        loadNotes();
        
        emit('note-added', note);
        
        return note;
      } catch (error) {
        console.error('Fehler beim Hinzufügen der Notiz:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Notiz aktualisieren
    const updateNote = (id, updatedNote) => {
      try {
        const note = bestManSectionService.updateNote(id, updatedNote);
        
        // Notizen neu laden
        loadNotes();
        
        emit('note-updated', note);
        
        return note;
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Notiz:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Notiz entfernen
    const removeNote = (id) => {
      try {
        const removed = bestManSectionService.removeNote(id);
        
        if (removed) {
          // Notizen neu laden
          loadNotes();
          
          // Wenn die ausgewählte Notiz entfernt wurde, Auswahl zurücksetzen
          if (selectedNote.value && selectedNote.value.id === id) {
            selectedNote.value = null;
          }
          
          emit('note-removed', { id });
        }
        
        return removed;
      } catch (error) {
        console.error('Fehler beim Entfernen der Notiz:', error);
        emit('error', error.message);
        return false;
      }
    };
    
    // Ereignis hinzufügen
    const addEvent = () => {
      try {
        const event = bestManSectionService.addEvent(newEvent.value);
        
        // Formular zurücksetzen
        newEvent.value = {
          title: '',
          description: '',
          location: '',
          startDate: null,
          endDate: null,
          isPrivate: props.enablePrivateEvents
        };
        
        // Ereignisse neu laden
        loadEvents();
        
        emit('event-added', event);
        
        return event;
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Ereignisses:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Ereignis aktualisieren
    const updateEvent = (id, updatedEvent) => {
      try {
        const event = bestManSectionService.updateEvent(id, updatedEvent);
        
        // Ereignisse neu laden
        loadEvents();
        
        emit('event-updated', event);
        
        return event;
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Ereignisses:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Ereignis entfernen
    const removeEvent = (id) => {
      try {
        const removed = bestManSectionService.removeEvent(id);
        
        if (removed) {
          // Ereignisse neu laden
          loadEvents();
          
          // Wenn das ausgewählte Ereignis entfernt wurde, Auswahl zurücksetzen
          if (selectedEvent.value && selectedEvent.value.id === id) {
            selectedEvent.value = null;
          }
          
          emit('event-removed', { id });
        }
        
        return removed;
      } catch (error) {
        console.error('Fehler beim Entfernen des Ereignisses:', error);
        emit('error', error.message);
        return false;
      }
    };
    
    // Aufgabe auswählen
    const selectTask = (id) => {
      const task = bestManSectionService.getTaskById(id);
      
      if (task) {
        selectedTask.value = task;
        emit('task-selected', task);
      }
      
      return task;
    };
    
    // Notiz auswählen
    const selectNote = (id) => {
      const note = bestManSectionService.getNoteById(id);
      
      if (note) {
        selectedNote.value = note;
        emit('note-selected', note);
      }
      
      return note;
    };
    
    // Ereignis auswählen
    const selectEvent = (id) => {
      const event = bestManSectionService.getEventById(id);
      
      if (event) {
        selectedEvent.value = event;
        emit('event-selected', event);
      }
      
      return event;
    };
    
    // Auswahl zurücksetzen
    const clearSelection = () => {
      selectedTask.value = null;
      selectedNote.value = null;
      selectedEvent.value = null;
      
      emit('selection-cleared');
    };
    
    // Aktive Benutzer
    const activeUsers = computed(() => {
      return bestManSectionService.getActiveUsers();
    });
    
    // Aufgaben für den aktuellen Benutzer
    const tasksForCurrentUser = computed(() => {
      if (!currentUser.value) return [];
      
      return bestManSectionService.getTasksForUser(currentUser.value.id);
    });
    
    // Öffentliche Aufgaben
    const publicTasks = computed(() => {
      return bestManSectionService.getPublicTasks();
    });
    
    // Notizen für den aktuellen Benutzer
    const notesForCurrentUser = computed(() => {
      if (!currentUser.value) return [];
      
      return bestManSectionService.getNotesForUser(currentUser.value.id);
    });
    
    // Öffentliche Notizen
    const publicNotes = computed(() => {
      return bestManSectionService.getPublicNotes();
    });
    
    // Öffentliche Ereignisse
    const publicEvents = computed(() => {
      return bestManSectionService.getPublicEvents();
    });
    
    // Anstehende Ereignisse
    const upcomingEvents = computed(() => {
      return bestManSectionService.getUpcomingEvents(30);
    });
    
    // Prüfen, ob das Benutzerlimit erreicht ist
    const isUserLimitReached = computed(() => {
      return bestManSectionService.isUserLimitReached();
    });
    
    // Verfügbare Rollen
    const availableRoles = computed(() => {
      return bestManSectionService.defaultRoles;
    });
    
    return {
      users,
      tasks,
      notes,
      events,
      loading,
      isAuthenticated,
      currentUser,
      selectedTask,
      selectedNote,
      selectedEvent,
      loginData,
      newUser,
      newTask,
      newNote,
      newEvent,
      activeUsers,
      tasksForCurrentUser,
      publicTasks,
      notesForCurrentUser,
      publicNotes,
      publicEvents,
      upcomingEvents,
      isUserLimitReached,
      availableRoles,
      addUser,
      updateUser,
      removeUser,
      deactivateUser,
      activateUser,
      regenerateAccessCode,
      login,
      logout,
      addTask,
      updateTask,
      removeTask,
      completeTask,
      assignTask,
      addNote,
      updateNote,
      removeNote,
      addEvent,
      updateEvent,
      removeEvent,
      selectTask,
      selectNote,
      selectEvent,
      clearSelection
    };
  },
  
  // WeWeb-spezifische Konfiguration
  weweb: {
    type: 'component',
    uiSchema: {
      ui:maxUsers: {
        type: 'number',
        label: 'Maximale Anzahl an Trauzeugen',
        min: 1
      },
      ui:enablePrivateNotes: {
        type: 'toggle',
        label: 'Private Notizen aktivieren'
      },
      ui:enablePrivateTasks: {
        type: 'toggle',
        label: 'Private Aufgaben aktivieren'
      },
      ui:enablePrivateEvents: {
        type: 'toggle',
        label: 'Private Ereignisse aktivieren'
      }
    }
  }
};
