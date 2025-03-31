// Seating Planner Service für LemonVows
// Diese Klasse implementiert die Logik für die Sitzplatzplanung

import seatingPlannerModel from './seating-planner-model.json';

class SeatingPlannerService {
  constructor() {
    this.dataModel = seatingPlannerModel.dataModel;
    this.defaultTableShapes = seatingPlannerModel.defaultTableShapes;
    this.defaultMenuOptions = seatingPlannerModel.defaultMenuOptions;
    this.tables = [];
    this.seats = [];
    this.menuOptions = [];
    this.rooms = [];
    this.obstacles = [];
    this.maxTables = 5; // Standard für Free-Version
    this.currentRoomId = null;
  }

  /**
   * Setzt das Limit für die maximale Anzahl an Tischen basierend auf der Preisstufe
   * @param {number} limit - Das neue Limit
   */
  setTableLimit(limit) {
    this.maxTables = limit;
  }

  /**
   * Prüft, ob das Tischlimit erreicht ist
   * @returns {boolean} - True, wenn das Limit erreicht ist, sonst False
   */
  isTableLimitReached() {
    return this.tables.length >= this.maxTables;
  }

  /**
   * Initialisiert die Sitzplatzplanung mit Standardoptionen
   */
  initialize() {
    // Standardmenüoptionen erstellen
    this.menuOptions = this.defaultMenuOptions.map(option => ({
      ...option,
      id: this.generateUniqueId('menu_')
    }));
    
    // Standardraum erstellen
    const defaultRoom = {
      id: this.generateUniqueId('room_'),
      name: 'Hauptraum',
      width: 800,
      height: 600,
      backgroundImage: null
    };
    
    this.rooms = [defaultRoom];
    this.currentRoomId = defaultRoom.id;
    
    // Event auslösen
    this.triggerEvent('onSeatingPlannerInitialized', {
      menuOptions: this.menuOptions,
      rooms: this.rooms,
      currentRoomId: this.currentRoomId
    });
    
    return {
      menuOptions: this.menuOptions,
      rooms: this.rooms,
      currentRoomId: this.currentRoomId
    };
  }

  /**
   * Fügt einen neuen Tisch hinzu
   * @param {Object} table - Der hinzuzufügende Tisch
   * @returns {Object} - Der hinzugefügte Tisch mit ID
   */
  addTable(table) {
    if (this.isTableLimitReached()) {
      throw new Error(`Das Tischlimit von ${this.maxTables} ist erreicht. Upgrade auf einen höheren Plan, um mehr Tische hinzuzufügen.`);
    }

    // Pflichtfelder prüfen
    if (!table.name) {
      throw new Error('Der Tischname ist ein Pflichtfeld');
    }

    // Standardwerte für Tischform verwenden, wenn nicht angegeben
    const shape = table.shape || 'round';
    const defaultShape = this.defaultTableShapes.find(s => s.shape === shape) || this.defaultTableShapes[0];
    
    // ID generieren
    const newTable = {
      ...table,
      id: this.generateUniqueId('table_'),
      shape: shape,
      capacity: table.capacity || defaultShape.defaultCapacity,
      width: table.width || defaultShape.defaultWidth,
      height: table.height || defaultShape.defaultHeight,
      positionX: table.positionX || 100,
      positionY: table.positionY || 100,
      rotation: table.rotation || 0
    };

    this.tables.push(newTable);
    
    // Sitze für den Tisch erstellen
    this.createSeatsForTable(newTable.id, newTable.capacity);
    
    // Event auslösen
    this.triggerEvent('onTableAdded', newTable);
    
    return newTable;
  }

  /**
   * Erstellt Sitze für einen Tisch
   * @param {string} tableId - Die ID des Tisches
   * @param {number} capacity - Die Anzahl der Sitze
   * @returns {Array} - Die erstellten Sitze
   */
  createSeatsForTable(tableId, capacity) {
    const newSeats = [];
    
    for (let i = 0; i < capacity; i++) {
      const seat = {
        id: this.generateUniqueId('seat_'),
        tableId,
        position: i,
        guestId: null,
        menuChoice: null,
        specialRequirements: null
      };
      
      this.seats.push(seat);
      newSeats.push(seat);
    }
    
    return newSeats;
  }

