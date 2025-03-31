// Vendor Management UI Component für LemonVows
// Diese Komponente stellt die Benutzeroberfläche für das Lieferantenmanagement dar

import { ref, computed, onMounted, watch } from 'vue';
import vendorManagementService from './vendor-management-service.js';

export default {
  name: 'VendorManagementUI',
  
  props: {
    maxVendors: {
      type: Number,
      default: 10
    },
    showRatings: {
      type: Boolean,
      default: true
    },
    showContractManagement: {
      type: Boolean,
      default: true
    },
    showPaymentTracking: {
      type: Boolean,
      default: true
    }
  },
  
  setup(props, { emit }) {
    // Reaktive Daten
    const vendors = ref([]);
    const categories = ref([]);
    const loading = ref(true);
    const selectedCategory = ref('all');
    const searchQuery = ref('');
    const showContractSigned = ref(true);
    const showContractUnsigned = ref(true);
    const statistics = ref({});
    const newVendor = ref({
      name: '',
      category: '',
      contactPerson: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      notes: '',
      price: 0
    });
    
    // Beim Mounten der Komponente
    onMounted(() => {
      // Lieferantenlimit setzen
      vendorManagementService.setVendorLimit(props.maxVendors);
      
      // Lieferantenmanagement initialisieren
      vendorManagementService.initialize();
      
      // Lieferanten und Kategorien laden
      loadVendors();
      loadCategories();
      
      // Statistiken berechnen
      updateStatistics();
      
      loading.value = false;
    });
    
    // Lieferantenlimit aktualisieren, wenn sich die maxVendors-Prop ändert
    watch(() => props.maxVendors, (newLimit) => {
      vendorManagementService.setVendorLimit(newLimit);
    });
    
    // Lieferanten laden
    const loadVendors = () => {
      vendors.value = vendorManagementService.getAllVendors();
    };
    
    // Kategorien laden
    const loadCategories = () => {
      categories.value = vendorManagementService.getAllCategories();
    };
    
    // Statistiken aktualisieren
    const updateStatistics = () => {
      statistics.value = vendorManagementService.getVendorStatistics();
    };
    
    // Lieferant hinzufügen
    const addVendor = () => {
      try {
        const vendor = vendorManagementService.addVendor(newVendor.value);
        
        // Formular zurücksetzen
        newVendor.value = {
          name: '',
          category: newVendor.value.category, // Kategorie beibehalten
          contactPerson: '',
          email: '',
          phone: '',
          website: '',
          address: '',
          notes: '',
          price: 0
        };
        
        // Lieferanten neu laden
        loadVendors();
        
        // Statistiken aktualisieren
        updateStatistics();
        
        emit('vendor-added', vendor);
        
        return vendor;
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Lieferanten:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Lieferant aktualisieren
    const updateVendor = (id, updatedVendor) => {
      try {
        const vendor = vendorManagementService.updateVendor(id, updatedVendor);
        
        // Lieferanten neu laden
        loadVendors();
        
        // Statistiken aktualisieren
        updateStatistics();
        
        emit('vendor-updated', vendor);
        
        return vendor;
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Lieferanten:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Lieferant entfernen
    const removeVendor = (id) => {
      try {
        const removed = vendorManagementService.removeVendor(id);
        
        if (removed) {
          // Lieferanten neu laden
          loadVendors();
          
          // Statistiken aktualisieren
          updateStatistics();
          
          emit('vendor-removed', { id });
        }
        
        return removed;
      } catch (error) {
        console.error('Fehler beim Entfernen des Lieferanten:', error);
        emit('error', error.message);
        return false;
      }
    };
    
    // Lieferant bewerten
    const rateVendor = (id, rating) => {
      if (!props.showRatings) return null;
      
      try {
        const vendor = vendorManagementService.rateVendor(id, rating);
        
        // Lieferanten neu laden
        loadVendors();
        
        emit('vendor-rated', vendor);
        
        return vendor;
      } catch (error) {
        console.error('Fehler beim Bewerten des Lieferanten:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Vertrag als unterzeichnet markieren
    const markContractSigned = (id, contractDate = new Date(), contractFile = null) => {
      if (!props.showContractManagement) return null;
      
      try {
        const vendor = vendorManagementService.markContractSigned(id, contractDate, contractFile);
        
        // Lieferanten neu laden
        loadVendors();
        
        // Statistiken aktualisieren
        updateStatistics();
        
        emit('contract-signed', vendor);
        
        return vendor;
      } catch (error) {
        console.error('Fehler beim Markieren des Vertrags als unterzeichnet:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Anzahlung als bezahlt markieren
    const markDepositPaid = (id, amount, depositDate = new Date()) => {
      if (!props.showPaymentTracking) return null;
      
      try {
        const vendor = vendorManagementService.markDepositPaid(id, amount, depositDate);
        
        // Lieferanten neu laden
        loadVendors();
        
        // Statistiken aktualisieren
        updateStatistics();
        
        emit('deposit-paid', vendor);
        
        return vendor;
      } catch (error) {
        console.error('Fehler beim Markieren der Anzahlung als bezahlt:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Restzahlung als bezahlt markieren
    const markFinalPaymentPaid = (id, paymentDate = new Date()) => {
      if (!props.showPaymentTracking) return null;
      
      try {
        const vendor = vendorManagementService.markFinalPaymentPaid(id, paymentDate);
        
        // Lieferanten neu laden
        loadVendors();
        
        // Statistiken aktualisieren
        updateStatistics();
        
        emit('final-payment-paid', vendor);
        
        return vendor;
      } catch (error) {
        console.error('Fehler beim Markieren der Restzahlung als bezahlt:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Vertrag hochladen
    const uploadContract = (id, filePath) => {
      if (!props.showContractManagement) return null;
      
      try {
        const vendor = vendorManagementService.uploadContract(id, filePath);
        
        // Lieferanten neu laden
        loadVendors();
        
        emit('contract-uploaded', vendor);
        
        return vendor;
      } catch (error) {
        console.error('Fehler beim Hochladen des Vertrags:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Kategorie hinzufügen
    const addCategory = (category) => {
      try {
        const newCategory = vendorManagementService.addCategory(category);
        
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
        const category = vendorManagementService.updateCategory(id, updatedCategory);
        
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
      try {
        const removed = vendorManagementService.removeCategory(id);
        
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
    
    // Lieferantenliste exportieren
    const exportVendorList = (format = 'json') => {
      try {
        const exportedList = vendorManagementService.exportVendorList(format);
        
        emit('vendor-list-exported', { format, content: exportedList });
        
        return exportedList;
      } catch (error) {
        console.error('Fehler beim Exportieren der Lieferantenliste:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Gefilterte Lieferanten
    const filteredVendors = computed(() => {
      const filters = {};
      
      // Nach Kategorie filtern
      if (selectedCategory.value !== 'all') {
        filters.category = selectedCategory.value;
      }
      
      // Nach Vertragsstatus filtern
      if (!showContractSigned.value && !showContractUnsigned.value) {
        // Wenn beide deaktiviert sind, keine Lieferanten anzeigen
        return [];
      } else if (!showContractSigned.value) {
        // Nur nicht unterzeichnete Verträge anzeigen
        filters.contractSigned = false;
      } else if (!showContractUnsigned.value) {
        // Nur unterzeichnete Verträge anzeigen
        filters.contractSigned = true;
      }
      
      // Nach Suchbegriff filtern
      if (searchQuery.value) {
        filters.searchQuery = searchQuery.value;
      }
      
      return vendorManagementService.filterVendors(filters);
    });
    
    // Lieferanten nach Kategorie gruppieren
    const vendorsByCategory = computed(() => {
      const grouped = {};
      
      filteredVendors.value.forEach(vendor => {
        const category = categories.value.find(cat => cat.id === vendor.category);
        const categoryName = category ? category.name : 'Unbekannt';
        
        if (!grouped[categoryName]) {
          grouped[categoryName] = [];
        }
        
        grouped[categoryName].push(vendor);
      });
      
      return grouped;
    });
    
    // Lieferanten mit ausstehenden Zahlungen
    const vendorsWithPendingPayments = computed(() => {
      if (!props.showPaymentTracking) return [];
      
      return vendorManagementService.getVendorsWithPendingPayments();
    });
    
    // Lieferanten mit bevorstehenden Zahlungen
    const vendorsWithUpcomingPayments = computed(() => {
      if (!props.showPaymentTracking) return [];
      
      return vendorManagementService.getVendorsWithUpcomingPayments();
    });
    
    // Prüfen, ob das Lieferantenlimit erreicht ist
    const isVendorLimitReached = computed(() => {
      return vendorManagementService.isVendorLimitReached();
    });
    
    // Fortschritt der Vertragsunterzeichnungen
    const contractProgress = computed(() => {
      if (!statistics.value.contractSignedRate) return 0;
      
      return Math.round(statistics.value.contractSignedRate);
    });
    
    // Fortschritt der Anzahlungen
    const depositProgress = computed(() => {
      if (!statistics.value.depositPaidRate) return 0;
      
      return Math.round(statistics.value.depositPaidRate);
    });
    
    // Fortschritt der Restzahlungen
    const finalPaymentProgress = computed(() => {
      if (!statistics.value.finalPaymentPaidRate) return 0;
      
      return Math.round(statistics.value.finalPaymentPaidRate);
    });
    
    return {
      vendors,
      categories,
      loading,
      selectedCategory,
      searchQuery,
      showContractSigned,
      showContractUnsigned,
      statistics,
      newVendor,
      filteredVendors,
      vendorsByCategory,
      vendorsWithPendingPayments,
      vendorsWithUpcomingPayments,
      isVendorLimitReached,
      contractProgress,
      depositProgress,
      finalPaymentProgress,
      addVendor,
      updateVendor,
      removeVendor,
      rateVendor,
      markContractSigned,
      markDepositPaid,
      markFinalPaymentPaid,
      uploadContract,
      addCategory,
      updateCategory,
      removeCategory,
      exportVendorList
    };
  },
  
  // WeWeb-spezifische Konfiguration
  weweb: {
    type: 'component',
    uiSchema: {
      ui:maxVendors: {
        type: 'number',
        label: 'Maximale Anzahl an Lieferanten',
        min: 1
      },
      ui:showRatings: {
        type: 'toggle',
        label: 'Bewertungen anzeigen'
      },
      ui:showContractManagement: {
        type: 'toggle',
        label: 'Vertragsmanagement anzeigen'
      },
      ui:showPaymentTracking: {
        type: 'toggle',
        label: 'Zahlungsverfolgung anzeigen'
      }
    }
  }
};
