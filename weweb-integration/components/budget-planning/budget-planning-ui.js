// Budget Planning UI Component für LemonVows
// Diese Komponente stellt die Benutzeroberfläche für die Budget-Planung dar

import { ref, computed, onMounted, watch } from 'vue';
import budgetPlanningService from './budget-planning-service.js';

export default {
  name: 'BudgetPlanningUI',
  
  props: {
    totalBudget: {
      type: Number,
      default: 10000
    },
    currency: {
      type: String,
      default: 'EUR'
    },
    showDetailedReports: {
      type: Boolean,
      default: false
    },
    showCategoryBreakdown: {
      type: Boolean,
      default: true
    }
  },
  
  setup(props, { emit }) {
    // Reaktive Daten
    const budgetItems = ref([]);
    const categories = ref([]);
    const statistics = ref({});
    const loading = ref(true);
    const selectedCategory = ref('all');
    const searchQuery = ref('');
    const showPaid = ref(true);
    const newBudgetItem = ref({
      description: '',
      category: '',
      estimatedCost: 0,
      actualCost: 0,
      paid: false,
      vendor: '',
      notes: ''
    });
    
    // Beim Mounten der Komponente
    onMounted(() => {
      // Budget initialisieren
      budgetPlanningService.initialize(props.totalBudget, props.currency);
      
      // Budgetposten und Kategorien laden
      loadBudgetItems();
      loadCategories();
      
      // Statistiken berechnen
      updateStatistics();
      
      loading.value = false;
    });
    
    // Budget aktualisieren, wenn sich die totalBudget-Prop ändert
    watch(() => props.totalBudget, (newBudget) => {
      budgetPlanningService.setTotalBudget(newBudget);
      updateStatistics();
    });
    
    // Währung aktualisieren, wenn sich die currency-Prop ändert
    watch(() => props.currency, (newCurrency) => {
      budgetPlanningService.setCurrency(newCurrency);
      updateStatistics();
    });
    
    // Budgetposten laden
    const loadBudgetItems = () => {
      budgetItems.value = budgetPlanningService.getAllBudgetItems();
    };
    
    // Kategorien laden
    const loadCategories = () => {
      categories.value = budgetPlanningService.getAllCategories();
    };
    
    // Statistiken aktualisieren
    const updateStatistics = () => {
      statistics.value = budgetPlanningService.getBudgetStatistics();
    };
    
    // Budgetposten hinzufügen
    const addBudgetItem = () => {
      try {
        const item = budgetPlanningService.addBudgetItem(newBudgetItem.value);
        
        // Formular zurücksetzen
        newBudgetItem.value = {
          description: '',
          category: newBudgetItem.value.category, // Kategorie beibehalten
          estimatedCost: 0,
          actualCost: 0,
          paid: false,
          vendor: '',
          notes: ''
        };
        
        // Budgetposten neu laden
        loadBudgetItems();
        
        // Statistiken aktualisieren
        updateStatistics();
        
        emit('budget-item-added', item);
        
        return item;
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Budgetpostens:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Budgetposten aktualisieren
    const updateBudgetItem = (id, updatedItem) => {
      try {
        const item = budgetPlanningService.updateBudgetItem(id, updatedItem);
        
        // Budgetposten neu laden
        loadBudgetItems();
        
        // Statistiken aktualisieren
        updateStatistics();
        
        emit('budget-item-updated', item);
        
        return item;
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Budgetpostens:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Budgetposten entfernen
    const removeBudgetItem = (id) => {
      try {
        const removed = budgetPlanningService.removeBudgetItem(id);
        
        if (removed) {
          // Budgetposten neu laden
          loadBudgetItems();
          
          // Statistiken aktualisieren
          updateStatistics();
          
          emit('budget-item-removed', { id });
        }
        
        return removed;
      } catch (error) {
        console.error('Fehler beim Entfernen des Budgetpostens:', error);
        emit('error', error.message);
        return false;
      }
    };
    
    // Budgetposten als bezahlt markieren
    const markItemPaid = (id, paid = true, paymentDate = new Date()) => {
      try {
        const item = budgetPlanningService.markItemPaid(id, paid, paymentDate);
        
        // Budgetposten neu laden
        loadBudgetItems();
        
        // Statistiken aktualisieren
        updateStatistics();
        
        emit('budget-item-paid', item);
        
        return item;
      } catch (error) {
        console.error('Fehler beim Markieren des Budgetpostens als bezahlt:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Kategorie hinzufügen
    const addCategory = (category) => {
      try {
        const newCategory = budgetPlanningService.addCategory(category);
        
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
      try {
        const category = budgetPlanningService.updateCategory(id, updatedCategory);
        
        // Kategorien neu laden
        loadCategories();
        
        // Statistiken aktualisieren
        updateStatistics();
        
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
      try {
        const removed = budgetPlanningService.removeCategory(id);
        
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
    
    // Bericht generieren
    const generateReport = (format = 'json') => {
      try {
        const report = budgetPlanningService.generateReport(format);
        
        emit('report-generated', { format, content: report });
        
        return report;
      } catch (error) {
        console.error('Fehler beim Generieren des Berichts:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Gefilterte Budgetposten
    const filteredBudgetItems = computed(() => {
      const filters = {};
      
      // Nach Kategorie filtern
      if (selectedCategory.value !== 'all') {
        filters.category = selectedCategory.value;
      }
      
      // Nach Bezahlstatus filtern
      if (!showPaid.value) {
        filters.paid = false;
      }
      
      // Nach Suchbegriff filtern
      if (searchQuery.value) {
        filters.searchQuery = searchQuery.value;
      }
      
      return budgetPlanningService.filterBudgetItems(filters);
    });
    
    // Budgetposten nach Kategorie gruppieren
    const budgetItemsByCategory = computed(() => {
      const grouped = {};
      
      filteredBudgetItems.value.forEach(item => {
        const category = categories.value.find(cat => cat.id === item.category);
        const categoryName = category ? category.name : 'Unbekannt';
        
        if (!grouped[categoryName]) {
          grouped[categoryName] = [];
        }
        
        grouped[categoryName].push(item);
      });
      
      return grouped;
    });
    
    // Kategorie-Daten für Diagramme
    const categoryChartData = computed(() => {
      if (!statistics.value.categoryStats) return [];
      
      return categories.value.map(category => {
        const stats = statistics.value.categoryStats[category.id];
        
        return {
          name: category.name,
          color: category.color,
          allocation: stats ? stats.allocation : 0,
          actual: stats ? stats.actualTotal : 0,
          remaining: stats ? stats.allocation - stats.actualTotal : 0
        };
      });
    });
    
    // Budget-Fortschritt
    const budgetProgress = computed(() => {
      if (!statistics.value.budgetProgress) return 0;
      
      return Math.min(100, statistics.value.budgetProgress);
    });
    
    // Verbleibendes Budget
    const remainingBudget = computed(() => {
      if (!statistics.value.remainingBudget) return props.totalBudget;
      
      return statistics.value.remainingBudget;
    });
    
    // Budget überschritten
    const isBudgetExceeded = computed(() => {
      return remainingBudget.value < 0;
    });
    
    return {
      budgetItems,
      categories,
      statistics,
      loading,
      selectedCategory,
      searchQuery,
      showPaid,
      newBudgetItem,
      filteredBudgetItems,
      budgetItemsByCategory,
      categoryChartData,
      budgetProgress,
      remainingBudget,
      isBudgetExceeded,
      addBudgetItem,
      updateBudgetItem,
      removeBudgetItem,
      markItemPaid,
      addCategory,
      updateCategory,
      removeCategory,
      generateReport,
      updateStatistics
    };
  },
  
  // WeWeb-spezifische Konfiguration
  weweb: {
    type: 'component',
    uiSchema: {
      ui:totalBudget: {
        type: 'number',
        label: 'Gesamtbudget',
        min: 0
      },
      ui:currency: {
        type: 'select',
        label: 'Währung',
        options: [
          { label: 'Euro (€)', value: 'EUR' },
          { label: 'US-Dollar ($)', value: 'USD' },
          { label: 'Britisches Pfund (£)', value: 'GBP' },
          { label: 'Schweizer Franken (CHF)', value: 'CHF' }
        ]
      },
      ui:showDetailedReports: {
        type: 'toggle',
        label: 'Detaillierte Berichte anzeigen'
      },
      ui:showCategoryBreakdown: {
        type: 'toggle',
        label: 'Aufschlüsselung nach Kategorien anzeigen'
      }
    }
  }
};