  /**
   * Aktualisiert einen Tisch
   * @param {string} id - Die ID des zu aktualisierenden Tisches
   * @param {Object} updatedTable - Die aktualisierten Tischdaten
   * @returns {Object} - Der aktualisierte Tisch
   */
  updateTable(id, updatedTable) {
    const tableIndex = this.tables.findIndex(table => table.id === id);
    
    if (tableIndex === -1) {
      throw new Error('Tisch nicht gefunden');
    }
    
    const oldCapacity = this.tables[tableIndex].capacity;
    const newCapacity = updatedTable.capacity !== undefined ? updatedTable.capacity : oldCapacity;
    
    // Aktualisieren des Tisches
    this.tables[tableIndex] = {
      ...this.tables[tableIndex],
      ...updatedTable,
      id // ID beibehalten
    };
    
    // Wenn sich die Kapazität geändert hat, Sitze anpassen
    if (newCapacity !== oldCapacity) {
      this.adjustSeatsForTable(id, oldCapacity, newCapacity);
    }
    
    // Event auslösen
    this.triggerEvent('onTableUpdated', this.tables[tableIndex]);
    
    return this.tables[tableIndex];
  }

  /**
   * Passt die Anzahl der Sitze für einen Tisch an
   * @param {string} tableId - Die ID des Tisches
   * @param {number} oldCapacity - Die alte Kapazität
   * @param {number} newCapacity - Die neue Kapazität
   */
  adjustSeatsForTable(tableId, oldCapacity, newCapacity) {
    if (newCapacity > oldCapacity) {
      // Sitze hinzufügen
      for (let i = oldCapacity; i < newCapacity; i++) {
        const seat = {
          id: this.generateUniqueId('seat_'),
          tableId,
          position: i,
          guestId: null,
          menuChoice: null,
          specialRequirements: null
        };
        
        this.seats.push(seat);
      }
    } else if (newCapacity < oldCapacity) {
      // Sitze entfernen, aber nur die, die keinem Gast zugewiesen sind
      const tableSeats = this.getSeatsForTable(tableId);
      
      // Sortieren nach Position, damit wir von hinten entfernen können
      tableSeats.sort((a, b) => a.position - b.position);
      
      // Sitze von hinten entfernen, bis wir die gewünschte Kapazität erreicht haben
      for (let i = tableSeats.length - 1; i >= newCapacity && i >= 0; i--) {
        const seat = tableSeats[i];
        
        // Nur entfernen, wenn kein Gast zugewiesen ist
        if (!seat.guestId) {
          this.seats = this.seats.filter(s => s.id !== seat.id);
        }
      }
      
      // Positionen neu nummerieren
      this.renumberSeatsForTable(tableId);
    }
  }

  /**
   * Nummeriert die Positionen der Sitze für einen Tisch neu
   * @param {string} tableId - Die ID des Tisches
   */
  renumberSeatsForTable(tableId) {
    const tableSeats = this.getSeatsForTable(tableId);
    
    // Sortieren nach Position
    tableSeats.sort((a, b) => a.position - b.position);
    
    // Neu nummerieren
    tableSeats.forEach((seat, index) => {
      const seatIndex = this.seats.findIndex(s => s.id === seat.id);
      if (seatIndex !== -1) {
        this.seats[seatIndex].position = index;
      }
    });
  }

  /**
   * Entfernt einen Tisch
   * @param {string} id - Die ID des zu entfernenden Tisches
   * @returns {boolean} - True, wenn der Tisch erfolgreich entfernt wurde
   */
  removeTable(id) {
    // Prüfen, ob Gäste an diesem Tisch sitzen
    const tableSeats = this.getSeatsForTable(id);
    const assignedGuests = tableSeats.filter(seat => seat.guestId).length;
    
    if (assignedGuests > 0) {
      throw new Error(`Dieser Tisch kann nicht entfernt werden, da ${assignedGuests} Gäste zugewiesen sind. Bitte weisen Sie die Gäste zuerst einem anderen Tisch zu.`);
    }
    
    const initialLength = this.tables.length;
    this.tables = this.tables.filter(table => table.id !== id);
    
    const removed = this.tables.length < initialLength;
    
    if (removed) {
      // Sitze für diesen Tisch entfernen
      this.seats = this.seats.filter(seat => seat.tableId !== id);
      
      // Event auslösen
      this.triggerEvent('onTableRemoved', { id });
    }
    
    return removed;
  }

