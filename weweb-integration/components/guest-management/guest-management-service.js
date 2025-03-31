// Guest Management Service für LemonVows
// Diese Klasse implementiert die Logik für das Gästemanagement

import guestManagementModel from './guest-management-model.json';

class GuestManagementService {
  constructor() {
    this.dataModel = guestManagementModel.dataModel;
    this.guests = [];
    this.groups = [];
    this.maxGuests = 20; // Standard für Free-Version
  }

  /**
   * Setzt das Limit für die maximale Anzahl an Gästen basierend auf der Preisstufe
   * @param {number} limit - Das neue Limit
   */
  setGuestLimit(limit) {
    this.maxGuests = limit;
  }

  /**
   * Prüft, ob das Gästelimit erreicht ist
   * @returns {boolean} - True, wenn das Limit erreicht ist, sonst False
   */
  isGuestLimitReached() {
    return this.guests.length >= this.maxGuests;
  }

  /**
   * Fügt einen neuen Gast zur Liste hinzu
   * @param {Object} guest - Der hinzuzufügende Gast
   * @returns {Object} - Der hinzugefügte Gast mit ID
   */
  addGuest(guest) {
    if (this.isGuestLimitReached()) {
      throw new Error(`Das Gästelimit von ${this.maxGuests} ist erreicht. Upgrade auf einen höheren Plan, um mehr Gäste hinzuzufügen.`);
    }

    // Pflichtfelder prüfen
    if (!guest.firstName || !guest.lastName) {
      throw new Error('Vor- und Nachname sind Pflichtfelder');
    }

    // ID generieren
    const newGuest = {
      ...guest,
      id: this.generateUniqueId(),
      rsvpStatus: guest.rsvpStatus || 'pending',
      invitationSent: guest.invitationSent || false,
      thankYouSent: guest.thankYouSent || false
    };

    this.guests.push(newGuest);
    
    // Event auslösen
    this.triggerEvent('onGuestAdded', newGuest);
    
    return newGuest;
  }

  /**
   * Aktualisiert die Informationen eines Gastes
   * @param {string} id - Die ID des zu aktualisierenden Gastes
   * @param {Object} updatedGuest - Die aktualisierten Gastdaten
   * @returns {Object} - Der aktualisierte Gast
   */
  updateGuest(id, updatedGuest) {
    const guestIndex = this.guests.findIndex(guest => guest.id === id);
    
    if (guestIndex === -1) {
      throw new Error('Gast nicht gefunden');
    }
    
    // Aktualisieren des Gastes
    this.guests[guestIndex] = {
      ...this.guests[guestIndex],
      ...updatedGuest,
      id // ID beibehalten
    };
    
    // Event auslösen
    this.triggerEvent('onGuestUpdated', this.guests[guestIndex]);
    
    return this.guests[guestIndex];
  }

  /**
   * Entfernt einen Gast aus der Liste
   * @param {string} id - Die ID des zu entfernenden Gastes
   * @returns {boolean} - True, wenn der Gast erfolgreich entfernt wurde
   */
  removeGuest(id) {
    const initialLength = this.guests.length;
    this.guests = this.guests.filter(guest => guest.id !== id);
    
    const removed = this.guests.length < initialLength;
    
    if (removed) {
      // Event auslösen
      this.triggerEvent('onGuestRemoved', { id });
    }
    
    return removed;
  }

  /**
   * Ruft einen Gast anhand seiner ID ab
   * @param {string} id - Die ID des Gastes
   * @returns {Object|null} - Der Gast oder null, wenn nicht gefunden
   */
  getGuestById(id) {
    return this.guests.find(guest => guest.id === id) || null;
  }

  /**
   * Ruft alle Gäste ab
   * @returns {Array} - Alle Gäste
   */
  getAllGuests() {
    return [...this.guests];
  }

