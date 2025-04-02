// Contract Management UI Component für LemonVows
// Diese Komponente stellt die Benutzeroberfläche für die Vertragsverwaltung dar

import { ref, computed, onMounted, watch } from 'vue';
import contractManagementService from './contract-management-service.js';

export default {
  name: 'ContractManagementUI',
  
  props: {
    contracts: {
      type: Array,
      default: () => []
    },
    showExpiringAlert: {
      type: Boolean,
      default: true
    },
    daysThreshold: {
      type: Number,
      default: 30
    },
    showAddButton: {
      type: Boolean,
      default: true
    }
  },
  
  setup(props, { emit }) {
    // Reaktive Daten
    const activeTab = ref('contracts');
    const selectedContract = ref(null);
    const formMode = ref('add');
    const loading = ref(true);
    const expiringContracts = ref([]);
    
    // Formularmodell für neuen/bearbeiteten Vertrag
    const contractForm = ref({
      name: '',
      vendor_id: '',
      file_url: '',
      file_type: '',
      file_size: null,
      signed_date: '',
      expiration_date: '',
      status: 'draft',
      key_terms: {},
      notes: ''
    });
    
    // Beim Mounten der Komponente
    onMounted(() => {
      // Verträge in den Service laden
      if (props.contracts.length > 0) {
        contractManagementService.contracts = props.contracts;
      }
      
      // Ablaufende Verträge berechnen
      updateExpiringContracts();
      
      loading.value = false;
    });
    
    // Wenn sich die Props ändern, den Service aktualisieren
    watch(() => props.contracts, (newContracts) => {
      contractManagementService.contracts = newContracts;
      updateExpiringContracts();
    }, { deep: true });
    
    watch(() => props.daysThreshold, (newThreshold) => {
      updateExpiringContracts();
    });
    
    // Ablaufende Verträge aktualisieren
    const updateExpiringContracts = () => {
      expiringContracts.value = contractManagementService.getExpiringContracts(props.daysThreshold);
    };
    
    // Tab wechseln
    const setActiveTab = (tab) => {
      activeTab.value = tab;
    };
    
    // Vertrag hinzufügen
    const addContract = async (contract) => {
      try {
        const newContract = await contractManagementService.addContract(contract);
        emit('contract-added', newContract);
        return newContract;
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Vertrags:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Vertrag aktualisieren
    const updateContract = async (id, updates) => {
      try {
        const updatedContract = await contractManagementService.updateContract(id, updates);
        emit('contract-updated', updatedContract);
        return updatedContract;
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Vertrags:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Vertrag löschen
    const removeContract = async (id) => {
      try {
        const removed = await contractManagementService.removeContract(id);
        if (removed) {
          emit('contract-removed', { id });
        }
        return removed;
      } catch (error) {
        console.error('Fehler beim Löschen des Vertrags:', error);
        emit('error', error.message);
        return false;
      }
    };
    
    // Vertrag anzeigen
    const viewContract = (url) => {
      const success = contractManagementService.viewContract(url);
      if (success) {
        emit('contract-viewed', { url });
      }
      return success;
    };
    
    // Vertrag zum Bearbeiten auswählen
    const editContract = (contract) => {
      selectedContract.value = contract;
      contractForm.value = { ...contract };
      formMode.value = 'edit';
      setActiveTab('form');
    };
    
    // Neuen Vertrag erstellen
    const createNewContract = () => {
      selectedContract.value = null;
      contractForm.value = {
        name: '',
        vendor_id: '',
        file_url: '',
        file_type: '',
        file_size: null,
        signed_date: '',
        expiration_date: '',
        status: 'draft',
        key_terms: {},
        notes: ''
      };
      formMode.value = 'add';
      setActiveTab('form');
    };
    
    // Formular abbrechen
    const cancelForm = () => {
      setActiveTab('contracts');
    };
    
    // Formular absenden
    const submitForm = async () => {
      try {
        if (formMode.value === 'add') {
          await addContract(contractForm.value);
        } else {
          await updateContract(selectedContract.value.id, contractForm.value);
        }
        
        setActiveTab('contracts');
        return true;
      } catch (error) {
        console.error('Fehler beim Speichern des Vertrags:', error);
        emit('error', error.message);
        return false;
      }
    };
    
    // Vertragsdatei hochladen
    const uploadContractFile = async (file, userId) => {
      try {
        const path = `contracts/${userId}`;
        const fileData = await contractManagementService.uploadContractFile(file, path);
        
        // Formular aktualisieren
        contractForm.value.file_url = fileData.url;
        contractForm.value.file_type = fileData.type;
        contractForm.value.file_size = fileData.size;
        
        return fileData;
      } catch (error) {
        console.error('Fehler beim Hochladen der Vertragsdatei:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Hilfsfunktionen
    const formatDate = (dateString) => {
      return contractManagementService.formatDate(dateString);
    };
    
    const formatFileSize = (bytes) => {
      return contractManagementService.formatFileSize(bytes);
    };
    
    const getStatusBadge = (status) => {
      return contractManagementService.getStatusBadge(status);
    };
    
    const getDaysUntilExpiration = (expirationDate) => {
      return contractManagementService.getDaysUntilExpiration(expirationDate);
    };
    
    return {
      activeTab,
      selectedContract,
      formMode,
      loading,
      contractForm,
      expiringContracts,
      setActiveTab,
      addContract,
      updateContract,
      removeContract,
      viewContract,
      editContract,
      createNewContract,
      cancelForm,
      submitForm,
      uploadContractFile,
      formatDate,
      formatFileSize,
      getStatusBadge,
      getDaysUntilExpiration
    };
  },
  
  // WeWeb-spezifische Konfiguration
  wwElement: {
    type: 'contract-management',
    uiSchema: {
      ui:contracts: {
        type: 'array',
        label: 'Verträge'
      },
      ui:showExpiringAlert: {
        type: 'toggle',
        label: 'Warnung für ablaufende Verträge anzeigen'
      },
      ui:daysThreshold: {
        type: 'number',
        label: 'Schwellenwert in Tagen für ablaufende Verträge',
        min: 1
      },
      ui:showAddButton: {
        type: 'toggle',
        label: 'Hinzufügen-Schaltfläche anzeigen'
      }
    }
  },
  
  wwConfig: {
    general: {
      label: 'Vertragsverwaltung',
      icon: 'file-text'
    },
    properties: {
      contracts: {
        label: 'Verträge',
        type: 'array',
        bindable: true
      },
      showExpiringAlert: {
        label: 'Warnung für ablaufende Verträge anzeigen',
        type: 'boolean',
        defaultValue: true
      },
      daysThreshold: {
        label: 'Schwellenwert in Tagen für ablaufende Verträge',
        type: 'number',
        defaultValue: 30,
        min: 1
      },
      showAddButton: {
        label: 'Hinzufügen-Schaltfläche anzeigen',
        type: 'boolean',
        defaultValue: true
      }
    },
    events: {
      'contract-added': {
        label: 'Vertrag hinzugefügt',
        returnVariable: 'contract'
      },
      'contract-updated': {
        label: 'Vertrag aktualisiert',
        returnVariable: 'contract'
      },
      'contract-removed': {
        label: 'Vertrag entfernt',
        returnVariable: 'id'
      },
      'contract-viewed': {
        label: 'Vertrag angezeigt',
        returnVariable: 'url'
      },
      'error': {
        label: 'Fehler',
        returnVariable: 'errorMessage'
      }
    }
  }
};
