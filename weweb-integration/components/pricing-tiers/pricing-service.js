// Pricing Tiers Implementation for LemonVows
// This file contains the logic for implementing the pricing tiers functionality

class PricingTiersService {
  constructor() {
    this.tiers = [
      {
        id: "free",
        name: "Free Version",
        price: 0,
        currency: "EUR",
        period: "month",
        features: [
          "Grundfunktionen für bis zu 20 Gäste",
          "Automatischer Zeitplangenerator",
          "Einfache Budgetverfolgung",
          "Grundlegende Aufgabenlisten"
        ],
        limits: {
          guests: 20,
          tasks: 50,
          photos: 100
        }
      },
      {
        id: "basis",
        name: "Basis",
        price: 29.99,
        currency: "EUR",
        period: "month",
        features: [
          "Erweiterte Funktionen für bis zu 50 Gäste",
          "Detaillierte Budgetverfolgung",
          "Erweiterte Aufgabenlisten",
          "Einfache Sitzplatzplanung",
          "14 Tage Testphase für Premium-Funktionen"
        ],
        limits: {
          guests: 50,
          tasks: 200,
          photos: 500
        }
      },
      {
        id: "premium",
        name: "Premium",
        price: 89.99,
        currency: "EUR",
        period: "month",
        features: [
          "Alle Funktionen mit unbegrenzter Gästeanzahl",
          "Detaillierte Budgetverfolgung mit Berichten",
          "Erweiterte Aufgabenlisten mit Erinnerungen",
          "Lieferantenmanagement und -bewertungen",
          "Interaktive Sitzplatzplanung",
          "Fotogalerie für Hochzeitsfotos",
          "Prioritäts-Support"
        ],
        limits: {
          guests: -1, // Unbegrenzt
          tasks: -1, // Unbegrenzt
          photos: 2000
        }
      },
      {
        id: "deluxe",
        name: "Deluxe",
        price: 199.99,
        currency: "EUR",
        period: "month",
        features: [
          "Alle Premium-Funktionen",
          "Persönlicher Hochzeitsplaner-Assistent",
          "Exklusive Design-Vorlagen",
          "Hochzeitswebsite mit eigenem Domain",
          "Unbegrenzte Fotospeicherung",
          "KI-gestützter Hochzeitsredengenerator",
          "NFT-Gästebuch für digitale Erinnerungen",
          "Prioritäts-Support rund um die Uhr"
        ],
        limits: {
          guests: -1, // Unbegrenzt
          tasks: -1, // Unbegrenzt
          photos: -1 // Unbegrenzt
        }
      }
    ];

    this.featureAccess = {
      "guest-management": ["free", "basis", "premium", "deluxe"],
      "budget-planning": ["free", "basis", "premium", "deluxe"],
      "task-management": ["free", "basis", "premium", "deluxe"],
      "vendor-management": ["basis", "premium", "deluxe"],
      "seating-planner": ["basis", "premium", "deluxe"],
      "photo-gallery": ["premium", "deluxe"],
      "timeline-generator": ["free", "basis", "premium", "deluxe"],
      "best-man-section": ["premium", "deluxe"],
      "detailed-reports": ["premium", "deluxe"],
      "reminders": ["premium", "deluxe"],
      "ai-speech-generator": ["deluxe"],
      "nft-guestbook": ["deluxe"],
      "personal-assistant": ["deluxe"]
    };
  }

  // Ruft alle verfügbaren Preisstufen ab
  getPricingTiers() {
    return this.tiers;
  }

  // Ruft eine bestimmte Preisstufe anhand der ID ab
  getTierById(tierId) {
    return this.tiers.find(tier => tier.id === tierId);
  }

  // Ruft die aktuelle Preisstufe des Benutzers ab
  getCurrentTier(userId) {
    // In einer echten Implementierung würde hier die Preisstufe aus der Datenbank abgerufen werden
    // Für diese Demo verwenden wir einen Standardwert
    return localStorage.getItem('currentTier') || 'free';
  }

  // Prüft, ob der Benutzer Zugriff auf eine bestimmte Funktion hat
  checkFeatureAccess(featureId, tierId) {
    const userTier = tierId || this.getCurrentTier();
    return this.featureAccess[featureId]?.includes(userTier) || false;
  }

  // Prüft, ob der Benutzer ein bestimmtes Limit erreicht hat
  checkLimit(limitId, currentValue, tierId) {
    const userTier = tierId || this.getCurrentTier();
    const tier = this.getTierById(userTier);
    
    if (!tier) return false;
    
    const limit = tier.limits[limitId];
    
    // -1 bedeutet unbegrenzt
    if (limit === -1) return false;
    
    return currentValue >= limit;
  }

  // Führt ein Upgrade auf eine höhere Preisstufe durch
  upgradeTier(tierId) {
    // In einer echten Implementierung würde hier das Upgrade in der Datenbank gespeichert werden
    // Für diese Demo speichern wir es im localStorage
    localStorage.setItem('currentTier', tierId);
    
    // Event auslösen
    this.triggerEvent('onTierChanged', { newTier: tierId });
    
    return true;
  }

  // Führt ein Downgrade auf eine niedrigere Preisstufe durch
  downgradeTier(tierId) {
    // In einer echten Implementierung würde hier das Downgrade in der Datenbank gespeichert werden
    // Für diese Demo speichern wir es im localStorage
    localStorage.setItem('currentTier', tierId);
    
    // Event auslösen
    this.triggerEvent('onTierChanged', { newTier: tierId });
    
    return true;
  }

  // Generiert einen Vergleich aller Preisstufen
  getTierComparison() {
    const allFeatures = new Set();
    
    // Alle Funktionen aus allen Preisstufen sammeln
    this.tiers.forEach(tier => {
      tier.features.forEach(feature => {
        allFeatures.add(feature);
      });
    });
    
    // Vergleichstabelle erstellen
    const comparison = {
      features: Array.from(allFeatures),
      tiers: this.tiers.map(tier => {
        return {
          id: tier.id,
          name: tier.name,
          price: tier.price,
          currency: tier.currency,
          period: tier.period,
          hasFeature: Array.from(allFeatures).map(feature => 
            tier.features.includes(feature)
          )
        };
      })
    };
    
    return comparison;
  }

  // Hilfsfunktion zum Auslösen von Events
  triggerEvent(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
  }
}

// Exportieren des PricingTiersService
export default new PricingTiersService();