  /**
   * Weist einen Gast einem Sitz zu
   * @param {string} seatId - Die ID des Sitzes
   * @param {string} guestId - Die ID des Gastes
   * @returns {Object} - Der aktualisierte Sitz
   */
  assignGuestToSeat(seatId, guestId) {
    const seatIndex = this.seats.findIndex(seat => seat.id === seatId);
    
    if (seatIndex === -1) {
      throw new Error('Sitz nicht gefunden');
    }
    
    // Prüfen, ob der Gast bereits einem anderen Sitz zugewiesen ist
    const existingSeat = this.seats.find(seat => seat.guestId === guestId);
    
    if (existingSeat && existingSeat.id !== seatId) {
      // Gast von altem Sitz entfernen
      const existingSeatIndex = this.seats.findIndex(seat => seat.id === existingSeat.id);
      this.seats[existingSeatIndex].guestId = null;
    }
    
    // Gast dem neuen Sitz zuweisen
    this.seats[seatIndex].guestId = guestId;
    
    // Event auslösen
    this.triggerEvent('onGuestAssigned', this.seats[seatIndex]);
    
    return this.seats[seatIndex];
  }

  /**
   * Entfernt einen Gast von einem Sitz
   * @param {string} seatId - Die ID des Sitzes
   * @returns {Object} - Der aktualisierte Sitz
   */
  removeGuestFromSeat(seatId) {
    const seatIndex = this.seats.findIndex(seat => seat.id === seatId);
    
    if (seatIndex === -1) {
      throw new Error('Sitz nicht gefunden');
    }
    
    const oldGuestId = this.seats[seatIndex].guestId;
    this.seats[seatIndex].guestId = null;
    
    // Event auslösen
    this.triggerEvent('onGuestRemoved', { seatId, guestId: oldGuestId });
    
    return this.seats[seatIndex];
  }

  /**
   * Weist einem Sitz eine Menüauswahl zu
   * @param {string} seatId - Die ID des Sitzes
   * @param {string} menuId - Die ID der Menüoption
   * @returns {Object} - Der aktualisierte Sitz
   */
  assignMenuToSeat(seatId, menuId) {
    const seatIndex = this.seats.findIndex(seat => seat.id === seatId);
    
    if (seatIndex === -1) {
      throw new Error('Sitz nicht gefunden');
    }
    
    // Prüfen, ob die Menüoption existiert
    if (menuId && !this.getMenuOptionById(menuId)) {
      throw new Error('Menüoption nicht gefunden');
    }
    
    this.seats[seatIndex].menuChoice = menuId;
    
    // Event auslösen
    this.triggerEvent('onMenuAssigned', this.seats[seatIndex]);
    
    return this.seats[seatIndex];
  }

  /**
   * Fügt spezielle Anforderungen für einen Sitz hinzu
   * @param {string} seatId - Die ID des Sitzes
   * @param {string} requirements - Die speziellen Anforderungen
   * @returns {Object} - Der aktualisierte Sitz
   */
  addSpecialRequirements(seatId, requirements) {
    const seatIndex = this.seats.findIndex(seat => seat.id === seatId);
    
    if (seatIndex === -1) {
      throw new Error('Sitz nicht gefunden');
    }
    
    this.seats[seatIndex].specialRequirements = requirements;
    
    // Event auslösen
    this.triggerEvent('onSpecialRequirementsAdded', this.seats[seatIndex]);
    
    return this.seats[seatIndex];
  }

  /**
   * Fügt eine neue Menüoption hinzu
   * @param {Object} option - Die hinzuzufügende Menüoption
   * @returns {Object} - Die hinzugefügte Menüoption mit ID
   */
  addMenuOption(option) {
    if (!option.name) {
      throw new Error('Der Name der Menüoption ist ein Pflichtfeld');
    }
    
    const newOption = {
      ...option,
      id: this.generateUniqueId('menu_'),
      type: option.type || 'main',
      color: option.color || this.getRandomColor()
    };
    
    this.menuOptions.push(newOption);
    
    // Event auslösen
    this.triggerEvent('onMenuOptionAdded', newOption);
    
    return newOption;
  }

