// WeWeb Integration Test Script für LemonVows
// Dieses Skript testet die Funktionalität der WeWeb-Integration

// Hilfsfunktion zum Testen
function testComponent(componentName, tests) {
  console.log(`\n=== Teste ${componentName} ===`);
  
  let passedTests = 0;
  let failedTests = 0;
  
  for (const [testName, testFunction] of Object.entries(tests)) {
    try {
      const result = testFunction();
      if (result) {
        console.log(`✅ ${testName}`);
        passedTests++;
      } else {
        console.log(`❌ ${testName}`);
        failedTests++;
      }
    } catch (error) {
      console.error(`❌ ${testName} - Fehler: ${error.message}`);
      failedTests++;
    }
  }
  
  console.log(`\nErgebnis für ${componentName}: ${passedTests} bestanden, ${failedTests} fehlgeschlagen`);
  
  return {
    component: componentName,
    passed: passedTests,
    failed: failedTests
  };
}

// Preisstufen testen
function testPricingTiers() {
  console.log("\n=== Teste Preisstufen ===");
  
  // Importiere den Pricing-Service
  const pricingService = require('./components/pricing-tiers/pricing-service.js').default;
  
  // Teste Preisstufen
  const tests = {
    "Sollte alle Preisstufen zurückgeben": () => {
      const tiers = pricingService.getAllTiers();
      return tiers.length === 4 && 
             tiers[0].name === "Free Version" && 
             tiers[1].name === "Basis" &&
             tiers[2].name === "Premium" &&
             tiers[3].name === "Deluxe";
    },
    
    "Sollte korrekte Preise für Preisstufen haben": () => {
      const tiers = pricingService.getAllTiers();
      return tiers[0].price === 0 && 
             tiers[1].price === 29.99 &&
             tiers[2].price === 89.99 &&
             tiers[3].price === 199.99;
    },
    
    "Sollte korrekte Gästelimits für Preisstufen haben": () => {
      const tiers = pricingService.getAllTiers();
      return tiers[0].guestLimit === 20 && 
             tiers[1].guestLimit === 50 &&
             tiers[2].guestLimit === Infinity &&
             tiers[3].guestLimit === Infinity;
    },
    
    "Sollte Funktionen basierend auf Preisstufe freischalten": () => {
      return pricingService.isFeatureEnabled('timeline_generator', 'free') === true &&
             pricingService.isFeatureEnabled('ai_speech_generator', 'free') === false &&
             pricingService.isFeatureEnabled('ai_speech_generator', 'deluxe') === true;
    }
  };
  
  return testComponent("Preisstufen", tests);
}

// Zeitplangenerator testen
function testTimelineGenerator() {
  console.log("\n=== Teste Zeitplangenerator ===");
  
  // Importiere den Timeline-Generator-Service
  const timelineService = require('./components/timeline-generator/timeline-generator-service.js').default;
  
  // Teste Zeitplangenerator
  const tests = {
    "Sollte einen Zeitplan basierend auf dem Hochzeitsdatum generieren": () => {
      const weddingDate = new Date("2025-06-15");
      const timeline = timelineService.generateTimeline(weddingDate);
      return timeline.length > 0 && timeline[0].date !== undefined;
    },
    
    "Sollte Meilensteine im Zeitplan enthalten": () => {
      const weddingDate = new Date("2025-06-15");
      const timeline = timelineService.generateTimeline(weddingDate);
      const hasMilestones = timeline.some(item => item.isMilestone === true);
      return hasMilestones;
    },
    
    "Sollte Aufgaben im Zeitplan enthalten": () => {
      const weddingDate = new Date("2025-06-15");
      const timeline = timelineService.generateTimeline(weddingDate);
      return timeline.filter(item => item.type === 'task').length > 0;
    }
  };
  
  return testComponent("Zeitplangenerator", tests);
}

