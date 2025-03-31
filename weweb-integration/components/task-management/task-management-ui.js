// Task Management UI Component für LemonVows
// Diese Komponente stellt die Benutzeroberfläche für das Aufgabenmanagement dar

import { ref, computed, onMounted, watch } from 'vue';
import taskManagementService from './task-management-service.js';

export default {
  name: 'TaskManagementUI',
  
  props: {
    showReminders: {
      type: Boolean,
      default: true
    },
    maxTasks: {
      type: Number,
      default: 50
    },
    enableCategories: {
      type: Boolean,
      default: true
    },
    enableAssignees: {
      type: Boolean,
      default: false
    }
  },
  
  setup(props, { emit }) {
    // Reaktive Daten
    const tasks = ref([]);
    const categories = ref([]);
    const loading = ref(true);
    const selectedCategory = ref('all');
    const selectedStatus = ref('all');
    const selectedPriority = ref('all');
    const searchQuery = ref('');
    const statistics = ref({});
    const newTask = ref({
      title: '',
      description: '',
      dueDate: null,
      category: '',
      priority: 'medium',
      status: 'todo',
      assignee: '',
      notes: ''
    });
    
    // Beim Mounten der Komponente
    onMounted(() => {
      // Aufgabenlimit setzen
      taskManagementService.setTaskLimit(props.maxTasks);
      
      // Aufgabenmanagement initialisieren
      taskManagementService.initialize();
      
      // Aufgaben und Kategorien laden
      loadTasks();
      loadCategories();
      
      // Statistiken berechnen
      updateStatistics();
      
      loading.value = false;
    });
    
    // Aufgabenlimit aktualisieren, wenn sich die maxTasks-Prop ändert
    watch(() => props.maxTasks, (newLimit) => {
      taskManagementService.setTaskLimit(newLimit);
    });
    
    // Aufgaben laden
    const loadTasks = () => {
      tasks.value = taskManagementService.getAllTasks();
    };
    
    // Kategorien laden
    const loadCategories = () => {
      categories.value = taskManagementService.getAllCategories();
    };
    
    // Statistiken aktualisieren
    const updateStatistics = () => {
      statistics.value = taskManagementService.getTaskStatistics();
    };
    
    // Aufgabe hinzufügen
    const addTask = () => {
      try {
        const task = taskManagementService.addTask(newTask.value);
        
        // Formular zurücksetzen
        newTask.value = {
          title: '',
          description: '',
          dueDate: null,
          category: newTask.value.category, // Kategorie beibehalten
          priority: 'medium',
          status: 'todo',
          assignee: '',
          notes: ''
        };
        
        // Aufgaben neu laden
        loadTasks();
        
        // Statistiken aktualisieren
        updateStatistics();
        
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
        const task = taskManagementService.updateTask(id, updatedTask);
        
        // Aufgaben neu laden
        loadTasks();
        
        // Statistiken aktualisieren
        updateStatistics();
        
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
        const removed = taskManagementService.removeTask(id);
        
        if (removed) {
          // Aufgaben neu laden
          loadTasks();
          
          // Statistiken aktualisieren
          updateStatistics();
          
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
        const task = taskManagementService.completeTask(id, completed);
        
        // Aufgaben neu laden
        loadTasks();
        
        // Statistiken aktualisieren
        updateStatistics();
        
        emit('task-completed', task);
        
        return task;
      } catch (error) {
        console.error('Fehler beim Markieren der Aufgabe als erledigt:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Status einer Aufgabe ändern
    const changeTaskStatus = (id, status) => {
      try {
        const task = taskManagementService.changeTaskStatus(id, status);
        
        // Aufgaben neu laden
        loadTasks();
        
        // Statistiken aktualisieren
        updateStatistics();
        
        emit('task-status-changed', task);
        
        return task;
      } catch (error) {
        console.error('Fehler beim Ändern des Aufgabenstatus:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Priorität einer Aufgabe ändern
    const changeTaskPriority = (id, priority) => {
      try {
        const task = taskManagementService.changeTaskPriority(id, priority);
        
        // Aufgaben neu laden
        loadTasks();
        
        // Statistiken aktualisieren
        updateStatistics();
        
        emit('task-priority-changed', task);
        
        return task;
      } catch (error) {
        console.error('Fehler beim Ändern der Aufgabenpriorität:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Aufgabe zuweisen
    const assignTask = (id, assignee) => {
      if (!props.enableAssignees) return null;
      
      try {
        const task = taskManagementService.assignTask(id, assignee);
        
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
    
    // Erinnerung setzen
    const setReminder = (id, reminderDate) => {
      if (!props.showReminders) return null;
      
      try {
        const task = taskManagementService.setReminder(id, reminderDate);
        
        // Aufgaben neu laden
        loadTasks();
        
        emit('reminder-set', task);
        
        return task;
      } catch (error) {
        console.error('Fehler beim Setzen der Erinnerung:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Kategorie hinzufügen
    const addCategory = (category) => {
      if (!props.enableCategories) return null;
      
      try {
        const newCategory = taskManagementService.addCategory(category);
        
        // Kategorien neu laden
        loadCategories();
        
        emit('category-added', newCategory);
        
        return newCategory;
      } catch (error) {
        console.error('Fehler beim Hinzufügen der Kategorie:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Kategorie aktualisieren
    const updateCategory = (id, updatedCategory) => {
      if (!props.enableCategories) return null;
      
      try {
        const category = taskManagementService.updateCategory(id, updatedCategory);
        
        // Kategorien neu laden
        loadCategories();
        
        emit('category-updated', category);
        
        return category;
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Kategorie:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Kategorie entfernen
    const removeCategory = (id) => {
      if (!props.enableCategories) return false;
      
      try {
        const removed = taskManagementService.removeCategory(id);
        
        if (removed) {
          // Kategorien neu laden
          loadCategories();
          
          emit('category-removed', { id });
        }
        
        return removed;
      } catch (error) {
        console.error('Fehler beim Entfernen der Kategorie:', error);
        emit('error', error.message);
        return false;
      }
    };
    
    // Aufgaben exportieren
    const exportTasks = (format = 'json') => {
      try {
        const exportedTasks = taskManagementService.exportTasks(format);
        
        emit('tasks-exported', { format, content: exportedTasks });
        
        return exportedTasks;
      } catch (error) {
        console.error('Fehler beim Exportieren der Aufgaben:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Gefilterte Aufgaben
    const filteredTasks = computed(() => {
      const filters = {};
      
      // Nach Status filtern
      if (selectedStatus.value !== 'all') {
        filters.status = selectedStatus.value;
      }
      
      // Nach Priorität filtern
      if (selectedPriority.value !== 'all') {
        filters.priority = selectedPriority.value;
      }
      
      // Nach Kategorie filtern
      if (selectedCategory.value !== 'all') {
        filters.category = selectedCategory.value;
      }
      
      // Nach Suchbegriff filtern
      if (searchQuery.value) {
        filters.searchQuery = searchQuery.value;
      }
      
      return taskManagementService.filterTasks(filters);
    });
    
    // Aufgaben nach Status
    const tasksByStatus = computed(() => {
      return {
        todo: tasks.value.filter(task => task.status === 'todo'),
        inProgress: tasks.value.filter(task => task.status === 'in-progress'),
        done: tasks.value.filter(task => task.status === 'done')
      };
    });
    
    // Aufgaben nach Priorität
    const tasksByPriority = computed(() => {
      return {
        high: tasks.value.filter(task => task.priority === 'high'),
        medium: tasks.value.filter(task => task.priority === 'medium'),
        low: tasks.value.filter(task => task.priority === 'low')
      };
    });
    
    // Überfällige Aufgaben
    const overdueTasks = computed(() => {
      return taskManagementService.getOverdueTasks();
    });
    
    // Anstehende Aufgaben
    const upcomingTasks = computed(() => {
      return taskManagementService.getUpcomingTasks();
    });
    
    // Fällige Erinnerungen
    const dueReminders = computed(() => {
      if (!props.showReminders) return [];
      
      return taskManagementService.getDueReminders();
    });
    
    // Prüfen, ob das Aufgabenlimit erreicht ist
    const isTaskLimitReached = computed(() => {
      return taskManagementService.isTaskLimitReached();
    });
    
    // Fortschritt berechnen
    const progress = computed(() => {
      if (!statistics.value.completionRate) return 0;
      
      return Math.round(statistics.value.completionRate);
    });
    
    return {
      tasks,
      categories,
      loading,
      selectedCategory,
      selectedStatus,
      selectedPriority,
      searchQuery,
      statistics,
      newTask,
      filteredTasks,
      tasksByStatus,
      tasksByPriority,
      overdueTasks,
      upcomingTasks,
      dueReminders,
      isTaskLimitReached,
      progress,
      addTask,
      updateTask,
      removeTask,
      completeTask,
      changeTaskStatus,
      changeTaskPriority,
      assignTask,
      setReminder,
      addCategory,
      updateCategory,
      removeCategory,
      exportTasks
    };
  },
  
  // WeWeb-spezifische Konfiguration
  weweb: {
    type: 'component',
    uiSchema: {
      ui:maxTasks: {
        type: 'number',
        label: 'Maximale Anzahl an Aufgaben',
        min: 1
      },
      ui:showReminders: {
        type: 'toggle',
        label: 'Erinnerungen anzeigen'
      },
      ui:enableCategories: {
        type: 'toggle',
        label: 'Kategorisierung von Aufgaben ermöglichen'
      },
      ui:enableAssignees: {
        type: 'toggle',
        label: 'Zuweisung von Aufgaben an Personen ermöglichen'
      }
    }
  }
};
