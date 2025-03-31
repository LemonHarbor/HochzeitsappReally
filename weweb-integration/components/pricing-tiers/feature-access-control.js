// Feature Access Control für LemonVows
// Diese Komponente steuert den Zugriff auf Funktionen basierend auf der Preisstufe des Benutzers

class FeatureAccessControl {
  constructor(pricingService) {
    this.pricingService = pricingService;
    this.currentTier = null;
    this.featureAccessCache = {};
    
    // Event-Listener für Änderungen der Preisstufe
    document.addEventListener('onTierChanged', this.handleTierChange.bind(this));
    
    // Initialisierung
    this.initialize();
  }
  
  // Initialisierung der Komponente
  async initialize() {
    // Aktuelle Preisstufe abrufen
    this.currentTier = await this.pricingService.getCurrentTier();
    
    // Feature-Zugriff für die aktuelle Preisstufe cachen
    this.updateFeatureAccessCache();
  }
  
  // Aktualisiert den Cache für den Feature-Zugriff
  updateFeatureAccessCache() {
    this.featureAccessCache = {};
    
    // Für jede Feature-ID den Zugriff prüfen und cachen
    Object.keys(this.pricingService.featureAccess).forEach(featureId => {
      this.featureAccessCache[featureId] = this.pricingService.checkFeatureAccess(featureId, this.currentTier);
    });
  }
  
  // Handler für Änderungen der Preisstufe
  handleTierChange(event) {
    this.currentTier = event.detail.newTier;
    this.updateFeatureAccessCache();
    
    // UI-Elemente aktualisieren
    this.updateUIElements();
  }
  
  // Prüft, ob der Benutzer Zugriff auf eine bestimmte Funktion hat
  hasAccess(featureId) {
    // Aus dem Cache abrufen, wenn verfügbar
    if (this.featureAccessCache.hasOwnProperty(featureId)) {
      return this.featureAccessCache[featureId];
    }
    
    // Ansonsten direkt prüfen und cachen
    const hasAccess = this.pricingService.checkFeatureAccess(featureId, this.currentTier);
    this.featureAccessCache[featureId] = hasAccess;
    
    return hasAccess;
  }
  
  // Prüft, ob der Benutzer ein bestimmtes Limit erreicht hat
  checkLimit(limitId, currentValue) {
    return this.pricingService.checkLimit(limitId, currentValue, this.currentTier);
  }
  
  // Aktualisiert UI-Elemente basierend auf der Preisstufe
  updateUIElements() {
    // Alle Elemente mit dem Attribut "data-feature" durchgehen
    document.querySelectorAll('[data-feature]').forEach(element => {
      const featureId = element.getAttribute('data-feature');
      
      if (this.hasAccess(featureId)) {
        // Zugriff erlaubt: Element anzeigen und "disabled" entfernen
        element.classList.remove('feature-disabled');
        element.removeAttribute('disabled');
      } else {
        // Zugriff verweigert: Element ausblenden oder deaktivieren
        element.classList.add('feature-disabled');
        element.setAttribute('disabled', 'disabled');
      }
    });
    
    // Upgrade-Hinweise anzeigen/ausblenden
    document.querySelectorAll('[data-upgrade-for]').forEach(element => {
      const featureId = element.getAttribute('data-upgrade-for');
      
      if (this.hasAccess(featureId)) {
        // Zugriff erlaubt: Upgrade-Hinweis ausblenden
        element.style.display = 'none';
      } else {
        // Zugriff verweigert: Upgrade-Hinweis anzeigen
        element.style.display = 'block';
      }
    });
  }
  
  // Zeigt einen Upgrade-Dialog an, wenn der Benutzer auf eine Premium-Funktion zugreifen möchte
  showUpgradeDialog(featureId) {
    if (!this.hasAccess(featureId)) {
      // Preisstufen abrufen, die Zugriff auf diese Funktion haben
      const requiredTiers = this.pricingService.featureAccess[featureId] || [];
      
      // Die niedrigste erforderliche Preisstufe finden
      const lowestRequiredTier = requiredTiers[0];
      
      // Dialog anzeigen
      const tierInfo = this.pricingService.getTierById(lowestRequiredTier);
      
      // In einer echten Implementierung würde hier ein Modal-Dialog angezeigt werden
      // Für diese Demo geben wir eine Konsolenwarnung aus
      console.log(`Diese Funktion ist nur in der Preisstufe "${tierInfo.name}" (${tierInfo.price} ${tierInfo.currency}/${tierInfo.period}) verfügbar.`);
      
      // Event auslösen
      const event = new CustomEvent('onUpgradeRequested', { 
        detail: { 
          featureId, 
          requiredTier: lowestRequiredTier 
        } 
      });
      document.dispatchEvent(event);
      
      return false;
    }
    
    return true;
  }
  
  // Zeigt eine Limit-Warnung an, wenn der Benutzer ein Limit erreicht hat
  showLimitWarning(limitId, currentValue) {
    if (this.checkLimit(limitId, currentValue)) {
      // Tier-Info abrufen
      const tierInfo = this.pricingService.getTierById(this.currentTier);
      const limit = tierInfo.limits[limitId];
      
      // In einer echten Implementierung würde hier ein Modal-Dialog angezeigt werden
      // Für diese Demo geben wir eine Konsolenwarnung aus
      console.log(`Sie haben das Limit von ${limit} für ${limitId} in Ihrer aktuellen Preisstufe "${tierInfo.name}" erreicht.`);
      
      // Event auslösen
      const event = new CustomEvent('onLimitReached', { 
        detail: { 
          limitId, 
          currentValue, 
          limit 
        } 
      });
      document.dispatchEvent(event);
      
      return true;
    }
    
    return false;
  }
}

// Exportieren der FeatureAccessControl-Klasse
export default FeatureAccessControl;
