// SEO UI für WeWeb
// Diese Komponente stellt die Benutzeroberfläche für die SEO-Optimierungskomponente dar

import { ref, computed, onMounted, watch } from 'vue';
import seoService from './seo-service.js';

export default {
  name: 'SEOUI',
  
  props: {
    title: {
      type: String,
      default: "HochzeitsappReally - Ihre perfekte Hochzeitsplanung"
    },
    description: {
      type: String,
      default: "HochzeitsappReally ist Ihre All-in-One-Lösung für eine stressfreie Hochzeitsplanung. Gästemanagement, Budgetplanung, Sitzordnung und mehr."
    },
    keywords: {
      type: String,
      default: "Hochzeitsplanung, Hochzeitsapp, Gästemanagement, Budgetplanung, Hochzeit, Sitzordnung, Gästeliste, Hochzeitsorganisation"
    },
    canonicalUrl: {
      type: String,
      default: "https://hochzeitsapp-really.vercel.app"
    },
    ogImage: {
      type: String,
      default: "/images/og-image.jpg"
    },
    ogType: {
      type: String,
      default: "website",
      validator: (value) => ['website', 'article', 'product'].includes(value)
    },
    twitterCard: {
      type: String,
      default: "summary_large_image",
      validator: (value) => ['summary', 'summary_large_image', 'app', 'player'].includes(value)
    },
    theme: {
      type: String,
      default: 'light',
      validator: (value) => ['light', 'dark'].includes(value)
    },
    language: {
      type: String,
      default: 'de',
      validator: (value) => ['de', 'en'].includes(value)
    }
  },
  
  setup(props, { emit }) {
    // Reaktive Daten
    const metaTags = ref([]);
    const validationErrors = ref([]);
    const isValid = ref(true);
    const showPreview = ref(false);
    const googlePreview = ref({});
    const facebookPreview = ref({});
    const twitterPreview = ref({});
    
    // Beim Mounten der Komponente
    onMounted(() => {
      // Theme und Sprache setzen
      seoService.setTheme(props.theme);
      seoService.setLanguage(props.language);
      
      // SEO-Eigenschaften validieren und Meta-Tags generieren
      validateAndUpdateSEO();
    });
    
    // Props überwachen
    watch(() => props.theme, (newTheme) => {
      seoService.setTheme(newTheme);
    });
    
    watch(() => props.language, (newLanguage) => {
      seoService.setLanguage(newLanguage);
    });
    
    // SEO-Eigenschaften überwachen und bei Änderungen aktualisieren
    watch([
      () => props.title,
      () => props.description,
      () => props.keywords,
      () => props.canonicalUrl,
      () => props.ogImage,
      () => props.ogType,
      () => props.twitterCard
    ], () => {
      validateAndUpdateSEO();
    });
    
    // SEO validieren und aktualisieren
    const validateAndUpdateSEO = () => {
      const seoProps = {
        title: props.title,
        description: props.description,
        keywords: props.keywords,
        canonicalUrl: props.canonicalUrl,
        ogImage: props.ogImage,
        ogType: props.ogType,
        twitterCard: props.twitterCard
      };
      
      // Validieren
      const validation = seoService.validateSEOProps(seoProps);
      validationErrors.value = validation.errors;
      isValid.value = validation.isValid;
      
      // Meta-Tags aktualisieren
      metaTags.value = seoService.updateMetaTags(seoProps);
      
      // Vorschauen generieren
      googlePreview.value = seoService.generateGooglePreview(seoProps);
      facebookPreview.value = seoService.generateFacebookPreview(seoProps);
      twitterPreview.value = seoService.generateTwitterPreview(seoProps);
      
      // Validierungsergebnis emittieren
      emit('validation', {
        isValid: validation.isValid,
        errors: validation.errors
      });
    };
    
    // Vorschau umschalten
    const togglePreview = () => {
      showPreview.value = !showPreview.value;
    };
    
    // Übersetzungsfunktion
    const t = (key) => {
      return seoService.translate(key);
    };
    
    // CSS-Klassen basierend auf dem Theme
    const themeClasses = computed(() => {
      return {
        container: props.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800',
        preview: props.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200',
        error: props.theme === 'dark' ? 'text-red-400' : 'text-red-600',
        button: props.theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
      };
    });
    
    return {
      metaTags,
      validationErrors,
      isValid,
      showPreview,
      googlePreview,
      facebookPreview,
      twitterPreview,
      togglePreview,
      themeClasses,
      t
    };
  },
  
  // Template
  template: `
    <div class="seo-component" :class="themeClasses.container">
      <!-- Validierungsfehler anzeigen -->
      <div v-if="!isValid" class="validation-errors mb-4">
        <p v-for="(error, index) in validationErrors" :key="index" :class="themeClasses.error">
          {{ error }}
        </p>
      </div>
      
      <!-- Vorschau-Umschalter -->
      <button 
        @click="togglePreview" 
        :class="[themeClasses.button, 'px-4 py-2 rounded text-sm font-medium mb-4']"
      >
        {{ showPreview ? 'Vorschau ausblenden' : 'SEO-Vorschau anzeigen' }}
      </button>
      
      <!-- SEO-Vorschau -->
      <div v-if="showPreview" class="seo-preview">
        <h3 class="text-lg font-semibold mb-2">{{ t('previewTitle') }}</h3>
        
        <!-- Google-Vorschau -->
        <div class="google-preview mb-4 p-4 rounded border" :class="themeClasses.preview">
          <h4 class="font-medium mb-2">{{ t('googlePreview') }}</h4>
          <div class="google-result">
            <div class="text-blue-600 text-xl">{{ googlePreview.title }}</div>
            <div class="text-green-700 text-sm">{{ googlePreview.url }}</div>
            <div class="text-gray-600">{{ googlePreview.description }}</div>
          </div>
        </div>
        
        <!-- Facebook-Vorschau -->
        <div class="facebook-preview mb-4 p-4 rounded border" :class="themeClasses.preview">
          <h4 class="font-medium mb-2">{{ t('facebookPreview') }}</h4>
          <div class="facebook-card">
            <div class="fb-image mb-2">
              <img :src="facebookPreview.image" alt="Open Graph Image" class="max-w-full h-auto rounded" />
            </div>
            <div class="fb-content">
              <div class="text-blue-600 font-medium">{{ facebookPreview.title }}</div>
              <div class="text-gray-600 text-sm">{{ facebookPreview.description }}</div>
              <div class="text-gray-500 text-xs">{{ facebookPreview.url }}</div>
            </div>
          </div>
        </div>
        
        <!-- Twitter-Vorschau -->
        <div class="twitter-preview p-4 rounded border" :class="themeClasses.preview">
          <h4 class="font-medium mb-2">{{ t('twitterPreview') }}</h4>
          <div class="twitter-card">
            <div class="tw-image mb-2">
              <img :src="twitterPreview.image" alt="Twitter Card Image" class="max-w-full h-auto rounded" />
            </div>
            <div class="tw-content">
              <div class="font-medium">{{ twitterPreview.title }}</div>
              <div class="text-gray-600 text-sm">{{ twitterPreview.description }}</div>
              <div class="text-gray-500 text-xs">{{ twitterPreview.cardType }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Meta-Tags (unsichtbar, aber für WeWeb wichtig) -->
      <div class="meta-tags-container" style="display: none;">
        <template v-for="(metaTag, index) in metaTags" :key="index">
          <component 
            :is="metaTag.tag" 
            v-if="metaTag.tag === 'title'"
            v-text="metaTag.content"
          />
          <component 
            :is="metaTag.tag" 
            v-else-if="metaTag.tag === 'script'"
            :type="metaTag.attrs.type"
            v-text="metaTag.content"
          />
          <component 
            :is="metaTag.tag" 
            v-else
            v-bind="metaTag.attrs"
          />
        </template>
      </div>
    </div>
  `,
  
  // WeWeb-spezifische Konfiguration
  weweb: {
    type: 'component',
    uiSchema: {
      ui:title: {
        type: 'text',
        label: 'Seitentitel'
      },
      ui:description: {
        type: 'textarea',
        label: 'Seitenbeschreibung'
      },
      ui:keywords: {
        type: 'textarea',
        label: 'Schlüsselwörter'
      },
      ui:canonicalUrl: {
        type: 'text',
        label: 'Kanonische URL'
      },
      ui:ogImage: {
        type: 'text',
        label: 'Open Graph Bild'
      },
      ui:ogType: {
        type: 'select',
        label: 'Open Graph Typ',
        options: [
          { label: 'Website', value: 'website' },
          { label: 'Artikel', value: 'article' },
          { label: 'Produkt', value: 'product' }
        ]
      },
      ui:twitterCard: {
        type: 'select',
        label: 'Twitter Card Typ',
        options: [
          { label: 'Zusammenfassung', value: 'summary' },
          { label: 'Große Zusammenfassung', value: 'summary_large_image' },
          { label: 'App', value: 'app' },
          { label: 'Player', value: 'player' }
        ]
      },
      ui:theme: {
        type: 'select',
        label: 'Farbschema',
        options: [
          { label: 'Hell', value: 'light' },
          { label: 'Dunkel', value: 'dark' }
        ]
      },
      ui:language: {
        type: 'select',
        label: 'Sprache',
        options: [
          { label: 'Deutsch', value: 'de' },
          { label: 'Englisch', value: 'en' }
        ]
      }
    }
  },
  
  // WeWeb-Element-Konfiguration
  wwElement: {
    type: 'seo',
    uiSchema: {
      ui:title: {
        type: 'text',
        label: 'Seitentitel'
      },
      ui:description: {
        type: 'textarea',
        label: 'Seitenbeschreibung'
      },
      ui:keywords: {
        type: 'textarea',
        label: 'Schlüsselwörter'
      },
      ui:canonicalUrl: {
        type: 'text',
        label: 'Kanonische URL'
      },
      ui:ogImage: {
        type: 'text',
        label: 'Open Graph Bild'
      },
      ui:ogType: {
        type: 'select',
        label: 'Open Graph Typ',
        options: [
          { label: 'Website', value: 'website' },
          { label: 'Artikel', value: 'article' },
          { label: 'Produkt', value: 'product' }
        ]
      },
      ui:twitterCard: {
        type: 'select',
        label: 'Twitter Card Typ',
        options: [
          { label: 'Zusammenfassung', value: 'summary' },
          { label: 'Große Zusammenfassung', value: 'summary_large_image' },
          { label: 'App', value: 'app' },
          { label: 'Player', value: 'player' }
        ]
      },
      ui:theme: {
        type: 'select',
        label: 'Farbschema',
        options: [
          { label: 'Hell', value: 'light' },
          { label: 'Dunkel', value: 'dark' }
        ]
      },
      ui:language: {
        type: 'select',
        label: 'Sprache',
        options: [
          { label: 'Deutsch', value: 'de' },
          { label: 'Englisch', value: 'en' }
        ]
      }
    }
  },
  
  // WeWeb-Konfiguration
  wwConfig: {
    general: {
      label: 'SEO-Optimierung',
      icon: 'search'
    },
    properties: {
      title: {
        label: 'Seitentitel',
        type: 'string',
        defaultValue: "HochzeitsappReally - Ihre perfekte Hochzeitsplanung"
      },
      description: {
        label: 'Seitenbeschreibung',
        type: 'string',
        defaultValue: "HochzeitsappReally ist Ihre All-in-One-Lösung für eine stressfreie Hochzeitsplanung. Gästemanagement, Budgetplanung, Sitzordnung und mehr."
      },
      keywords: {
        label: 'Schlüsselwörter',
        type: 'string',
        defaultValue: "Hochzeitsplanung, Hochzeitsapp, Gästemanagement, Budgetplanung, Hochzeit, Sitzordnung, Gästeliste, Hochzeitsorganisation"
      },
      canonicalUrl: {
        label: 'Kanonische URL',
        type: 'string',
        defaultValue: "https://hochzeitsapp-really.vercel.app"
      },
      ogImage: {
        label: 'Open Graph Bild',
        type: 'string',
        defaultValue: "/images/og-image.jpg"
      },
      ogType: {
        label: 'Open Graph Typ',
        type: 'select',
        options: [
          { label: 'Website', value: 'website' },
          { label: 'Artikel', value: 'article' },
          { label: 'Produkt', value: 'product' }
        ],
        defaultValue: "website"
      },
      twitterCard: {
        label: 'Twitter Card Typ',
        type: 'select',
        options: [
          { label: 'Zusammenfassung', value: 'summary' },
          { label: 'Große Zusammenfassung', value: 'summary_large_image' },
          { label: 'App', value: 'app' },
          { label: 'Player', value: 'player' }
        ],
        defaultValue: "summary_large_image"
      },
      theme: {
        label: 'Farbschema',
        type: 'select',
        options: [
          { label: 'Hell', value: 'light' },
          { label: 'Dunkel', value: 'dark' }
        ],
        defaultValue: 'light'
      },
      language: {
        label: 'Sprache',
        type: 'select',
        options: [
          { label: 'Deutsch', value: 'de' },
          { label: 'Englisch', value: 'en' }
        ],
        defaultValue: 'de'
      }
    }
  }
};