  /**
   * Filtert Gäste nach verschiedenen Kriterien
   * @param {Object} filters - Die anzuwendenden Filter
   * @returns {Array} - Die gefilterten Gäste
   */
  filterGuests(filters = {}) {
    return this.guests.filter(guest => {
      let match = true;
      
      // Nach RSVP-Status filtern
      if (filters.rsvpStatus && guest.rsvpStatus !== filters.rsvpStatus) {
        match = false;
      }
      
      // Nach Gruppe filtern
      if (filters.group && guest.group !== filters.group) {
        match = false;
      }
      
      // Nach Tisch filtern
      if (filters.tableAssignment && guest.tableAssignment !== filters.tableAssignment) {
        match = false;
      }
      
      // Nach Einladungsstatus filtern
      if (filters.invitationSent !== undefined && guest.invitationSent !== filters.invitationSent) {
        match = false;
      }
      
      // Nach Dankeschön-Status filtern
      if (filters.thankYouSent !== undefined && guest.thankYouSent !== filters.thankYouSent) {
        match = false;
      }
      
      // Nach Kindern filtern
      if (filters.isChild !== undefined && guest.isChild !== filters.isChild) {
        match = false;
      }
      
      // Nach Suchbegriff filtern
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const fullName = `${guest.firstName} ${guest.lastName}`.toLowerCase();
        const email = (guest.email || '').toLowerCase();
        
        if (!fullName.includes(query) && !email.includes(query)) {
          match = false;
        }
      }
      
      return match;
    });
  }

  /**
   * Aktualisiert den RSVP-Status eines Gastes
   * @param {string} id - Die ID des Gastes
   * @param {string} status - Der neue RSVP-Status (pending, confirmed, declined)
   * @returns {Object} - Der aktualisierte Gast
   */
  updateRSVP(id, status) {
    if (!['pending', 'confirmed', 'declined'].includes(status)) {
      throw new Error('Ungültiger RSVP-Status. Erlaubte Werte: pending, confirmed, declined');
    }
    
    const guest = this.getGuestById(id);
    
    if (!guest) {
      throw new Error('Gast nicht gefunden');
    }
    
    const updatedGuest = this.updateGuest(id, { rsvpStatus: status });
    
    // Event auslösen
    this.triggerEvent('onRSVPReceived', updatedGuest);
    
    return updatedGuest;
  }

  /**
   * Markiert eine Einladung als gesendet
   * @param {string} id - Die ID des Gastes
   * @param {Date} sentDate - Das Datum, an dem die Einladung gesendet wurde
   * @returns {Object} - Der aktualisierte Gast
   */
  markInvitationSent(id, sentDate = new Date()) {
    const guest = this.getGuestById(id);
    
    if (!guest) {
      throw new Error('Gast nicht gefunden');
    }
    
    return this.updateGuest(id, {
      invitationSent: true,
      invitationSentDate: sentDate
    });
  }

  /**
   * Markiert ein Dankeschön als gesendet
   * @param {string} id - Die ID des Gastes
   * @param {Date} sentDate - Das Datum, an dem das Dankeschön gesendet wurde
   * @returns {Object} - Der aktualisierte Gast
   */
  markThankYouSent(id, sentDate = new Date()) {
    const guest = this.getGuestById(id);
    
    if (!guest) {
      throw new Error('Gast nicht gefunden');
    }
    
    return this.updateGuest(id, {
      thankYouSent: true,
      thankYouSentDate: sentDate
    });
  }

  /**
   * Weist einen Gast einem Tisch zu
   * @param {string} id - Die ID des Gastes
   * @param {number} tableNumber - Die Tischnummer
   * @returns {Object} - Der aktualisierte Gast
   */
  assignTable(id, tableNumber) {
    const guest = this.getGuestById(id);
    
    if (!guest) {
      throw new Error('Gast nicht gefunden');
    }
    
    return this.updateGuest(id, { tableAssignment: tableNumber });
  }

  /**
   * Fügt eine neue Gruppe hinzu
   * @param {Object} group - Die hinzuzufügende Gruppe
   * @returns {Object} - Die hinzugefügte Gruppe mit ID
   */
  addGroup(group) {
    if (!group.name) {
      throw new Error('Der Gruppenname ist ein Pflichtfeld');
    }
    
    const newGroup = {
      ...group,
      id: this.generateUniqueId('group_')
    };
    
    this.groups.push(newGroup);
    
    return newGroup;
  }

  /**
   * Aktualisiert eine Gruppe
   * @param {string} id - Die ID der zu aktualisierenden Gruppe
   * @param {Object} updatedGroup - Die aktualisierten Gruppendaten
   * @returns {Object} - Die aktualisierte Gruppe
   */
  updateGroup(id, updatedGroup) {
    const groupIndex = this.groups.findIndex(group => group.id === id);
    
    if (groupIndex === -1) {
      throw new Error('Gruppe nicht gefunden');
    }
    
    this.groups[groupIndex] = {
      ...this.groups[groupIndex],
      ...updatedGroup,
      id // ID beibehalten
    };
    
    return this.groups[groupIndex];
  }

  /**
   * Entfernt eine Gruppe
   * @param {string} id - Die ID der zu entfernenden Gruppe
   * @returns {boolean} - True, wenn die Gruppe erfolgreich entfernt wurde
   */
  removeGroup(id) {
    const initialLength = this.groups.length;
    this.groups = this.groups.filter(group => group.id !== id);
    
    return this.groups.length < initialLength;
  }

  /**
   * Ruft alle Gruppen ab
   * @returns {Array} - Alle Gruppen
   */
  getAllGroups() {
    return [...this.groups];
  }

  /**
   * Weist einen Gast einer Gruppe zu
   * @param {string} guestId - Die ID des Gastes
   * @param {string} groupId - Die ID der Gruppe
   * @returns {Object} - Der aktualisierte Gast
   */
  assignGuestToGroup(guestId, groupId) {
    const guest = this.getGuestById(guestId);
    
    if (!guest) {
      throw new Error('Gast nicht gefunden');
    }
    
    const group = this.groups.find(group => group.id === groupId);
    
    if (!group && groupId) {
      throw new Error('Gruppe nicht gefunden');
    }
    
    return this.updateGuest(guestId, { group: groupId });
  }

  /**
   * Exportiert die Gästeliste in verschiedenen Formaten
   * @param {string} format - Das Exportformat (csv, json)
   * @returns {string} - Die exportierte Gästeliste
   */
  exportGuestList(format = 'json') {
    switch (format.toLowerCase()) {
      case 'csv':
        return this.exportAsCSV();
      case 'json':
      default:
        return JSON.stringify(this.guests, null, 2);
    }
  }

  /**
   * Exportiert die Gästeliste als CSV
   * @returns {string} - Die Gästeliste im CSV-Format
   */
  exportAsCSV() {
    const headers = [
      'Vorname',
      'Nachname',
      'E-Mail',
      'Telefon',
      'RSVP-Status',
      'Diätbeschränkungen',
      'Unterkunft',
      'Plus Eins',
      'Name Plus Eins',
      'Notizen',
      'Tisch',
      'Gruppe',
      'Kind',
      'Alter',
      'Einladung gesendet',
      'Dankeschön gesendet'
    ];
    
    const rows = this.guests.map(guest => [
      guest.firstName,
      guest.lastName,
      guest.email || '',
      guest.phone || '',
      guest.rsvpStatus || 'pending',
      guest.dietaryRestrictions || '',
      guest.accommodation ? 'Ja' : 'Nein',
      guest.plusOne ? 'Ja' : 'Nein',
      guest.plusOneName || '',
      guest.notes || '',
      guest.tableAssignment || '',
      guest.group || '',
      guest.isChild ? 'Ja' : 'Nein',
      guest.age || '',
      guest.invitationSent ? 'Ja' : 'Nein',
      guest.thankYouSent ? 'Ja' : 'Nein'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csvContent;
  }

  /**
   * Generiert eine eindeutige ID
   * @param {string} prefix - Das Präfix für die ID
   * @returns {string} - Eine eindeutige ID
   */
  generateUniqueId(prefix = 'guest_') {
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

  /**
   * Berechnet Statistiken zur Gästeliste
   * @returns {Object} - Statistiken zur Gästeliste
   */
  getGuestStatistics() {
    const totalGuests = this.guests.length;
    const confirmedGuests = this.guests.filter(guest => guest.rsvpStatus === 'confirmed').length;
    const declinedGuests = this.guests.filter(guest => guest.rsvpStatus === 'declined').length;
    const pendingGuests = this.guests.filter(guest => guest.rsvpStatus === 'pending').length;
    const childrenCount = this.guests.filter(guest => guest.isChild).length;
    const plusOnesCount = this.guests.filter(guest => guest.plusOne).length;
    
    return {
      totalGuests,
      confirmedGuests,
      declinedGuests,
      pendingGuests,
      childrenCount,
      plusOnesCount,
      responseRate: totalGuests > 0 ? ((confirmedGuests + declinedGuests) / totalGuests) * 100 : 0
    };
  }
}

// Exportieren des GuestManagementService
export default new GuestManagementService();
