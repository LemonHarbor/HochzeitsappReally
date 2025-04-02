// WeWeb Integration UI für WeWeb
// Diese Komponente stellt die Benutzeroberfläche für die WeWeb-Integrationskomponente dar

import { ref, computed, onMounted, watch } from 'vue';
import wewebIntegrationService from './weweb-integration-service.js';

export default {
  name: 'WeWebIntegrationUI',
  
  props: {
    isDeveloperMode: {
      type: Boolean,
      default: false
    },
    connectionStatus: {
      type: String,
      default: 'Not connected',
      validator: (value) => ['Not connected', 'Connected', 'Error'].includes(value)
    },
    lastSync: {
      type: String,
      default: 'Never'
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
    const status = ref(props.connectionStatus);
    const lastSyncTime = ref(props.lastSync);
    const loading = ref(false);
    
    // Beim Mounten der Komponente
    onMounted(() => {
      // Theme und Sprache setzen
      wewebIntegrationService.setTheme(props.theme);
      wewebIntegrationService.setLanguage(props.language);
      wewebIntegrationService.setDeveloperMode(props.isDeveloperMode);
      
      // Verbindungsstatus abrufen
      const connectionStatus = wewebIntegrationService.getConnectionStatus();
      status.value = connectionStatus.status;
      lastSyncTime.value = connectionStatus.lastSync;
      
      // Event-Listener registrieren
      wewebIntegrationService.addEventListener('onConnect', handleConnect);
      wewebIntegrationService.addEventListener('onSync', handleSync);
    });
    
    // Props überwachen
    watch(() => props.theme, (newTheme) => {
      wewebIntegrationService.setTheme(newTheme);
    });
    
    watch(() => props.language, (newLanguage) => {
      wewebIntegrationService.setLanguage(newLanguage);
    });
    
    watch(() => props.isDeveloperMode, (newMode) => {
      wewebIntegrationService.setDeveloperMode(newMode);
    });
    
    // Event-Handler
    const handleConnect = (data) => {
      status.value = data.status;
      emit('connect', data);
    };
    
    const handleSync = (data) => {
      lastSyncTime.value = data.lastSync;
      emit('sync', data);
    };
    
    // Methoden
    const connectToWeWeb = async () => {
      loading.value = true;
      try {
        await wewebIntegrationService.connectToWeWeb();
      } catch (error) {
        console.error('Error connecting to WeWeb:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const viewDocumentation = () => {
      wewebIntegrationService.viewDocumentation();
    };
    
    const syncWithWeWeb = async () => {
      loading.value = true;
      try {
        await wewebIntegrationService.syncWithWeWeb();
      } catch (error) {
        console.error('Error syncing with WeWeb:', error);
      } finally {
        loading.value = false;
      }
    };
    
    // Übersetzungsfunktion
    const t = (key) => {
      return wewebIntegrationService.translate(key);
    };
    
    // CSS-Klassen basierend auf dem Theme
    const themeClasses = computed(() => {
      return {
        container: props.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800',
        panel: props.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200',
        button: {
          primary: props.theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white',
          secondary: props.theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
        }
      };
    });
    
    // Nur im Entwicklermodus anzeigen
    const shouldDisplay = computed(() => {
      return wewebIntegrationService.isDeveloperMode();
    });
    
    return {
      status,
      lastSyncTime,
      loading,
      themeClasses,
      shouldDisplay,
      connectToWeWeb,
      viewDocumentation,
      syncWithWeWeb,
      t
    };
  },
  
  // Template
  template: `
    <div v-if="shouldDisplay" class="weweb-integration" :class="themeClasses.container">
      <div class="weweb-panel p-4 rounded-lg border shadow-sm" :class="themeClasses.panel">
        <h3 class="text-lg font-semibold mb-2">{{ t('title') }}</h3>
        <p class="text-sm mb-4">{{ t('description') }}</p>
        
        <div class="weweb-actions flex flex-col sm:flex-row gap-2 mb-4">
          <button 
            :class="[themeClasses.button.primary, 'px-4 py-2 rounded text-sm font-medium']"
            @click="connectToWeWeb"
            :disabled="loading"
          >
            <span v-if="loading">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ t('connectButton') }}
          </button>
          
          <button
            :class="[themeClasses.button.secondary, 'px-4 py-2 rounded text-sm font-medium']"
            @click="viewDocumentation"
          >
            {{ t('docsButton') }}
          </button>
          
          <button
            v-if="status === 'Connected'"
            :class="[themeClasses.button.secondary, 'px-4 py-2 rounded text-sm font-medium']"
            @click="syncWithWeWeb"
            :disabled="loading"
          >
            {{ t('syncButton') }}
          </button>
        </div>
        
        <div class="weweb-status text-sm">
          <p>{{ t('statusLabel') }}: {{ t(status.toLowerCase()) }}</p>
          <p>{{ t('lastSyncLabel') }}: {{ lastSyncTime }}</p>
        </div>
      </div>
    </div>
  `,
  
  // WeWeb-spezifische Konfiguration
  weweb: {
    type: 'component',
    uiSchema: {
      ui:isDeveloperMode: {
        type: 'toggle',
        label: 'Entwicklermodus'
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
    type: 'weweb-integration',
    uiSchema: {
      ui:isDeveloperMode: {
        type: 'toggle',
        label: 'Entwicklermodus'
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
      label: 'WeWeb Integration',
      icon: 'code'
    },
    properties: {
      isDeveloperMode: {
        label: 'Entwicklermodus',
        type: 'boolean',
        defaultValue: false
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
