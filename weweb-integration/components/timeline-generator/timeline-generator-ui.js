// Timeline Generator UI Component für LemonVows
// Diese Komponente stellt die Benutzeroberfläche für den automatischen Zeitplangenerator dar

import { ref, computed, onMounted, watch } from 'vue';
import timelineGeneratorService from './timeline-generator-service.js';

export default {
  name: 'TimelineGeneratorUI',
  
  props: {
    weddingDate: {
      type: Date,
      required: true
    },
    templateType: {
      type: String,
      default: 'standard',
      validator: (value) => ['standard', 'traditionell', 'modern'].includes(value)
    },
    enableCustomEvents: {
      type: Boolean,
      default: true
    },
    enableReminders: {
      type: Boolean,
      default: true
    },
    enableSharing: {
      type: Boolean,
      default: false
    }
  },
  
  setup(props, { emit }) {
    // Reaktive Daten
    const timeline = ref([]);
    const categories = ref([]);
    const templateTypes = ref([]);
    const loading = ref(true);
    const selectedCategory = ref('all');
    const searchQuery = ref('');
    const showCompleted = ref(true);
    
    // Beim Mounten der Komponente
    onMounted(() => {
      // Kategorien laden
      categories.value = timelineGeneratorService.getAllCategories();
      
      // Vorlagentypen laden
      templateTypes.value = timelineGeneratorService.getTemplateTypes();
      
      // Zeitplan generieren
      generateTimeline();
      
      loading.value = false;
    });
    
    // Zeitplan neu generieren, wenn sich das Hochzeitsdatum oder der Vorlagentyp ändert
    watch(() => [props.weddingDate, props.templateType], () => {
      generateTimeline();
    });
    
    // Zeitplan generieren
    const generateTimeline = () => {
      if (!props.weddingDate) return;
      
      try {
        timeline.value = timelineGeneratorService.generateTimeline(
          props.weddingDate,
          props.templateType
        );
        
        emit('timeline-generated', timeline.value);
      } catch (error) {
        console.error('Fehler beim Generieren des Zeitplans:', error);
        emit('error', error.message);
      }
    };
    
    // Benutzerdefiniertes Ereignis hinzufügen
    const addCustomEvent = (event) => {
      if (!props.enableCustomEvents) return;
      
      try {
        timeline.value = timelineGeneratorService.addCustomEvent(
          timeline.value,
          event,
          props.weddingDate
        );
        
        emit('event-added', event);
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Ereignisses:', error);
        emit('error', error.message);
      }
    };
    
    // Ereignis aktualisieren
    const updateEvent = (eventId, updatedEvent) => {
      try {
        timeline.value = timelineGeneratorService.updateEvent(
          timeline.value,
          eventId,
          updatedEvent,
          props.weddingDate
        );
        
        emit('event-updated', { id: eventId, ...updatedEvent });
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Ereignisses:', error);
        emit('error', error.message);
      }
    };
    
    // Ereignis entfernen
    const removeEvent = (eventId) => {
      try {
        timeline.value = timelineGeneratorService.removeEvent(
          timeline.value,
          eventId
        );
        
        emit('event-removed', eventId);
      } catch (error) {
        console.error('Fehler beim Entfernen des Ereignisses:', error);
        emit('error', error.message);
      }
    };
    
    // Ereignis als abgeschlossen markieren
    const markEventCompleted = (eventId, isCompleted = true) => {
      try {
        timeline.value = timelineGeneratorService.markEventCompleted(
          timeline.value,
          eventId,
          isCompleted
        );
        
        emit('event-completed', { id: eventId, isCompleted });
      } catch (error) {
        console.error('Fehler beim Markieren des Ereignisses:', error);
        emit('error', error.message);
      }
    };
    
    // Zeitplan exportieren
    const exportTimeline = (format = 'json') => {
      try {
        const exportedTimeline = timelineGeneratorService.exportTimeline(
          timeline.value,
          format
        );
        
        emit('timeline-exported', { format, content: exportedTimeline });
        
        return exportedTimeline;
      } catch (error) {
        console.error('Fehler beim Exportieren des Zeitplans:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Zeitplan teilen
    const shareTimeline = (recipients, message) => {
      if (!props.enableSharing) return;
      
      // In einer echten Implementierung würde hier der Zeitplan geteilt werden
      // Für diese Demo geben wir nur ein Event aus
      emit('timeline-shared', { recipients, message });
    };
    
    // Gefilterte Ereignisse
    const filteredEvents = computed(() => {
      return timeline.value.filter(event => {
        // Nach Kategorie filtern
        const categoryMatch = selectedCategory.value === 'all' || event.categoryId === selectedCategory.value;
        
        // Nach Abschluss filtern
        const completionMatch = showCompleted.value || !event.isCompleted;
        
        // Nach Suchbegriff filtern
        const searchMatch = !searchQuery.value || 
          event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.value.toLowerCase());
        
        return categoryMatch && completionMatch && searchMatch;
      });
    });
    
    // Gruppierte Ereignisse nach Monat
    const groupedEvents = computed(() => {
      const groups = {};
      
      filteredEvents.value.forEach(event => {
        const date = new Date(event.date);
        const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
        
        if (!groups[monthYear]) {
          groups[monthYear] = {
            label: date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }),
            events: []
          };
        }
        
        groups[monthYear].events.push(event);
      });
      
      // Nach Datum sortieren
      return Object.values(groups).sort((a, b) => {
        const dateA = new Date(a.events[0].date);
        const dateB = new Date(b.events[0].date);
        return dateA - dateB;
      });
    });
    
    // Fortschritt berechnen
    const progress = computed(() => {
      if (timeline.value.length === 0) return 0;
      
      const completedCount = timeline.value.filter(event => event.isCompleted).length;
      return Math.round((completedCount / timeline.value.length) * 100);
    });
    
    return {
      timeline,
      categories,
      templateTypes,
      loading,
      selectedCategory,
      searchQuery,
      showCompleted,
      filteredEvents,
      groupedEvents,
      progress,
      generateTimeline,
      addCustomEvent,
      updateEvent,
      removeEvent,
      markEventCompleted,
      exportTimeline,
      shareTimeline
    };
  },
  
  // WeWeb-spezifische Konfiguration
  weweb: {
    type: 'component',
    uiSchema: {
      ui:templateType: {
        type: 'select',
        label: 'Vorlagentyp',
        options: [
          { label: 'Standard', value: 'standard' },
          { label: 'Traditionell', value: 'traditionell' },
          { label: 'Modern', value: 'modern' }
        ]
      },
      ui:enableCustomEvents: {
        type: 'toggle',
        label: 'Benutzerdefinierte Ereignisse aktivieren'
      },
      ui:enableReminders: {
        type: 'toggle',
        label: 'Erinnerungen aktivieren'
      },
      ui:enableSharing: {
        type: 'toggle',
        label: 'Teilen aktivieren'
      }
    }
  }
};
