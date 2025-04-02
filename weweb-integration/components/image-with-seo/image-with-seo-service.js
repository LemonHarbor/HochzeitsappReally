// ImageWithSEO Service für WeWeb
// Diese Klasse implementiert die Geschäftslogik für die SEO-optimierte Bildkomponente

import imageWithSEOModel from './image-with-seo-model.json';

class ImageWithSEOService {
  constructor() {
    this.dataModel = imageWithSEOModel.dataModel;
    this.settings = {
      theme: 'light',
      language: 'de'
    };
    this.translations = imageWithSEOModel.dataModel.translations;
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
   * Validiert die Bildeigenschaften
   * @param {Object} imageProps - Die zu validierenden Bildeigenschaften
   * @returns {Object} - Validierungsergebnis mit Fehlern
   */
  validateImageProps(imageProps) {
    const errors = [];
    
    // Prüfen, ob eine Bildquelle angegeben wurde
    if (!imageProps.src) {
      errors.push(this.translate('missingSrc'));
    }
    
    // Prüfen, ob ein alternativer Text angegeben wurde (wichtig für SEO)
    if (!imageProps.alt) {
      errors.push(this.translate('missingAltText'));
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generiert optimierte Bildattribute für SEO
   * @param {Object} imageProps - Die Bildeigenschaften
   * @returns {Object} - Optimierte Bildattribute
   */
  generateOptimizedImageAttributes(imageProps) {
    const { src, alt, width, height, loading = 'lazy', className = '' } = imageProps;
    
    // Basis-Attribute
    const attributes = {
      src,
      alt,
      loading,
      decoding: 'async',
      class: className
    };
    
    // Größenattribute hinzufügen, wenn vorhanden
    if (width) {
      attributes.width = width;
    }
    
    if (height) {
      attributes.height = height;
    }
    
    return attributes;
  }
}

export default new ImageWithSEOService();
