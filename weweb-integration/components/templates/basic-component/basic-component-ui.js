// Basic Component UI für WeWeb
// Diese Komponente stellt die Benutzeroberfläche für die Basis-Komponente dar

import { ref, computed, onMounted, watch } from 'vue';
import basicComponentService from './basic-component-service.js';

export default {
  name: 'BasicComponentUI',
  
  props: {
    title: {
      type: String,
      default: 'Basis-Komponente'
    },
    description: {
      type: String,
      default: 'Eine einfache Basis-Komponente für WeWeb'
    },
    theme: {
      type: String,
      default: 'light',
      validator: (value) => ['light', 'dark'].includes(value)
    },
    language: {
      type: String,
      default: 'de',
      validator: (value) => ['de', 'en'].includes(value)
    }
  },
  
  setup(props, { emit, slots }) {
    // Reaktive Daten
    const items = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const searchQuery = ref('');
    const selectedStatus = ref('all');
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const sortField = ref('name');
    const sortOrder = ref('asc');
    const selectedItem = ref(null);
    const isFormVisible = ref(false);
    const formMode = ref('add'); // 'add' oder 'edit'
    const newItem = ref({
      name: '',
      description: '',
      status: 'active',
      tags: []
    });
    
    // Beim Mounten der Komponente
    onMounted(() => {
      // Theme und Sprache setzen
      basicComponentService.setTheme(props.theme);
      basicComponentService.setLanguage(props.language);
      
      // Items laden
      loadItems();
      
      // Event-Listener registrieren
      basicComponentService.addEventListener('onItemAdded', handleItemAdded);
      basicComponentService.addEventListener('onItemUpdated', handleItemUpdated);
      basicComponentService.addEventListener('onItemRemoved', handleItemRemoved);
      
      loading.value = false;
    });
    
    // Props überwachen
    watch(() => props.theme, (newTheme) => {
      basicComponentService.setTheme(newTheme);
    });
    
    watch(() => props.language, (newLanguage) => {
      basicComponentService.setLanguage(newLanguage);
    });
    
    // Items laden
    const loadItems = () => {
      try {
        items.value = basicComponentService.getItems();
      } catch (err) {
        console.error('Fehler beim Laden der Items:', err);
        error.value = err.message;
      }
    };
    
    // Event-Handler
    const handleItemAdded = (item) => {
      loadItems();
      emit('item-added', item);
    };
    
    const handleItemUpdated = (item) => {
      loadItems();
      emit('item-updated', item);
    };
    
    const handleItemRemoved = ({ id }) => {
      loadItems();
      emit('item-removed', { id });
    };
    
    // Item hinzufügen
    const addItem = () => {
      try {
        const item = basicComponentService.addItem(newItem.value);
        
        // Formular zurücksetzen
        newItem.value = {
          name: '',
          description: '',
          status: 'active',
          tags: []
        };
        
        isFormVisible.value = false;
        
        return item;
      } catch (err) {
        console.error('Fehler beim Hinzufügen des Items:', err);
        error.value = err.message;
        return null;
      }
    };
    
    // Item aktualisieren
    const updateItem = () => {
      if (!selectedItem.value) return null;
      
      try {
        const item = basicComponentService.updateItem(selectedItem.value.id, newItem.value);
        
        // Formular zurücksetzen
        newItem.value = {
          name: '',
          description: '',
          status: 'active',
          tags: []
        };
        
        selectedItem.value = null;
        isFormVisible.value = false;
        
        return item;
      } catch (err) {
        console.error('Fehler beim Aktualisieren des Items:', err);
        error.value = err.message;
        return null;
      }
    };
    
    // Item entfernen
    const removeItem = (id) => {
      if (confirm(basicComponentService.translate('confirmDelete'))) {
        try {
          return basicComponentService.removeItem(id);
        } catch (err) {
          console.error('Fehler beim Entfernen des Items:', err);
          error.value = err.message;
          return false;
        }
      }
      return false;
    };
    
    // Item zum Bearbeiten auswählen
    const selectItemForEdit = (item) => {
      selectedItem.value = item;
      newItem.value = { ...item };
      formMode.value = 'edit';
      isFormVisible.value = true;
    };
    
    // Formular anzeigen
    const showAddForm = () => {
      selectedItem.value = null;
      newItem.value = {
        name: '',
        description: '',
        status: 'active',
        tags: []
      };
      formMode.value = 'add';
      isFormVisible.value = true;
    };
    
    // Formular abbrechen
    const cancelForm = () => {
      isFormVisible.value = false;
      selectedItem.value = null;
      newItem.value = {
        name: '',
        description: '',
        status: 'active',
        tags: []
      };
    };
    
    // Formular absenden
    const submitForm = () => {
      if (formMode.value === 'add') {
        addItem();
      } else {
        updateItem();
      }
    };
    
    // Sortierung ändern
    const changeSort = (field) => {
      if (sortField.value === field) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortField.value = field;
        sortOrder.value = 'asc';
      }
    };
    
    // Gefilterte und sortierte Items
    const filteredAndSortedItems = computed(() => {
      // Filtern
      let result = items.value;
      
      if (selectedStatus.value !== 'all') {
        result = result.filter(item => item.status === selectedStatus.value);
      }
      
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(item => {
          const name = (item.name || '').toLowerCase();
          const description = (item.description || '').toLowerCase();
          return name.includes(query) || description.includes(query);
        });
      }
      
      // Sortieren
      result = basicComponentService.sortItems(result, sortField.value, sortOrder.value);
      
      return result;
    });
    
    // Paginierte Items
    const paginatedItems = computed(() => {
      return basicComponentService.paginateItems(
        filteredAndSortedItems.value,
        currentPage.value,
        itemsPerPage.value
      );
    });
    
    // Gesamtanzahl der Seiten
    const totalPages = computed(() => {
      return Math.ceil(filteredAndSortedItems.value.length / itemsPerPage.value);
    });
    
    // Übersetzungsfunktion
    const t = (key) => {
      return basicComponentService.translate(key);
    };
    
    // CSS-Klassen basierend auf dem Theme
    const themeClasses = computed(() => {
      return {
        container: props.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800',
        header: props.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800',
        button: {
          primary: props.theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white',
          secondary: props.theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800',
          danger: props.theme === 'dark' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
        },
        item: props.theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50 border',
        input: props.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
      };
    });
    
    return {
      items,
      loading,
      error,
      searchQuery,
      selectedStatus,
      currentPage,
      itemsPerPage,
      sortField,
      sortOrder,
      selectedItem,
      isFormVisible,
      formMode,
      newItem,
      filteredAndSortedItems,
      paginatedItems,
      totalPages,
      themeClasses,
      addItem,
      updateItem,
      removeItem,
      selectItemForEdit,
      showAddForm,
      cancelForm,
      submitForm,
      changeSort,
      t
    };
  },
  
  // WeWeb-spezifische Konfiguration
  weweb: {
    type: 'component',
    uiSchema: {
      ui:title: {
        type: 'text',
        label: 'Titel'
      },
      ui:description: {
        type: 'textarea',
        label: 'Beschreibung'
      },
      ui:theme: {
        type: 'select',
        label: 'Farbschema',
        options: [
          { label: 'Hell', value: 'light' },
          { label: 'Dunkel', value: 'dark' }
        ]
      },
      ui:language: {
        type: 'select',
        label: 'Sprache',
        options: [
          { label: 'Deutsch', value: 'de' },
          { label: 'Englisch', value: 'en' }
        ]
      }
    }
  },
  
  // WeWeb-Element-Konfiguration
  wwElement: {
    type: 'basic-component',
    uiSchema: {
      ui:title: {
        type: 'text',
        label: 'Titel'
      },
      ui:description: {
        type: 'textarea',
        label: 'Beschreibung'
      },
      ui:theme: {
        type: 'select',
        label: 'Farbschema',
        options: [
          { label: 'Hell', value: 'light' },
          { label: 'Dunkel', value: 'dark' }
        ]
      },
      ui:language: {
        type: 'select',
        label: 'Sprache',
        options: [
          { label: 'Deutsch', value: 'de' },
          { label: 'Englisch', value: 'en' }
        ]
      }
    }
  },
  
  // WeWeb-Konfiguration
  wwConfig: {
    general: {
      label: 'Basis-Komponente',
      icon: 'box'
    },
    properties: {
      title: {
        label: 'Titel',
        type: 'string',
        defaultValue: 'Basis-Komponente'
      },
      description: {
        label: 'Beschreibung',
        type: 'string',
        defaultValue: 'Eine einfache Basis-Komponente für WeWeb'
      },
      theme: {
        label: 'Farbschema',
        type: 'select',
        options: [
          { label: 'Hell', value: 'light' },
          { label: 'Dunkel', value: 'dark' }
        ],
        defaultValue: 'light'
      },
      language: {
        label: 'Sprache',
        type: 'select',
        options: [
          { label: 'Deutsch', value: 'de' },
          { label: 'Englisch', value: 'en' }
        ],
        defaultValue: 'de'
      }
    }
  }
};