// Gästemanagement testen
function testGuestManagement() {
  console.log("\n=== Teste Gästemanagement ===");
  
  // Importiere den Guest-Management-Service
  const guestService = require('./components/guest-management/guest-management-service.js').default;
  
  // Setze Gästelimit für Tests
  guestService.setGuestLimit(50);
  
  // Teste Gästemanagement
  const tests = {
    "Sollte einen Gast hinzufügen können": () => {
      const guest = guestService.addGuest({
        firstName: "Max",
        lastName: "Mustermann",
        email: "max@example.com",
        phone: "0123456789",
        rsvpStatus: "pending"
      });
      
      return guest.id !== undefined && 
             guest.firstName === "Max" && 
             guest.lastName === "Mustermann";
    },
    
    "Sollte einen Gast aktualisieren können": () => {
      // Zuerst einen Gast hinzufügen
      const guest = guestService.addGuest({
        firstName: "Anna",
        lastName: "Beispiel",
        email: "anna@example.com",
        rsvpStatus: "pending"
      });
      
      // Dann aktualisieren
      const updatedGuest = guestService.updateGuest(guest.id, {
        rsvpStatus: "confirmed"
      });
      
      return updatedGuest.rsvpStatus === "confirmed";
    },
    
    "Sollte RSVP-Status aktualisieren können": () => {
      // Zuerst einen Gast hinzufügen
      const guest = guestService.addGuest({
        firstName: "Peter",
        lastName: "Schmidt",
        email: "peter@example.com",
        rsvpStatus: "pending"
      });
      
      // RSVP-Status aktualisieren
      const updatedGuest = guestService.updateRSVP(guest.id, "declined");
      
      return updatedGuest.rsvpStatus === "declined";
    },
    
    "Sollte Gäste nach RSVP-Status filtern können": () => {
      // Alle Gäste abrufen
      const allGuests = guestService.getAllGuests();
      
      // Nach bestätigten Gästen filtern
      const confirmedGuests = guestService.filterGuestsByRSVP("confirmed");
      
      // Nach abgelehnten Gästen filtern
      const declinedGuests = guestService.filterGuestsByRSVP("declined");
      
      return confirmedGuests.length + declinedGuests.length <= allGuests.length;
    }
  };
  
  return testComponent("Gästemanagement", tests);
}

// Budgetplanung testen
function testBudgetPlanning() {
  console.log("\n=== Teste Budgetplanung ===");
  
  // Importiere den Budget-Planning-Service
  const budgetService = require('./components/budget-planning/budget-planning-service.js').default;
  
  // Teste Budgetplanung
  const tests = {
    "Sollte ein Budget-Item hinzufügen können": () => {
      const item = budgetService.addBudgetItem({
        category: "Catering",
        description: "Hochzeitsmenü",
        estimatedCost: 5000,
        actualCost: 4800,
        isPaid: false
      });
      
      return item.id !== undefined && 
             item.category === "Catering" && 
             item.estimatedCost === 5000;
    },
    
    "Sollte ein Budget-Item als bezahlt markieren können": () => {
      // Zuerst ein Budget-Item hinzufügen
      const item = budgetService.addBudgetItem({
        category: "Dekoration",
        description: "Blumen",
        estimatedCost: 1000,
        actualCost: 950,
        isPaid: false
      });
      
      // Als bezahlt markieren
      const updatedItem = budgetService.markItemAsPaid(item.id);
      
      return updatedItem.isPaid === true;
    },
    
    "Sollte Budgetzusammenfassung berechnen können": () => {
      // Budget-Zusammenfassung abrufen
      const summary = budgetService.getBudgetSummary();
      
      return summary.totalEstimated !== undefined && 
             summary.totalActual !== undefined && 
             summary.totalPaid !== undefined;
    },
    
    "Sollte Budget-Items nach Kategorie gruppieren können": () => {
      // Budget-Items nach Kategorie gruppieren
      const groupedItems = budgetService.getBudgetItemsByCategory();
      
      // Prüfen, ob Catering-Kategorie existiert
      return groupedItems.Catering !== undefined && 
             groupedItems.Catering.length > 0 &&
             groupedItems.Dekoration !== undefined &&
             groupedItems.Dekoration.length > 0;
    }
  };
  
  return testComponent("Budgetplanung", tests);
}