  /**
   * Aktualisiert eine Menüoption
   * @param {string} id - Die ID der zu aktualisierenden Menüoption
   * @param {Object} updatedOption - Die aktualisierten Daten
   * @returns {Object} - Die aktualisierte Menüoption
   */
  updateMenuOption(id, updatedOption) {
    const optionIndex = this.menuOptions.findIndex(option => option.id === id);
    
    if (optionIndex === -1) {
      throw new Error('Menüoption nicht gefunden');
    }
    
    this.menuOptions[optionIndex] = {
      ...this.menuOptions[optionIndex],
      ...updatedOption,
      id // ID beibehalten
    };
    
    // Event auslösen
    this.triggerEvent('onMenuOptionUpdated', this.menuOptions[optionIndex]);
    
    return this.menuOptions[optionIndex];
  }

  /**
   * Entfernt eine Menüoption
   * @param {string} id - Die ID der zu entfernenden Menüoption
   * @returns {boolean} - True, wenn die Menüoption erfolgreich entfernt wurde
   */
  removeMenuOption(id) {
    // Prüfen, ob die Menüoption verwendet wird
    const seatsWithMenu = this.seats.filter(seat => seat.menuChoice === id).length;
    
    if (seatsWithMenu > 0) {
      throw new Error(`Diese Menüoption kann nicht entfernt werden, da sie von ${seatsWithMenu} Sitzen verwendet wird.`);
    }
    
    const initialLength = this.menuOptions.length;
    this.menuOptions = this.menuOptions.filter(option => option.id !== id);
    
    const removed = this.menuOptions.length < initialLength;
    
    if (removed) {
      // Event auslösen
      this.triggerEvent('onMenuOptionRemoved', { id });
    }
    
    return removed;
  }

  /**
   * Fügt einen neuen Raum hinzu
   * @param {Object} room - Der hinzuzufügende Raum
   * @returns {Object} - Der hinzugefügte Raum mit ID
   */
  addRoom(room) {
    if (!room.name) {
      throw new Error('Der Raumname ist ein Pflichtfeld');
    }
    
    const newRoom = {
      ...room,
      id: this.generateUniqueId('room_'),
      width: room.width || 800,
      height: room.height || 600
    };
    
    this.rooms.push(newRoom);
    
    // Event auslösen
    this.triggerEvent('onRoomAdded', newRoom);
    
    return newRoom;
  }

  /**
   * Aktualisiert einen Raum
   * @param {string} id - Die ID des zu aktualisierenden Raums
   * @param {Object} updatedRoom - Die aktualisierten Raumdaten
   * @returns {Object} - Der aktualisierte Raum
   */
  updateRoom(id, updatedRoom) {
    const roomIndex = this.rooms.findIndex(room => room.id === id);
    
    if (roomIndex === -1) {
      throw new Error('Raum nicht gefunden');
    }
    
    this.rooms[roomIndex] = {
      ...this.rooms[roomIndex],
      ...updatedRoom,
      id // ID beibehalten
    };
    
    // Event auslösen
    this.triggerEvent('onRoomUpdated', this.rooms[roomIndex]);
    
    return this.rooms[roomIndex];
  }

  /**
   * Entfernt einen Raum
   * @param {string} id - Die ID des zu entfernenden Raums
   * @returns {boolean} - True, wenn der Raum erfolgreich entfernt wurde
   */
  removeRoom(id) {
    // Prüfen, ob es der letzte Raum ist
    if (this.rooms.length <= 1) {
      throw new Error('Der letzte Raum kann nicht entfernt werden.');
    }
    
    // Prüfen, ob es der aktuelle Raum ist
    if (id === this.currentRoomId) {
      throw new Error('Der aktuelle Raum kann nicht entfernt werden. Bitte wechseln Sie zuerst zu einem anderen Raum.');
    }
    
    const initialLength = this.rooms.length;
    this.rooms = this.rooms.filter(room => room.id !== id);
    
    const removed = this.rooms.length < initialLength;
    
    if (removed) {
      // Event auslösen
      this.triggerEvent('onRoomRemoved', { id });
    }
    
    return removed;
  }

  /**
   * Setzt den aktuellen Raum
   * @param {string} id - Die ID des Raums
   * @returns {Object} - Der aktuelle Raum
   */
  setCurrentRoom(id) {
    const room = this.getRoomById(id);
    
    if (!room) {
      throw new Error('Raum nicht gefunden');
    }
    
    this.currentRoomId = id;
    
    // Event auslösen
    this.triggerEvent('onCurrentRoomChanged', room);
    
    return room;
  }

