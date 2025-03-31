// Guest Management UI Component für LemonVows
// Diese Komponente stellt die Benutzeroberfläche für das Gästemanagement dar

import { ref, computed, onMounted, watch } from 'vue';
import guestManagementService from './guest-management-service.js';

export default {
  name: 'GuestManagementUI',
  
  props: {
    maxGuests: {
      type: Number,
      default: 20
    },
    showRSVP: {
      type: Boolean,
      default: true
    },
    showDietaryRestrictions: {
      type: Boolean,
      default: true
    },
    showAccommodation: {
      type: Boolean,
      default: false
    }
  },
  
  setup(props, { emit }) {
    // Reaktive Daten
    const guests = ref([]);
    const groups = ref([]);
    const loading = ref(true);
    const selectedGroup = ref('all');
    const selectedRSVPStatus = ref('all');
    const searchQuery = ref('');
    const statistics = ref({});
    const newGuest = ref({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      rsvpStatus: 'pending',
      dietaryRestrictions: '',
      accommodation: false,
      plusOne: false,
      plusOneName: '',
      notes: '',
      isChild: false,
      age: null
    });
    
    // Beim Mounten der Komponente
    onMounted(() => {
      // Gästelimit setzen
      guestManagementService.setGuestLimit(props.maxGuests);
      
      // Gäste und Gruppen laden
      loadGuests();
      loadGroups();
      
      // Statistiken berechnen
      updateStatistics();
      
      loading.value = false;
    });
    
    // Gästelimit aktualisieren, wenn sich die maxGuests-Prop ändert
    watch(() => props.maxGuests, (newLimit) => {
      guestManagementService.setGuestLimit(newLimit);
    });
    
    // Gäste laden
    const loadGuests = () => {
      guests.value = guestManagementService.getAllGuests();
    };
    
    // Gruppen laden
    const loadGroups = () => {
      groups.value = guestManagementService.getAllGroups();
    };
    
    // Statistiken aktualisieren
    const updateStatistics = () => {
      statistics.value = guestManagementService.getGuestStatistics();
    };
    
    // Gast hinzufügen
    const addGuest = () => {
      try {
        const guest = guestManagementService.addGuest(newGuest.value);
        
        // Formular zurücksetzen
        newGuest.value = {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          rsvpStatus: 'pending',
          dietaryRestrictions: '',
          accommodation: false,
          plusOne: false,
          plusOneName: '',
          notes: '',
          isChild: false,
          age: null
        };
        
        // Gäste neu laden
        loadGuests();
        
        // Statistiken aktualisieren
        updateStatistics();
        
        emit('guest-added', guest);
        
        return guest;
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Gastes:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Gast aktualisieren
    const updateGuest = (id, updatedGuest) => {
      try {
        const guest = guestManagementService.updateGuest(id, updatedGuest);
        
        // Gäste neu laden
        loadGuests();
        
        // Statistiken aktualisieren
        updateStatistics();
        
        emit('guest-updated', guest);
        
        return guest;
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Gastes:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Gast entfernen
    const removeGuest = (id) => {
      try {
        const removed = guestManagementService.removeGuest(id);
        
        if (removed) {
          // Gäste neu laden
          loadGuests();
          
          // Statistiken aktualisieren
          updateStatistics();
          
          emit('guest-removed', { id });
        }
        
        return removed;
      } catch (error) {
        console.error('Fehler beim Entfernen des Gastes:', error);
        emit('error', error.message);
        return false;
      }
    };
    
    // RSVP aktualisieren
    const updateRSVP = (id, status) => {
      try {
        const guest = guestManagementService.updateRSVP(id, status);
        
        // Gäste neu laden
        loadGuests();
        
        // Statistiken aktualisieren
        updateStatistics();
        
        emit('rsvp-updated', guest);
        
        return guest;
      } catch (error) {
        console.error('Fehler beim Aktualisieren des RSVP-Status:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Einladung als gesendet markieren
    const markInvitationSent = (id, sentDate = new Date()) => {
      try {
        const guest = guestManagementService.markInvitationSent(id, sentDate);
        
        // Gäste neu laden
        loadGuests();
        
        emit('invitation-sent', guest);
        
        return guest;
      } catch (error) {
        console.error('Fehler beim Markieren der Einladung als gesendet:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Dankeschön als gesendet markieren
    const markThankYouSent = (id, sentDate = new Date()) => {
      try {
        const guest = guestManagementService.markThankYouSent(id, sentDate);
        
        // Gäste neu laden
        loadGuests();
        
        emit('thank-you-sent', guest);
        
        return guest;
      } catch (error) {
        console.error('Fehler beim Markieren des Dankeschöns als gesendet:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Tisch zuweisen
    const assignTable = (id, tableNumber) => {
      try {
        const guest = guestManagementService.assignTable(id, tableNumber);
        
        // Gäste neu laden
        loadGuests();
        
        emit('table-assigned', guest);
        
        return guest;
      } catch (error) {
        console.error('Fehler beim Zuweisen des Tisches:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Gruppe hinzufügen
    const addGroup = (group) => {
      try {
        const newGroup = guestManagementService.addGroup(group);
        
        // Gruppen neu laden
        loadGroups();
        
        emit('group-added', newGroup);
        
        return newGroup;
      } catch (error) {
        console.error('Fehler beim Hinzufügen der Gruppe:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Gruppe aktualisieren
    const updateGroup = (id, updatedGroup) => {
      try {
        const group = guestManagementService.updateGroup(id, updatedGroup);
        
        // Gruppen neu laden
        loadGroups();
        
        emit('group-updated', group);
        
        return group;
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Gruppe:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Gruppe entfernen
    const removeGroup = (id) => {
      try {
        const removed = guestManagementService.removeGroup(id);
        
        if (removed) {
          // Gruppen neu laden
          loadGroups();
          
          emit('group-removed', { id });
        }
        
        return removed;
      } catch (error) {
        console.error('Fehler beim Entfernen der Gruppe:', error);
        emit('error', error.message);
        return false;
      }
    };
    
    // Gast einer Gruppe zuweisen
    const assignGuestToGroup = (guestId, groupId) => {
      try {
        const guest = guestManagementService.assignGuestToGroup(guestId, groupId);
        
        // Gäste neu laden
        loadGuests();
        
        emit('guest-assigned-to-group', guest);
        
        return guest;
      } catch (error) {
        console.error('Fehler beim Zuweisen des Gastes zur Gruppe:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Gästeliste exportieren
    const exportGuestList = (format = 'json') => {
      try {
        const exportedList = guestManagementService.exportGuestList(format);
        
        emit('guest-list-exported', { format, content: exportedList });
        
        return exportedList;
      } catch (error) {
        console.error('Fehler beim Exportieren der Gästeliste:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Gefilterte Gäste
    const filteredGuests = computed(() => {
      const filters = {};
      
      // Nach Gruppe filtern
      if (selectedGroup.value !== 'all') {
        filters.group = selectedGroup.value;
      }
      
      // Nach RSVP-Status filtern
      if (selectedRSVPStatus.value !== 'all') {
        filters.rsvpStatus = selectedRSVPStatus.value;
      }
      
      // Nach Suchbegriff filtern
      if (searchQuery.value) {
        filters.searchQuery = searchQuery.value;
      }
      
      return guestManagementService.filterGuests(filters);
    });
    
    // Gäste nach RSVP-Status
    const guestsByRSVPStatus = computed(() => {
      return {
        confirmed: guests.value.filter(guest => guest.rsvpStatus === 'confirmed'),
        declined: guests.value.filter(guest => guest.rsvpStatus === 'declined'),
        pending: guests.value.filter(guest => guest.rsvpStatus === 'pending')
      };
    });
    
    // Prüfen, ob das Gästelimit erreicht ist
    const isGuestLimitReached = computed(() => {
      return guestManagementService.isGuestLimitReached();
    });
    
    return {
      guests,
      groups,
      loading,
      selectedGroup,
      selectedRSVPStatus,
      searchQuery,
      statistics,
      newGuest,
      filteredGuests,
      guestsByRSVPStatus,
      isGuestLimitReached,
      addGuest,
      updateGuest,
      removeGuest,
      updateRSVP,
      markInvitationSent,
      markThankYouSent,
      assignTable,
      addGroup,
      updateGroup,
      removeGroup,
      assignGuestToGroup,
      exportGuestList
    };
  },
  
  // WeWeb-spezifische Konfiguration
  weweb: {
    type: 'component',
    uiSchema: {
      ui:maxGuests: {
        type: 'number',
        label: 'Maximale Anzahl an Gästen',
        min: 1
      },
      ui:showRSVP: {
        type: 'toggle',
        label: 'RSVP-Tracking anzeigen'
      },
      ui:showDietaryRestrictions: {
        type: 'toggle',
        label: 'Diätbeschränkungen anzeigen'
      },
      ui:showAccommodation: {
        type: 'toggle',
        label: 'Unterkunftsinformationen anzeigen'
      }
    }
  }
};
