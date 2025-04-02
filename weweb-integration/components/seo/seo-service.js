// SEO Service für WeWeb
// Diese Klasse implementiert die Geschäftslogik für die SEO-Optimierungskomponente

import seoModel from './seo-model.json';

class SEOService {
  constructor() {
    this.dataModel = seoModel.dataModel;
    this.settings = {
      theme: 'light',
      language: 'de'
    };
    this.translations = seoModel.dataModel.translations;
    this.metaTags = [];
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
   * Validiert die SEO-Eigenschaften
   * @param {Object} seoProps - Die zu validierenden SEO-Eigenschaften
   * @returns {Object} - Validierungsergebnis mit Fehlern
   */
  validateSEOProps(seoProps) {
    const errors = [];
    
    // Prüfen, ob ein Titel angegeben wurde
    if (!seoProps.title) {
      errors.push(this.translate('missingTitle'));
    }
    
    // Prüfen, ob eine Beschreibung angegeben wurde
    if (!seoProps.description) {
      errors.push(this.translate('missingDescription'));
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generiert Meta-Tags für SEO
   * @param {Object} seoProps - Die SEO-Eigenschaften
   * @returns {Array} - Array von Meta-Tag-Objekten
   */
  generateMetaTags(seoProps) {
    const {
      title,
      description,
      keywords,
      canonicalUrl,
      ogImage,
      ogType,
      twitterCard
    } = seoProps;
    
    const metaTags = [
      // Grundlegende Meta-Tags
      { tag: 'title', content: title },
      { tag: 'meta', attrs: { name: 'description', content: description } },
      { tag: 'meta', attrs: { name: 'keywords', content: keywords } },
      { tag: 'meta', attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0' } },
      { tag: 'meta', attrs: { name: 'theme-color', content: '#e8a598' } },
      { tag: 'link', attrs: { rel: 'canonical', href: canonicalUrl } },
      
      // Open Graph Meta-Tags für soziale Medien
      { tag: 'meta', attrs: { property: 'og:title', content: title } },
      { tag: 'meta', attrs: { property: 'og:description', content: description } },
      { tag: 'meta', attrs: { property: 'og:image', content: ogImage } },
      { tag: 'meta', attrs: { property: 'og:url', content: canonicalUrl } },
      { tag: 'meta', attrs: { property: 'og:type', content: ogType } },
      { tag: 'meta', attrs: { property: 'og:site_name', content: 'HochzeitsappReally' } },
      { tag: 'meta', attrs: { property: 'og:locale', content: 'de_DE' } },
      
      // Twitter Card Meta-Tags
      { tag: 'meta', attrs: { name: 'twitter:card', content: twitterCard } },
      { tag: 'meta', attrs: { name: 'twitter:title', content: title } },
      { tag: 'meta', attrs: { name: 'twitter:description', content: description } },
      { tag: 'meta', attrs: { name: 'twitter:image', content: ogImage } },
      
      // Weitere SEO-relevante Meta-Tags
      { tag: 'meta', attrs: { name: 'robots', content: 'index, follow' } },
      { tag: 'meta', attrs: { name: 'author', content: 'HochzeitsappReally Team' } },
      { tag: 'meta', attrs: { name: 'language', content: 'German' } }
    ];
    
    // Strukturierte Daten für Google
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'HochzeitsappReally',
      'applicationCategory': 'LifestyleApplication',
      'operatingSystem': 'Web',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'EUR'
      },
      'description': description
    };
    
    metaTags.push({
      tag: 'script',
      attrs: { type: 'application/ld+json' },
      content: JSON.stringify(structuredData)
    });
    
    return metaTags;
  }

  /**
   * Aktualisiert die Meta-Tags im Dokument
   * @param {Object} seoProps - Die SEO-Eigenschaften
   */
  updateMetaTags(seoProps) {
    // Meta-Tags generieren
    this.metaTags = this.generateMetaTags(seoProps);
    
    // In einer echten Implementierung würden hier die Meta-Tags im Dokument aktualisiert werden
    // Da wir in WeWeb sind, können wir nur die Meta-Tags zurückgeben und die Komponente muss sie verarbeiten
    return this.metaTags;
  }

  /**
   * Generiert eine Google-Suchergebnis-Vorschau
   * @param {Object} seoProps - Die SEO-Eigenschaften
   * @returns {Object} - Vorschaudaten für Google
   */
  generateGooglePreview(seoProps) {
    const { title, description, canonicalUrl } = seoProps;
    
    return {
      title: title,
      url: canonicalUrl,
      description: description
    };
  }

  /**
   * Generiert eine Facebook-Vorschau
   * @param {Object} seoProps - Die SEO-Eigenschaften
   * @returns {Object} - Vorschaudaten für Facebook
   */
  generateFacebookPreview(seoProps) {
    const { title, description, ogImage, canonicalUrl } = seoProps;
    
    return {
      title: title,
      description: description,
      image: ogImage,
      url: canonicalUrl
    };
  }

  /**
   * Generiert eine Twitter-Vorschau
   * @param {Object} seoProps - Die SEO-Eigenschaften
   * @returns {Object} - Vorschaudaten für Twitter
   */
  generateTwitterPreview(seoProps) {
    const { title, description, ogImage, twitterCard } = seoProps;
    
    return {
      title: title,
      description: description,
      image: ogImage,
      cardType: twitterCard
    };
  }
}

export default new SEOService();