  /**
   * Fügt ein Hindernis hinzu
   * @param {Object} obstacle - Das hinzuzufügende Hindernis
   * @returns {Object} - Das hinzugefügte Hindernis mit ID
   */
  addObstacle(obstacle) {
    if (!obstacle.name) {
      throw new Error('Der Name des Hindernisses ist ein Pflichtfeld');
    }
    
    const newObstacle = {
      ...obstacle,
      id: this.generateUniqueId('obstacle_'),
      type: obstacle.type || 'other',
      positionX: obstacle.positionX || 0,
      positionY: obstacle.positionY || 0,
      width: obstacle.width || 50,
      height: obstacle.height || 50,
      rotation: obstacle.rotation || 0
    };
    
    this.obstacles.push(newObstacle);
    
    // Event auslösen
    this.triggerEvent('onObstacleAdded', newObstacle);
    
    return newObstacle;
  }

  /**
   * Aktualisiert ein Hindernis
   * @param {string} id - Die ID des zu aktualisierenden Hindernisses
   * @param {Object} updatedObstacle - Die aktualisierten Hindernisdaten
   * @returns {Object} - Das aktualisierte Hindernis
   */
  updateObstacle(id, updatedObstacle) {
    const obstacleIndex = this.obstacles.findIndex(obstacle => obstacle.id === id);
    
    if (obstacleIndex === -1) {
      throw new Error('Hindernis nicht gefunden');
    }
    
    this.obstacles[obstacleIndex] = {
      ...this.obstacles[obstacleIndex],
      ...updatedObstacle,
      id // ID beibehalten
    };
    
    // Event auslösen
    this.triggerEvent('onObstacleUpdated', this.obstacles[obstacleIndex]);
    
    return this.obstacles[obstacleIndex];
  }

  /**
   * Entfernt ein Hindernis
   * @param {string} id - Die ID des zu entfernenden Hindernisses
   * @returns {boolean} - True, wenn das Hindernis erfolgreich entfernt wurde
   */
  removeObstacle(id) {
    const initialLength = this.obstacles.length;
    this.obstacles = this.obstacles.filter(obstacle => obstacle.id !== id);
    
    const removed = this.obstacles.length < initialLength;
    
    if (removed) {
      // Event auslösen
      this.triggerEvent('onObstacleRemoved', { id });
    }
    
    return removed;
  }

  /**
   * Ruft einen Tisch anhand seiner ID ab
   * @param {string} id - Die ID des Tisches
   * @returns {Object|null} - Der Tisch oder null, wenn nicht gefunden
   */
  getTableById(id) {
    return this.tables.find(table => table.id === id) || null;
  }

  /**
   * Ruft alle Tische ab
   * @returns {Array} - Alle Tische
   */
  getAllTables() {
    return [...this.tables];
  }

  /**
   * Ruft einen Sitz anhand seiner ID ab
   * @param {string} id - Die ID des Sitzes
   * @returns {Object|null} - Der Sitz oder null, wenn nicht gefunden
   */
  getSeatById(id) {
    return this.seats.find(seat => seat.id === id) || null;
  }

  /**
   * Ruft alle Sitze ab
   * @returns {Array} - Alle Sitze
   */
  getAllSeats() {
    return [...this.seats];
  }

  /**
   * Ruft alle Sitze für einen Tisch ab
   * @param {string} tableId - Die ID des Tisches
   * @returns {Array} - Alle Sitze für den Tisch
   */
  getSeatsForTable(tableId) {
    return this.seats.filter(seat => seat.tableId === tableId);
  }

  /**
   * Ruft den Sitz für einen Gast ab
   * @param {string} guestId - Die ID des Gastes
   * @returns {Object|null} - Der Sitz oder null, wenn nicht gefunden
   */
  getSeatForGuest(guestId) {
    return this.seats.find(seat => seat.guestId === guestId) || null;
  }

  /**
   * Ruft eine Menüoption anhand ihrer ID ab
   * @param {string} id - Die ID der Menüoption
   * @returns {Object|null} - Die Menüoption oder null, wenn nicht gefunden
   */
  getMenuOptionById(id) {
    return this.menuOptions.find(option => option.id === id) || null;
  }

  /**
   * Ruft alle Menüoptionen ab
   * @returns {Array} - Alle Menüoptionen
   */
  getAllMenuOptions() {
    return [...this.menuOptions];
  }

