// Appointment Calendar UI Component für LemonVows
// Diese Komponente stellt die Benutzeroberfläche für den Terminkalender dar

import { ref, computed, onMounted, watch } from 'vue';
import appointmentCalendarService from './appointment-calendar-service.js';
import {
  format,
  parseISO,
  isSameDay,
  isSameMonth,
  isToday
} from 'date-fns';

export default {
  name: 'AppointmentCalendarUI',
  
  props: {
    appointments: {
      type: Array,
      default: () => []
    },
    vendors: {
      type: Array,
      default: () => []
    },
    showAddButton: {
      type: Boolean,
      default: true
    },
    showVendorName: {
      type: Boolean,
      default: true
    }
  },
  
  setup(props, { emit }) {
    // Reaktive Daten
    const currentMonth = ref(new Date());
    const selectedDate = ref(new Date());
    const loading = ref(true);
    
    // Beim Mounten der Komponente
    onMounted(() => {
      // Termine und Dienstleister in den Service laden
      if (props.appointments.length > 0) {
        appointmentCalendarService.appointments = props.appointments;
      }
      
      if (props.vendors.length > 0) {
        appointmentCalendarService.vendors = props.vendors;
      }
      
      loading.value = false;
    });
    
    // Wenn sich die Props ändern, den Service aktualisieren
    watch(() => props.appointments, (newAppointments) => {
      appointmentCalendarService.appointments = newAppointments;
    }, { deep: true });
    
    watch(() => props.vendors, (newVendors) => {
      appointmentCalendarService.vendors = newVendors;
    }, { deep: true });
    
    // Tage des aktuellen Monats
    const monthDays = computed(() => {
      return appointmentCalendarService.getMonthDays();
    });
    
    // Wochentag des ersten Tags im Monat
    const startDay = computed(() => {
      return appointmentCalendarService.getStartDay();
    });
    
    // Termine für den ausgewählten Tag
    const selectedDateAppointments = computed(() => {
      return appointmentCalendarService.getAppointmentsForDay(selectedDate.value);
    });
    
    // Zum vorherigen Monat navigieren
    const prevMonth = () => {
      currentMonth.value = appointmentCalendarService.prevMonth();
    };
    
    // Zum nächsten Monat navigieren
    const nextMonth = () => {
      currentMonth.value = appointmentCalendarService.nextMonth();
    };
    
    // Zum heutigen Tag navigieren
    const goToToday = () => {
      const result = appointmentCalendarService.goToToday();
      currentMonth.value = result.currentMonth;
      selectedDate.value = result.selectedDate;
    };
    
    // Termin hinzufügen
    const addAppointment = async (appointment) => {
      try {
        const newAppointment = await appointmentCalendarService.addAppointment(appointment);
        emit('appointment-added', newAppointment);
        return newAppointment;
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Termins:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Termin aktualisieren
    const updateAppointment = async (id, updates) => {
      try {
        const updatedAppointment = await appointmentCalendarService.updateAppointment(id, updates);
        emit('appointment-updated', updatedAppointment);
        return updatedAppointment;
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Termins:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Termin löschen
    const removeAppointment = async (id) => {
      try {
        const removed = await appointmentCalendarService.removeAppointment(id);
        if (removed) {
          emit('appointment-removed', { id });
        }
        return removed;
      } catch (error) {
        console.error('Fehler beim Löschen des Termins:', error);
        emit('error', error.message);
        return false;
      }
    };
    
    // Termin anzeigen
    const viewAppointment = (appointment) => {
      emit('appointment-viewed', appointment);
    };
    
    // Kalender exportieren
    const exportCalendar = () => {
      try {
        const icalData = appointmentCalendarService.exportCalendar();
        emit('calendar-exported', icalData);
        return icalData;
      } catch (error) {
        console.error('Fehler beim Exportieren des Kalenders:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Hilfsfunktionen
    const formatMonthYear = (date) => {
      return format(date, 'MMMM yyyy');
    };
    
    const formatDayNumber = (date) => {
      return format(date, 'd');
    };
    
    const formatFullDate = (date) => {
      return format(date, 'EEEE, d. MMMM yyyy');
    };
    
    const formatTime = (dateString) => {
      return appointmentCalendarService.formatTimeString(dateString);
    };
    
    const getVendorName = (vendorId) => {
      return appointmentCalendarService.getVendorName(vendorId);
    };
    
    const getStatusBadge = (status) => {
      return appointmentCalendarService.getStatusBadge(status);
    };
    
    const dayHasAppointments = (day) => {
      return appointmentCalendarService.dayHasAppointments(day);
    };
    
    const getAppointmentCount = (day) => {
      return appointmentCalendarService.getAppointmentCount(day);
    };
    
    return {
      currentMonth,
      selectedDate,
      loading,
      monthDays,
      startDay,
      selectedDateAppointments,
      prevMonth,
      nextMonth,
      goToToday,
      addAppointment,
      updateAppointment,
      removeAppointment,
      viewAppointment,
      exportCalendar,
      formatMonthYear,
      formatDayNumber,
      formatFullDate,
      formatTime,
      getVendorName,
      getStatusBadge,
      dayHasAppointments,
      getAppointmentCount,
      // Hilfsfunktionen für die Vorlage
      isSameMonth: (day, month) => isSameMonth(day, month),
      isSameDay: (day1, day2) => isSameDay(day1, day2),
      isToday: (day) => isToday(day)
    };
  },
  
  // WeWeb-spezifische Konfiguration
  wwElement: {
    type: 'appointment-calendar',
    uiSchema: {
      ui:appointments: {
        type: 'array',
        label: 'Termine'
      },
      ui:vendors: {
        type: 'array',
        label: 'Dienstleister'
      },
      ui:showAddButton: {
        type: 'toggle',
        label: 'Hinzufügen-Schaltfläche anzeigen'
      },
      ui:showVendorName: {
        type: 'toggle',
        label: 'Dienstleisternamen anzeigen'
      }
    }
  },
  
  wwConfig: {
    general: {
      label: 'Terminkalender',
      icon: 'calendar'
    },
    properties: {
      appointments: {
        label: 'Termine',
        type: 'array',
        bindable: true
      },
      vendors: {
        label: 'Dienstleister',
        type: 'array',
        bindable: true
      },
      showAddButton: {
        label: 'Hinzufügen-Schaltfläche anzeigen',
        type: 'boolean',
        defaultValue: true
      },
      showVendorName: {
        label: 'Dienstleisternamen anzeigen',
        type: 'boolean',
        defaultValue: true
      }
    },
    events: {
      'appointment-added': {
        label: 'Termin hinzugefügt',
        returnVariable: 'appointment'
      },
      'appointment-updated': {
        label: 'Termin aktualisiert',
        returnVariable: 'appointment'
      },
      'appointment-removed': {
        label: 'Termin entfernt',
        returnVariable: 'id'
      },
      'appointment-viewed': {
        label: 'Termin angezeigt',
        returnVariable: 'appointment'
      },
      'calendar-exported': {
        label: 'Kalender exportiert',
        returnVariable: 'icalData'
      },
      'error': {
        label: 'Fehler',
        returnVariable: 'errorMessage'
      }
    }
  }
};
