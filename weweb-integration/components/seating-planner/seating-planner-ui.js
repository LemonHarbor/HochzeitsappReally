// Seating Planner UI Component für LemonVows
// Diese Komponente stellt die Benutzeroberfläche für die Sitzplatzplanung dar

import { ref, computed, onMounted, watch } from 'vue';
import seatingPlannerService from './seating-planner-service.js';

export default {
  name: 'SeatingPlannerUI',
  
  props: {
    maxTables: {
      type: Number,
      default: 5
    },
    enableDragAndDrop: {
      type: Boolean,
      default: true
    },
    enableMenuSelection: {
      type: Boolean,
      default: true
    },
    enableMultipleRooms: {
      type: Boolean,
      default: false
    }
  },
  
  setup(props, { emit }) {
    // Reaktive Daten
    const tables = ref([]);
    const seats = ref([]);
    const menuOptions = ref([]);
    const rooms = ref([]);
    const obstacles = ref([]);
    const currentRoomId = ref(null);
    const loading = ref(true);
    const selectedTable = ref(null);
    const selectedSeat = ref(null);
    const statistics = ref({});
    const dragMode = ref(false);
    const scale = ref(1);
    const newTable = ref({
      name: '',
      shape: 'round',
      capacity: 8
    });
    
    // Beim Mounten der Komponente
    onMounted(() => {
      // Tischlimit setzen
      seatingPlannerService.setTableLimit(props.maxTables);
      
      // Sitzplatzplanung initialisieren
      const initData = seatingPlannerService.initialize();
      currentRoomId.value = initData.currentRoomId;
      
      // Daten laden
      loadTables();
      loadSeats();
      loadMenuOptions();
      loadRooms();
      loadObstacles();
      
      // Statistiken berechnen
      updateStatistics();
      
      loading.value = false;
    });
    
    // Tischlimit aktualisieren, wenn sich die maxTables-Prop ändert
    watch(() => props.maxTables, (newLimit) => {
      seatingPlannerService.setTableLimit(newLimit);
    });
    
    // Tische laden
    const loadTables = () => {
      tables.value = seatingPlannerService.getAllTables();
    };
    
    // Sitze laden
    const loadSeats = () => {
      seats.value = seatingPlannerService.getAllSeats();
    };
    
    // Menüoptionen laden
    const loadMenuOptions = () => {
      menuOptions.value = seatingPlannerService.getAllMenuOptions();
    };
    
    // Räume laden
    const loadRooms = () => {
      rooms.value = seatingPlannerService.getAllRooms();
    };
    
    // Hindernisse laden
    const loadObstacles = () => {
      obstacles.value = seatingPlannerService.getAllObstacles();
    };
    
    // Statistiken aktualisieren
    const updateStatistics = () => {
      statistics.value = seatingPlannerService.getSeatingPlanStatistics();
    };
    
    // Tisch hinzufügen
    const addTable = () => {
      try {
        const table = seatingPlannerService.addTable(newTable.value);
        
        // Formular zurücksetzen
        newTable.value = {
          name: '',
          shape: newTable.value.shape,
          capacity: newTable.value.capacity
        };
        
        // Tische und Sitze neu laden
        loadTables();
        loadSeats();
        
        // Statistiken aktualisieren
        updateStatistics();
        
        emit('table-added', table);
        
        return table;
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Tisches:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Tisch aktualisieren
    const updateTable = (id, updatedTable) => {
      try {
        const table = seatingPlannerService.updateTable(id, updatedTable);
        
        // Tische und Sitze neu laden
        loadTables();
        loadSeats();
        
        // Statistiken aktualisieren
        updateStatistics();
        
        emit('table-updated', table);
        
        return table;
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Tisches:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Tisch entfernen
    const removeTable = (id) => {
      try {
        const removed = seatingPlannerService.removeTable(id);
        
        if (removed) {
          // Tische und Sitze neu laden
          loadTables();
          loadSeats();
          
          // Statistiken aktualisieren
          updateStatistics();
          
          // Wenn der ausgewählte Tisch entfernt wurde, Auswahl zurücksetzen
          if (selectedTable.value && selectedTable.value.id === id) {
            selectedTable.value = null;
          }
          
          emit('table-removed', { id });
        }
        
        return removed;
      } catch (error) {
        console.error('Fehler beim Entfernen des Tisches:', error);
        emit('error', error.message);
        return false;
      }
    };
    
    // Tisch verschieben
    const moveTable = (id, positionX, positionY) => {
      if (!props.enableDragAndDrop) return null;
      
      try {
        const table = seatingPlannerService.updateTable(id, { positionX, positionY });
        
        // Tische neu laden
        loadTables();
        
        emit('table-moved', table);
        
        return table;
      } catch (error) {
        console.error('Fehler beim Verschieben des Tisches:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Tisch drehen
    const rotateTable = (id, rotation) => {
      try {
        const table = seatingPlannerService.updateTable(id, { rotation });
        
        // Tische neu laden
        loadTables();
        
        emit('table-rotated', table);
        
        return table;
      } catch (error) {
        console.error('Fehler beim Drehen des Tisches:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Gast einem Sitz zuweisen
    const assignGuestToSeat = (seatId, guestId) => {
      try {
        const seat = seatingPlannerService.assignGuestToSeat(seatId, guestId);
        
        // Sitze neu laden
        loadSeats();
        
        // Statistiken aktualisieren
        updateStatistics();
        
        emit('guest-assigned', seat);
        
        return seat;
      } catch (error) {
        console.error('Fehler beim Zuweisen des Gastes:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Gast von einem Sitz entfernen
    const removeGuestFromSeat = (seatId) => {
      try {
        const seat = seatingPlannerService.removeGuestFromSeat(seatId);
        
        // Sitze neu laden
        loadSeats();
        
        // Statistiken aktualisieren
        updateStatistics();
        
        emit('guest-removed', { seatId });
        
        return seat;
      } catch (error) {
        console.error('Fehler beim Entfernen des Gastes:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Menü einem Sitz zuweisen
    const assignMenuToSeat = (seatId, menuId) => {
      if (!props.enableMenuSelection) return null;
      
      try {
        const seat = seatingPlannerService.assignMenuToSeat(seatId, menuId);
        
        // Sitze neu laden
        loadSeats();
        
        // Statistiken aktualisieren
        updateStatistics();
        
        emit('menu-assigned', seat);
        
        return seat;
      } catch (error) {
        console.error('Fehler beim Zuweisen des Menüs:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Spezielle Anforderungen hinzufügen
    const addSpecialRequirements = (seatId, requirements) => {
      try {
        const seat = seatingPlannerService.addSpecialRequirements(seatId, requirements);
        
        // Sitze neu laden
        loadSeats();
        
        emit('special-requirements-added', seat);
        
        return seat;
      } catch (error) {
        console.error('Fehler beim Hinzufügen der speziellen Anforderungen:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Menüoption hinzufügen
    const addMenuOption = (option) => {
      if (!props.enableMenuSelection) return null;
      
      try {
        const menuOption = seatingPlannerService.addMenuOption(option);
        
        // Menüoptionen neu laden
        loadMenuOptions();
        
        emit('menu-option-added', menuOption);
        
        return menuOption;
      } catch (error) {
        console.error('Fehler beim Hinzufügen der Menüoption:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Menüoption aktualisieren
    const updateMenuOption = (id, updatedOption) => {
      if (!props.enableMenuSelection) return null;
      
      try {
        const menuOption = seatingPlannerService.updateMenuOption(id, updatedOption);
        
        // Menüoptionen neu laden
        loadMenuOptions();
        
        emit('menu-option-updated', menuOption);
        
        return menuOption;
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Menüoption:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Menüoption entfernen
    const removeMenuOption = (id) => {
      if (!props.enableMenuSelection) return false;
      
      try {
        const removed = seatingPlannerService.removeMenuOption(id);
        
        if (removed) {
          // Menüoptionen neu laden
          loadMenuOptions();
          
          emit('menu-option-removed', { id });
        }
        
        return removed;
      } catch (error) {
        console.error('Fehler beim Entfernen der Menüoption:', error);
        emit('error', error.message);
        return false;
      }
    };
    
    // Raum hinzufügen
    const addRoom = (room) => {
      if (!props.enableMultipleRooms) return null;
      
      try {
        const newRoom = seatingPlannerService.addRoom(room);
        
        // Räume neu laden
        loadRooms();
        
        emit('room-added', newRoom);
        
        return newRoom;
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Raums:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Raum aktualisieren
    const updateRoom = (id, updatedRoom) => {
      try {
        const room = seatingPlannerService.updateRoom(id, updatedRoom);
        
        // Räume neu laden
        loadRooms();
        
        emit('room-updated', room);
        
        return room;
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Raums:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Raum entfernen
    const removeRoom = (id) => {
      if (!props.enableMultipleRooms) return false;
      
      try {
        const removed = seatingPlannerService.removeRoom(id);
        
        if (removed) {
          // Räume neu laden
          loadRooms();
          
          emit('room-removed', { id });
        }
        
        return removed;
      } catch (error) {
        console.error('Fehler beim Entfernen des Raums:', error);
        emit('error', error.message);
        return false;
      }
    };
    
    // Aktuellen Raum setzen
    const setCurrentRoom = (id) => {
      if (!props.enableMultipleRooms) return null;
      
      try {
        const room = seatingPlannerService.setCurrentRoom(id);
        currentRoomId.value = id;
        
        emit('current-room-changed', room);
        
        return room;
      } catch (error) {
        console.error('Fehler beim Setzen des aktuellen Raums:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Hindernis hinzufügen
    const addObstacle = (obstacle) => {
      try {
        const newObstacle = seatingPlannerService.addObstacle(obstacle);
        
        // Hindernisse neu laden
        loadObstacles();
        
        emit('obstacle-added', newObstacle);
        
        return newObstacle;
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Hindernisses:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Hindernis aktualisieren
    const updateObstacle = (id, updatedObstacle) => {
      try {
        const obstacle = seatingPlannerService.updateObstacle(id, updatedObstacle);
        
        // Hindernisse neu laden
        loadObstacles();
        
        emit('obstacle-updated', obstacle);
        
        return obstacle;
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Hindernisses:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Hindernis entfernen
    const removeObstacle = (id) => {
      try {
        const removed = seatingPlannerService.removeObstacle(id);
        
        if (removed) {
          // Hindernisse neu laden
          loadObstacles();
          
          emit('obstacle-removed', { id });
        }
        
        return removed;
      } catch (error) {
        console.error('Fehler beim Entfernen des Hindernisses:', error);
        emit('error', error.message);
        return false;
      }
    };
    
    // Sitzplan exportieren
    const exportSeatingPlan = (format = 'json') => {
      try {
        const exportedPlan = seatingPlannerService.exportSeatingPlan(format);
        
        emit('seating-plan-exported', { format, content: exportedPlan });
        
        return exportedPlan;
      } catch (error) {
        console.error('Fehler beim Exportieren des Sitzplans:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Zoom-Faktor ändern
    const setScale = (newScale) => {
      scale.value = Math.max(0.5, Math.min(2, newScale));
      
      emit('scale-changed', scale.value);
      
      return scale.value;
    };
    
    // Drag-Modus umschalten
    const toggleDragMode = () => {
      if (!props.enableDragAndDrop) return false;
      
      dragMode.value = !dragMode.value;
      
      emit('drag-mode-toggled', dragMode.value);
      
      return dragMode.value;
    };
    
    // Tisch auswählen
    const selectTable = (id) => {
      const table = seatingPlannerService.getTableById(id);
      
      if (table) {
        selectedTable.value = table;
        selectedSeat.value = null;
        
        emit('table-selected', table);
      }
      
      return table;
    };
    
    // Sitz auswählen
    const selectSeat = (id) => {
      const seat = seatingPlannerService.getSeatById(id);
      
      if (seat) {
        selectedSeat.value = seat;
        
        // Auch den zugehörigen Tisch auswählen
        const table = seatingPlannerService.getTableById(seat.tableId);
        if (table) {
          selectedTable.value = table;
        }
        
        emit('seat-selected', seat);
      }
      
      return seat;
    };
    
    // Auswahl zurücksetzen
    const clearSelection = () => {
      selectedTable.value = null;
      selectedSeat.value = null;
      
      emit('selection-cleared');
    };
    
    // Sitze für den ausgewählten Tisch
    const seatsForSelectedTable = computed(() => {
      if (!selectedTable.value) return [];
      
      return seatingPlannerService.getSeatsForTable(selectedTable.value.id);
    });
    
    // Aktueller Raum
    const currentRoom = computed(() => {
      return seatingPlannerService.getRoomById(currentRoomId.value);
    });
    
    // Prüfen, ob das Tischlimit erreicht ist
    const isTableLimitReached = computed(() => {
      return seatingPlannerService.isTableLimitReached();
    });
    
    // Belegungsrate
    const occupancyRate = computed(() => {
      if (!statistics.value.occupancyRate) return 0;
      
      return Math.round(statistics.value.occupancyRate);
    });
    
    return {
      tables,
      seats,
      menuOptions,
      rooms,
      obstacles,
      currentRoomId,
      loading,
      selectedTable,
      selectedSeat,
      statistics,
      dragMode,
      scale,
      newTable,
      seatsForSelectedTable,
      currentRoom,
      isTableLimitReached,
      occupancyRate,
      addTable,
      updateTable,
      removeTable,
      moveTable,
      rotateTable,
      assignGuestToSeat,
      removeGuestFromSeat,
      assignMenuToSeat,
      addSpecialRequirements,
      addMenuOption,
      updateMenuOption,
      removeMenuOption,
      addRoom,
      updateRoom,
      removeRoom,
      setCurrentRoom,
      addObstacle,
      updateObstacle,
      removeObstacle,
      exportSeatingPlan,
      setScale,
      toggleDragMode,
      selectTable,
      selectSeat,
      clearSelection
    };
  },
  
  // WeWeb-spezifische Konfiguration
  weweb: {
    type: 'component',
    uiSchema: {
      ui:maxTables: {
        type: 'number',
        label: 'Maximale Anzahl an Tischen',
        min: 1
      },
      ui:enableDragAndDrop: {
        type: 'toggle',
        label: 'Drag & Drop aktivieren'
      },
      ui:enableMenuSelection: {
        type: 'toggle',
        label: 'Menüauswahl aktivieren'
      },
      ui:enableMultipleRooms: {
        type: 'toggle',
        label: 'Mehrere Räume aktivieren'
      }
    }
  }
};
