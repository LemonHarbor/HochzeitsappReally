// WeWeb Deployment Konfiguration für LemonVows
// Diese Datei enthält die Konfiguration für die WeWeb-Integration

module.exports = {
  // Anwendungsinformationen
  app: {
    name: "LemonVows by LemonHarbor",
    version: "1.0.0",
    description: "Hochzeitsplanungs-App mit umfangreichen Funktionen für Paare",
    author: "LemonHarbor"
  },
  
  // Preisstufen
  pricingTiers: [
    {
      id: "free",
      name: "Free Version",
      price: 0,
      billingCycle: "monthly",
      guestLimit: 20,
      features: [
        "Grundfunktionen für bis zu 20 Gäste",
        "Automatischer Zeitplangenerator",
        "Einfache Gästeliste",
        "Grundlegende Budgetplanung",
        "Einfache Aufgabenliste"
      ]
    },
    {
      id: "basic",
      name: "Basis",
      price: 29.99,
      billingCycle: "monthly",
      guestLimit: 50,
      features: [
        "Erweiterte Funktionen für bis zu 50 Gäste",
        "Detaillierte Gästeverwaltung mit RSVP-Tracking",
        "Erweiterte Budgetplanung mit Berichten",
        "Aufgabenlisten mit Erinnerungen",
        "Lieferantenmanagement",
        "Einfache Sitzplatzplanung",
        "Basis-Fotogalerie"
      ]
    },
    {
      id: "premium",
      name: "Premium",
      price: 89.99,
      billingCycle: "monthly",
      guestLimit: null, // Unbegrenzt
      features: [
        "Alle Funktionen mit unbegrenzter Gästeanzahl",
        "Vollständige Gästeverwaltung mit detailliertem RSVP-Tracking",
        "Umfassende Budgetplanung mit detaillierten Berichten",
        "Erweiterte Aufgabenlisten mit Erinnerungen und Zuweisungen",
        "Umfassendes Lieferantenmanagement mit Bewertungen",
        "Interaktive Sitzplatzplanung mit Drag-and-Drop",
        "Erweiterte Fotogalerie mit Sharing-Optionen",
        "Trauzeugenbereich mit Rollenvergabe"
      ]
    },
    {
      id: "deluxe",
      name: "Deluxe",
      price: 199.99,
      billingCycle: "monthly",
      guestLimit: null, // Unbegrenzt
      features: [
        "Premium-Funktionen plus persönlicher Assistent",
        "KI-Redengenerator",
        "NFT-Gästebuch",
        "Unbegrenzte Gästeanzahl",
        "Prioritäts-Support",
        "Alle Premium-Funktionen inklusive"
      ]
    }
  ],
  
  // Komponenten
  components: [
    {
      id: "pricing-tiers",
      name: "Preisstufen",
      description: "Zeigt die verfügbaren Preisstufen an",
      files: [
        "pricing-service.js",
        "pricing-tiers-ui.js",
        "feature-access-control.js"
      ]
    },
    {
      id: "timeline-generator",
      name: "Zeitplangenerator",
      description: "Generiert einen Zeitplan basierend auf dem Hochzeitsdatum",
      files: [
        "timeline-generator-service.js",
        "timeline-generator-ui.js",
        "timeline-templates.json"
      ]
    },
    {
      id: "guest-management",
      name: "Gästemanagement",
      description: "Verwaltet Gäste und RSVP-Status",
      files: [
        "guest-management-service.js",
        "guest-management-ui.js",
        "guest-management-model.json"
      ]
    },
    {
      id: "budget-planning",
      name: "Budgetplanung",
      description: "Verwaltet das Hochzeitsbudget",
      files: [
        "budget-planning-service.js",
        "budget-planning-ui.js",
        "budget-planning-model.json"
      ]
    },
    {
      id: "task-management",
      name: "Aufgabenmanagement",
      description: "Verwaltet Hochzeitsaufgaben",
      files: [
        "task-management-service.js",
        "task-management-ui.js",
        "task-management-model.json"
      ]
    },
    {
      id: "vendor-management",
      name: "Lieferantenmanagement",
      description: "Verwaltet Hochzeitslieferanten",
      files: [
        "vendor-management-service.js",
        "vendor-management-ui.js",
        "vendor-management-model.json"
      ]
    },
    {
      id: "seating-planner",
      name: "Sitzplatzplanung",
      description: "Plant die Sitzordnung für die Hochzeit",
      files: [
        "seating-planner-service.js",
        "seating-planner-ui.js",
        "seating-planner-model.json"
      ]
    },
    {
      id: "photo-gallery",
      name: "Fotogalerie",
      description: "Verwaltet Hochzeitsfotos",
      files: [
        "photo-gallery-service.js",
        "photo-gallery-ui.js",
        "photo-gallery-model.json"
      ]
    },
    {
      id: "best-man-section",
      name: "Trauzeugenbereich",
      description: "Geschützter Bereich für Trauzeugen",
      files: [
        "best-man-section-service.js",
        "best-man-section-ui.js",
        "best-man-section-model.json"
      ]
    }
  ],
  
  // Seiten
  pages: [
    {
      id: "home",
      name: "Startseite",
      path: "/",
      components: ["pricing-tiers"]
    },
    {
      id: "dashboard",
      name: "Dashboard",
      path: "/dashboard",
      components: ["timeline-generator", "task-management"]
    },
    {
      id: "guests",
      name: "Gäste",
      path: "/guests",
      components: ["guest-management"]
    },
    {
      id: "budget",
      name: "Budget",
      path: "/budget",
      components: ["budget-planning"]
    },
    {
      id: "vendors",
      name: "Lieferanten",
      path: "/vendors",
      components: ["vendor-management"]
    },
    {
      id: "seating",
      name: "Sitzplan",
      path: "/seating",
      components: ["seating-planner"]
    },
    {
      id: "photos",
      name: "Fotos",
      path: "/photos",
      components: ["photo-gallery"]
    },
    {
      id: "best-man",
      name: "Trauzeugen",
      path: "/best-man",
      components: ["best-man-section"]
    }
  ],
  
  // Design
  theme: {
    colors: {
      primary: "#F5A9B8", // Rosé
      secondary: "#FFFFFF", // Weiß
      accent: "#D4AF37", // Gold
      background: "#FFFFFF",
      text: "#333333",
      success: "#4CAF50",
      warning: "#FFC107",
      error: "#F44336",
      info: "#2196F3"
    },
    fonts: {
      heading: "Playfair Display",
      body: "Montserrat"
    },
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
  },
  
  // Responsive Design
  responsive: {
    breakpoints: {
      xs: "0px",
      sm: "600px",
      md: "960px",
      lg: "1280px",
      xl: "1920px"
    }
  },
  
  // Berechtigungen
  permissions: {
    free: {
      guestLimit: 20,
      albumLimit: 3,
      photoLimit: 50,
      tableLimit: 5,
      vendorLimit: 5,
      userLimit: 2
    },
    basic: {
      guestLimit: 50,
      albumLimit: 5,
      photoLimit: 200,
      tableLimit: 10,
      vendorLimit: 10,
      userLimit: 5
    },
    premium: {
      guestLimit: 200,
      albumLimit: 10,
      photoLimit: 500,
      tableLimit: 30,
      vendorLimit: 20,
      userLimit: 10
    },
    deluxe: {
      guestLimit: null, // Unbegrenzt
      albumLimit: null, // Unbegrenzt
      photoLimit: null, // Unbegrenzt
      tableLimit: null, // Unbegrenzt
      vendorLimit: null, // Unbegrenzt
      userLimit: null // Unbegrenzt
    }
  }
};