// Aufgabenmanagement testen
function testTaskManagement() {
  console.log("\n=== Teste Aufgabenmanagement ===");
  
  // Importiere den Task-Management-Service
  const taskService = require('./components/task-management/task-management-service.js').default;
  
  // Teste Aufgabenmanagement
  const tests = {
    "Sollte eine Aufgabe hinzufügen können": () => {
      const task = taskService.addTask({
        title: "Hochzeitslocation buchen",
        description: "Location für die Hochzeit auswählen und buchen",
        dueDate: new Date("2024-12-31"),
        priority: "high",
        status: "todo"
      });
      
      return task.id !== undefined && 
             task.title === "Hochzeitslocation buchen" && 
             task.priority === "high";
    },
    
    "Sollte eine Aufgabe als erledigt markieren können": () => {
      // Zuerst eine Aufgabe hinzufügen
      const task = taskService.addTask({
        title: "Einladungen verschicken",
        description: "Einladungen an alle Gäste verschicken",
        dueDate: new Date("2024-11-15"),
        priority: "medium",
        status: "todo"
      });
      
      // Als erledigt markieren
      const updatedTask = taskService.completeTask(task.id);
      
      return updatedTask.status === "done" && 
             updatedTask.completedAt !== undefined;
    },
    
    "Sollte Aufgaben nach Status filtern können": () => {
      // Aufgaben nach Status filtern
      const todoTasks = taskService.getTasksByStatus("todo");
      const doneTasks = taskService.getTasksByStatus("done");
      
      return Array.isArray(todoTasks) && Array.isArray(doneTasks);
    },
    
    "Sollte Aufgaben nach Priorität filtern können": () => {
      // Aufgaben nach Priorität filtern
      const highPriorityTasks = taskService.getTasksByPriority("high");
      
      return Array.isArray(highPriorityTasks) && 
             highPriorityTasks.every(task => task.priority === "high");
    }
  };
  
  return testComponent("Aufgabenmanagement", tests);
}

// Lieferantenmanagement testen
function testVendorManagement() {
  console.log("\n=== Teste Lieferantenmanagement ===");
  
  // Importiere den Vendor-Management-Service
  const vendorService = require('./components/vendor-management/vendor-management-service.js').default;
  
  // Setze Lieferantenlimit für Tests
  vendorService.setVendorLimit(20);
  
  // Teste Lieferantenmanagement
  const tests = {
    "Sollte einen Lieferanten hinzufügen können": () => {
      const vendor = vendorService.addVendor({
        name: "Traumlocation GmbH",
        category: "location",
        contactPerson: "Frau Schmidt",
        email: "info@traumlocation.de",
        phone: "0123456789",
        price: 5000
      });
      
      return vendor.id !== undefined && 
             vendor.name === "Traumlocation GmbH" && 
             vendor.category === "location";
    },
    
    "Sollte einen Lieferanten aktualisieren können": () => {
      // Zuerst einen Lieferanten hinzufügen
      const vendor = vendorService.addVendor({
        name: "Blumenzauber",
        category: "florist",
        contactPerson: "Herr Müller",
        email: "info@blumenzauber.de",
        phone: "0987654321",
        price: 1200
      });
      
      // Dann aktualisieren
      const updatedVendor = vendorService.updateVendor(vendor.id, {
        price: 1500
      });
      
      return updatedVendor.price === 1500;
    },
    
    "Sollte einen Lieferanten bewerten können": () => {
      // Zuerst einen Lieferanten hinzufügen
      const vendor = vendorService.addVendor({
        name: "Fotostudio Lichtblick",
        category: "photographer",
        contactPerson: "Frau Weber",
        email: "info@lichtblick.de",
        phone: "0123987456",
        price: 2500
      });
      
      // Dann bewerten
      const ratedVendor = vendorService.rateVendor(vendor.id, 4.5);
      
      return ratedVendor.rating === 4.5;
    },
    
    "Sollte Lieferanten nach Kategorie filtern können": () => {
      // Lieferanten nach Kategorie filtern
      const photographers = vendorService.filterVendors({ category: "photographer" });
      
      return Array.isArray(photographers) && 
             photographers.every(vendor => vendor.category === "photographer");
    }
  };
  
  return testComponent("Lieferantenmanagement", tests);
}

