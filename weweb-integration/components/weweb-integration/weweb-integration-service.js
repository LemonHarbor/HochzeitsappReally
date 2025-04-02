// WeWeb Integration Service für WeWeb
// Diese Klasse implementiert die Geschäftslogik für die WeWeb-Integrationskomponente

import wewebIntegrationModel from './weweb-integration-model.json';

class WeWebIntegrationService {
  constructor() {
    this.dataModel = wewebIntegrationModel.dataModel;
    this.connection = {
      status: 'Not connected',
      lastSync: 'Never',
      apiKey: '',
      projectId: ''
    };
    this.settings = {
      theme: 'light',
      language: 'de',
      developerMode: false
    };
    this.translations = wewebIntegrationModel.dataModel.translations;
    this.eventListeners = {};
  }

  /**
   * Setzt die Einstellungen der Komponente
   * @param {Object} settings - Die neuen Einstellungen
   */
  setSettings(settings) {
    this.settings = {
      ...this.settings,
      ...settings
    };
  }

  /**
   * Ruft die aktuelle Sprache ab
   * @returns {string} - Der Sprachcode (de oder en)
   */
  getLanguage() {
    return this.settings.language;
  }

  /**
   * Setzt die Sprache der Komponente
   * @param {string} language - Der Sprachcode (de oder en)
   */
  setLanguage(language) {
    if (['de', 'en'].includes(language)) {
      this.settings.language = language;
    } else {
      console.warn(`Unsupported language: ${language}. Using default.`);
    }
  }

  /**
   * Ruft eine Übersetzung ab
   * @param {string} key - Der Übersetzungsschlüssel
   * @returns {string} - Die übersetzte Zeichenkette
   */
  translate(key) {
    const language = this.settings.language;
    return this.translations[language][key] || key;
  }

  /**
   * Ruft das aktuelle Theme ab
   * @returns {string} - Das Theme (light oder dark)
   */
  getTheme() {
    return this.settings.theme;
  }

  /**
   * Setzt das Theme der Komponente
   * @param {string} theme - Das Theme (light oder dark)
   */
  setTheme(theme) {
    if (['light', 'dark'].includes(theme)) {
      this.settings.theme = theme;
    } else {
      console.warn(`Unsupported theme: ${theme}. Using default.`);
    }
  }

  /**
   * Setzt den Entwicklermodus
   * @param {boolean} mode - Ob der Entwicklermodus aktiviert ist
   */
  setDeveloperMode(mode) {
    this.settings.developerMode = Boolean(mode);
  }

  /**
   * Prüft, ob der Entwicklermodus aktiviert ist
   * @returns {boolean} - Ob der Entwicklermodus aktiviert ist
   */
  isDeveloperMode() {
    return this.settings.developerMode;
  }

  /**
   * Stellt eine Verbindung zu WeWeb her
   * @returns {Promise<boolean>} - Ob die Verbindung erfolgreich hergestellt wurde
   */
  async connectToWeWeb() {
    try {
      // In einer echten Implementierung würde hier die Verbindung zu WeWeb hergestellt werden
      // Für diese Demo simulieren wir eine erfolgreiche Verbindung
      this.connection.status = 'Connected';
      this.connection.lastSync = new Date().toLocaleString();
      
      // Event auslösen
      this.triggerEvent('onConnect', { status: this.connection.status });
      
      return true;
    } catch (error) {
      console.error('Error connecting to WeWeb:', error);
      this.connection.status = 'Error';
      return false;
    }
  }

  /**
   * Synchronisiert mit WeWeb
   * @returns {Promise<boolean>} - Ob die Synchronisierung erfolgreich war
   */
  async syncWithWeWeb() {
    try {
      // In einer echten Implementierung würde hier die Synchronisierung mit WeWeb durchgeführt werden
      // Für diese Demo simulieren wir eine erfolgreiche Synchronisierung
      this.connection.lastSync = new Date().toLocaleString();
      
      // Event auslösen
      this.triggerEvent('onSync', { lastSync: this.connection.lastSync });
      
      return true;
    } catch (error) {
      console.error('Error syncing with WeWeb:', error);
      return false;
    }
  }

  /**
   * Öffnet die WeWeb-Dokumentation
   */
  viewDocumentation() {
    window.open('https://docs.weweb.io/getting-started', '_blank');
  }

  /**
   * Registriert einen Event-Listener
   * @param {string} event - Der Event-Name
   * @param {Function} callback - Die Callback-Funktion
   */
  addEventListener(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  /**
   * Entfernt einen Event-Listener
   * @param {string} event - Der Event-Name
   * @param {Function} callback - Die Callback-Funktion
   */
  removeEventListener(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(
        cb => cb !== callback
      );
    }
  }

  /**
   * Löst ein Event aus
   * @param {string} event - Der Event-Name
   * @param {any} data - Die Event-Daten
   */
  triggerEvent(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => {
        callback(data);
      });
    }
  }

  /**
   * Ruft den Verbindungsstatus ab
   * @returns {Object} - Der Verbindungsstatus
   */
  getConnectionStatus() {
    return { ...this.connection };
  }
}

export default new WeWebIntegrationService();
