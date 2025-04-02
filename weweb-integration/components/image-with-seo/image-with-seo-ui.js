// ImageWithSEO UI für WeWeb
// Diese Komponente stellt die Benutzeroberfläche für die SEO-optimierte Bildkomponente dar

import { ref, computed, onMounted, watch } from 'vue';
import imageWithSEOService from './image-with-seo-service.js';

export default {
  name: 'ImageWithSEOUI',
  
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: null
    },
    height: {
      type: Number,
      default: null
    },
    loading: {
      type: String,
      default: 'lazy',
      validator: (value) => ['lazy', 'eager'].includes(value)
    },
    className: {
      type: String,
      default: ''
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
    const validationErrors = ref([]);
    const isValid = ref(true);
    
    // Beim Mounten der Komponente
    onMounted(() => {
      // Theme und Sprache setzen
      imageWithSEOService.setTheme(props.theme);
      imageWithSEOService.setLanguage(props.language);
      
      // Bildeigenschaften validieren
      validateImage();
    });
    
    // Props überwachen
    watch(() => props.theme, (newTheme) => {
      imageWithSEOService.setTheme(newTheme);
    });
    
    watch(() => props.language, (newLanguage) => {
      imageWithSEOService.setLanguage(newLanguage);
    });
    
    // Bildeigenschaften überwachen und bei Änderungen validieren
    watch([() => props.src, () => props.alt], () => {
      validateImage();
    });
    
    // Bild validieren
    const validateImage = () => {
      const imageProps = {
        src: props.src,
        alt: props.alt,
        width: props.width,
        height: props.height,
        loading: props.loading,
        className: props.className
      };
      
      const validation = imageWithSEOService.validateImageProps(imageProps);
      validationErrors.value = validation.errors;
      isValid.value = validation.isValid;
      
      // Validierungsergebnis emittieren
      emit('validation', {
        isValid: validation.isValid,
        errors: validation.errors
      });
    };
    
    // Optimierte Bildattribute generieren
    const optimizedAttributes = computed(() => {
      const imageProps = {
        src: props.src,
        alt: props.alt,
        width: props.width,
        height: props.height,
        loading: props.loading,
        className: props.className
      };
      
      return imageWithSEOService.generateOptimizedImageAttributes(imageProps);
    });
    
    // CSS-Klassen basierend auf dem Theme
    const themeClasses = computed(() => {
      return {
        container: props.theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        error: props.theme === 'dark' ? 'text-red-400' : 'text-red-600'
      };
    });
    
    return {
      validationErrors,
      isValid,
      optimizedAttributes,
      themeClasses
    };
  },
  
  // Template
  template: `
    <div class="image-with-seo" :class="themeClasses.container">
      <img
        v-if="isValid"
        :src="optimizedAttributes.src"
        :alt="optimizedAttributes.alt"
        :width="optimizedAttributes.width"
        :height="optimizedAttributes.height"
        :loading="optimizedAttributes.loading"
        :decoding="optimizedAttributes.decoding"
        :class="optimizedAttributes.class"
      />
      <div v-else class="validation-errors">
        <p v-for="(error, index) in validationErrors" :key="index" :class="themeClasses.error">
          {{ error }}
        </p>
      </div>
    </div>
  `,
  
  // WeWeb-spezifische Konfiguration
  weweb: {
    type: 'component',
    uiSchema: {
      ui:src: {
        type: 'text',
        label: 'Bildquelle (URL)'
      },
      ui:alt: {
        type: 'text',
        label: 'Alternativer Text'
      },
      ui:width: {
        type: 'number',
        label: 'Breite (px)'
      },
      ui:height: {
        type: 'number',
        label: 'Höhe (px)'
      },
      ui:loading: {
        type: 'select',
        label: 'Ladeverhalten',
        options: [
          { label: 'Lazy Loading', value: 'lazy' },
          { label: 'Sofort laden', value: 'eager' }
        ]
      },
      ui:className: {
        type: 'text',
        label: 'CSS-Klassen'
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
    type: 'image-with-seo',
    uiSchema: {
      ui:src: {
        type: 'text',
        label: 'Bildquelle (URL)'
      },
      ui:alt: {
        type: 'text',
        label: 'Alternativer Text'
      },
      ui:width: {
        type: 'number',
        label: 'Breite (px)'
      },
      ui:height: {
        type: 'number',
        label: 'Höhe (px)'
      },
      ui:loading: {
        type: 'select',
        label: 'Ladeverhalten',
        options: [
          { label: 'Lazy Loading', value: 'lazy' },
          { label: 'Sofort laden', value: 'eager' }
        ]
      },
      ui:className: {
        type: 'text',
        label: 'CSS-Klassen'
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
      label: 'SEO-Bild',
      icon: 'image'
    },
    properties: {
      src: {
        label: 'Bildquelle (URL)',
        type: 'string',
        defaultValue: ''
      },
      alt: {
        label: 'Alternativer Text',
        type: 'string',
        defaultValue: ''
      },
      width: {
        label: 'Breite (px)',
        type: 'number',
        defaultValue: null
      },
      height: {
        label: 'Höhe (px)',
        type: 'number',
        defaultValue: null
      },
      loading: {
        label: 'Ladeverhalten',
        type: 'select',
        options: [
          { label: 'Lazy Loading', value: 'lazy' },
          { label: 'Sofort laden', value: 'eager' }
        ],
        defaultValue: 'lazy'
      },
      className: {
        label: 'CSS-Klassen',
        type: 'string',
        defaultValue: ''
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