// Sitzplatzplanung testen
function testSeatingPlanner() {
  console.log("\n=== Teste Sitzplatzplanung ===");
  
  // Importiere den Seating-Planner-Service
  const seatingService = require('./components/seating-planner/seating-planner-service.js').default;
  
  // Setze Tischlimit für Tests
  seatingService.setTableLimit(10);
  
  // Teste Sitzplatzplanung
  const tests = {
    "Sollte einen Tisch hinzufügen können": () => {
      const table = seatingService.addTable({
        name: "Tisch 1",
        shape: "round",
        capacity: 8
      });
      
      return table.id !== undefined && 
             table.name === "Tisch 1" && 
             table.capacity === 8;
    },
    
    "Sollte Sitze für einen Tisch erstellen": () => {
      // Zuerst einen Tisch hinzufügen
      const table = seatingService.addTable({
        name: "Tisch 2",
        shape: "rectangular",
        capacity: 10
      });
      
      // Sitze für den Tisch abrufen
      const seats = seatingService.getSeatsForTable(table.id);
      
      return seats.length === 10 && 
             seats.every(seat => seat.tableId === table.id);
    },
    
    "Sollte einen Gast einem Sitz zuweisen können": () => {
      // Zuerst einen Tisch hinzufügen
      const table = seatingService.addTable({
        name: "Tisch 3",
        shape: "oval",
        capacity: 6
      });
      
      // Sitze für den Tisch abrufen
      const seats = seatingService.getSeatsForTable(table.id);
      
      // Einen Gast einem Sitz zuweisen
      const updatedSeat = seatingService.assignGuestToSeat(seats[0].id, "guest_123");
      
      return updatedSeat.guestId === "guest_123";
    },
    
    "Sollte Sitzplanstatistiken berechnen können": () => {
      // Statistiken abrufen
      const statistics = seatingService.getSeatingPlanStatistics();
      
      return statistics.totalTables !== undefined && 
             statistics.totalSeats !== undefined && 
             statistics.assignedSeats !== undefined;
    }
  };
  
  return testComponent("Sitzplatzplanung", tests);
}

// Fotogalerie testen
function testPhotoGallery() {
  console.log("\n=== Teste Fotogalerie ===");
  
  // Importiere den Photo-Gallery-Service
  const galleryService = require('./components/photo-gallery/photo-gallery-service.js').default;
  
  // Setze Fotolimit für Tests
  galleryService.setPhotoLimit(100);
  galleryService.setAlbumLimit(5);
  
  // Teste Fotogalerie
  const tests = {
    "Sollte ein Album hinzufügen können": () => {
      const album = galleryService.addAlbum({
        name: "Hochzeitstag",
        description: "Fotos vom Hochzeitstag",
        isPublic: true
      });
      
      return album.id !== undefined && 
             album.name === "Hochzeitstag" && 
             album.isPublic === true;
    },
    
    "Sollte ein Foto hinzufügen können": () => {
      // Zuerst ein Album hinzufügen
      const album = galleryService.addAlbum({
        name: "Standesamt",
        description: "Fotos von der standesamtlichen Trauung",
        isPublic: true
      });
      
      // Dann ein Foto hinzufügen
      const photo = galleryService.addPhoto({
        albumId: album.id,
        title: "Ringtausch",
        description: "Der Moment des Ringtauschs",
        url: "https://example.com/photos/ring.jpg",
        tags: ["Ringe", "Standesamt"]
      });
      
      return photo.id !== undefined && 
             photo.albumId === album.id && 
             photo.title === "Ringtausch";
    },
    
    "Sollte ein Foto liken können": () => {
      // Zuerst ein Album hinzufügen
      const album = galleryService.addAlbum({
        name: "Junggesellenabschied",
        description: "Fotos vom Junggesellenabschied",
        isPublic: false
      });
      
      // Dann ein Foto hinzufügen
      const photo = galleryService.addPhoto({
        albumId: album.id,
        title: "Party",
        description: "Partyfotos",
        url: "https://example.com/photos/party.jpg"
      });
      
      // Foto liken
      const likedPhoto = galleryService.likePhoto(photo.id);
      
      return likedPhoto.likes === 1;
    },
    
    "Sollte einen Share-Link erstellen können": () => {
      // Zuerst ein Album hinzufügen
      const album = galleryService.addAlbum({
        name: "Hochzeitsvorbereitungen",
        description: "Fotos von den Hochzeitsvorbereitungen",
        isPublic: true
      });
      
      // Share-Link erstellen
      const shareLink = galleryService.createShareLink(album.id);
      
      return shareLink.id !== undefined && 
             shareLink.albumId === album.id && 
             shareLink.token !== undefined;
    }
  };
  
  return testComponent("Fotogalerie", tests);
}