  /**
   * Ruft einen Raum anhand seiner ID ab
   * @param {string} id - Die ID des Raums
   * @returns {Object|null} - Der Raum oder null, wenn nicht gefunden
   */
  getRoomById(id) {
    return this.rooms.find(room => room.id === id) || null;
  }

  /**
   * Ruft alle Räume ab
   * @returns {Array} - Alle Räume
   */
  getAllRooms() {
    return [...this.rooms];
  }

  /**
   * Ruft den aktuellen Raum ab
   * @returns {Object|null} - Der aktuelle Raum oder null, wenn nicht gefunden
   */
  getCurrentRoom() {
    return this.getRoomById(this.currentRoomId);
  }

  /**
   * Ruft ein Hindernis anhand seiner ID ab
   * @param {string} id - Die ID des Hindernisses
   * @returns {Object|null} - Das Hindernis oder null, wenn nicht gefunden
   */
  getObstacleById(id) {
    return this.obstacles.find(obstacle => obstacle.id === id) || null;
  }

  /**
   * Ruft alle Hindernisse ab
   * @returns {Array} - Alle Hindernisse
   */
  getAllObstacles() {
    return [...this.obstacles];
  }

  /**
   * Exportiert den Sitzplan in verschiedenen Formaten
   * @param {string} format - Das Exportformat (json, csv)
   * @returns {string} - Der exportierte Sitzplan
   */
  exportSeatingPlan(format = 'json') {
    switch (format.toLowerCase()) {
      case 'csv':
        return this.exportAsCSV();
      case 'json':
      default:
        return JSON.stringify({
          tables: this.tables,
          seats: this.seats,
          menuOptions: this.menuOptions,
          rooms: this.rooms,
          obstacles: this.obstacles,
          currentRoomId: this.currentRoomId
        }, null, 2);
    }
  }

  /**
   * Exportiert den Sitzplan als CSV
   * @returns {string} - Der Sitzplan im CSV-Format
   */
  exportAsCSV() {
    const headers = [
      'Tisch',
      'Sitzposition',
      'Gast-ID',
      'Menüauswahl',
      'Spezielle Anforderungen'
    ];
    
    const rows = this.seats.map(seat => {
      const table = this.getTableById(seat.tableId);
      const menuOption = seat.menuChoice ? this.getMenuOptionById(seat.menuChoice) : null;
      
      return [
        table ? table.name : '',
        seat.position + 1, // Position + 1 für benutzerfreundlichere Anzeige
        seat.guestId || '',
        menuOption ? menuOption.name : '',
        seat.specialRequirements || ''
      ];
    });
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csvContent;
  }

  /**
   * Berechnet Sitzplanstatistiken
   * @returns {Object} - Sitzplanstatistiken
   */
  getSeatingPlanStatistics() {
    const totalTables = this.tables.length;
    const totalSeats = this.seats.length;
    const assignedSeats = this.seats.filter(seat => seat.guestId).length;
    const unassignedSeats = totalSeats - assignedSeats;
    
    // Statistiken pro Tisch
    const tableStats = {};
    
    this.tables.forEach(table => {
      const tableSeats = this.getSeatsForTable(table.id);
      const assignedTableSeats = tableSeats.filter(seat => seat.guestId).length;
      
      tableStats[table.id] = {
        name: table.name,
        capacity: table.capacity,
        assigned: assignedTableSeats,
        unassigned: table.capacity - assignedTableSeats,
        occupancyRate: table.capacity > 0 ? (assignedTableSeats / table.capacity) * 100 : 0
      };
    });
    
    // Statistiken pro Menüoption
    const menuStats = {};
    
    this.menuOptions.forEach(option => {
      const seatsWithMenu = this.seats.filter(seat => seat.menuChoice === option.id).length;
      
      menuStats[option.id] = {
        name: option.name,
        count: seatsWithMenu,
        percentage: totalSeats > 0 ? (seatsWithMenu / totalSeats) * 100 : 0
      };
    });
    
    return {
      totalTables,
      totalSeats,
      assignedSeats,
      unassignedSeats,
      occupancyRate: totalSeats > 0 ? (assignedSeats / totalSeats) * 100 : 0,
      tableStats,
      menuStats
    };
  }

  /**
   * Generiert eine eindeutige ID
   * @param {string} prefix - Das Präfix für die ID
   * @returns {string} - Eine eindeutige ID
   */
  generateUniqueId(prefix = 'seating_') {
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

// Exportieren des SeatingPlannerService
export default new SeatingPlannerService();