// Trauzeugenbereich testen
function testBestManSection() {
  console.log("\n=== Teste Trauzeugenbereich ===");
  
  // Importiere den Best-Man-Section-Service
  const bestManService = require('./components/best-man-section/best-man-section-service.js').default;
  
  // Setze Benutzerlimit für Tests
  bestManService.setUserLimit(10);
  
  // Teste Trauzeugenbereich
  const tests = {
    "Sollte einen Trauzeugen hinzufügen können": () => {
      const user = bestManService.addUser({
        name: "Thomas Schmidt",
        email: "thomas@example.com",
        role: "bestMan"
      });
      
      return user.id !== undefined && 
             user.name === "Thomas Schmidt" && 
             user.role === "bestMan" &&
             user.accessCode !== undefined;
    },
    
    "Sollte einen Trauzeugen authentifizieren können": () => {
      // Zuerst einen Trauzeugen hinzufügen
      const user = bestManService.addUser({
        name: "Julia Meyer",
        email: "julia@example.com",
        role: "maidOfHonor"
      });
      
      // Dann authentifizieren
      const authenticatedUser = bestManService.authenticateUser(user.email, user.accessCode);
      
      return authenticatedUser !== null && 
             authenticatedUser.id === user.id;
    },
    
    "Sollte eine Aufgabe für einen Trauzeugen hinzufügen können": () => {
      // Zuerst einen Trauzeugen hinzufügen
      const user = bestManService.addUser({
        name: "Michael Weber",
        email: "michael@example.com",
        role: "groomsman"
      });
      
      // Dann eine Aufgabe hinzufügen
      const task = bestManService.addTask({
        title: "Junggesellenabschied organisieren",
        description: "Planung und Organisation des Junggesellenabschieds",
        assignedTo: user.id,
        priority: "high",
        isPrivate: true
      });
      
      return task.id !== undefined && 
             task.title === "Junggesellenabschied organisieren" && 
             task.assignedTo === user.id;
    },
    
    "Sollte eine Notiz im Trauzeugenbereich hinzufügen können": () => {
      // Zuerst einen Trauzeugen hinzufügen
      const user = bestManService.addUser({
        name: "Sarah Fischer",
        email: "sarah@example.com",
        role: "bridesmaid"
      });
      
      // Dann eine Notiz hinzufügen
      const note = bestManService.addNote({
        title: "Ideen für Überraschung",
        content: "Hier sind einige Ideen für eine Überraschung für das Brautpaar...",
        author: user.id,
        isPrivate: true
      });
      
      return note.id !== undefined && 
             note.title === "Ideen für Überraschung" && 
             note.author === user.id;
    }
  };
  
  return testComponent("Trauzeugenbereich", tests);
}

// Haupttestfunktion
function runAllTests() {
  console.log("=== LemonVows WeWeb-Integration Tests ===");
  console.log("Starte Tests...");
  
  const results = [];
  
  // Alle Komponenten testen
  results.push(testPricingTiers());
  results.push(testTimelineGenerator());
  results.push(testGuestManagement());
  results.push(testBudgetPlanning());
  results.push(testTaskManagement());
  results.push(testVendorManagement());
  results.push(testSeatingPlanner());
  results.push(testPhotoGallery());
  results.push(testBestManSection());
  
  // Gesamtergebnis ausgeben
  const totalPassed = results.reduce((sum, result) => sum + result.passed, 0);
  const totalFailed = results.reduce((sum, result) => sum + result.failed, 0);
  const totalTests = totalPassed + totalFailed;
  
  console.log("\n=== Gesamtergebnis ===");
  console.log(`Insgesamt: ${totalTests} Tests`);
  console.log(`Bestanden: ${totalPassed} Tests (${Math.round(totalPassed / totalTests * 100)}%)`);
  console.log(`Fehlgeschlagen: ${totalFailed} Tests (${Math.round(totalFailed / totalTests * 100)}%)`);
  
  return {
    totalTests,
    totalPassed,
    totalFailed,
    results
  };
}

// Tests ausführen
runAllTests();
