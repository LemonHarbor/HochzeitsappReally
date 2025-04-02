// Appointment Calendar Service für LemonVows
// Dieser Service verwaltet die Terminlogik für den Kalender

import { supabase } from '../../../src/lib/supabase';
import {
  format,
  parseISO,
  isSameDay,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  getDay,
  isToday
} from 'date-fns';

class AppointmentCalendarService {
  constructor() {
    this.appointments = [];
    this.vendors = [];
    this.currentMonth = new Date();
    this.selectedDate = new Date();
  }

  // Termine laden
  async loadAppointments(userId) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      this.appointments = data || [];
      return this.appointments;
    } catch (error) {
      console.error('Fehler beim Laden der Termine:', error);
      throw error;
    }
  }

  // Dienstleister laden
  async loadVendors(userId) {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      this.vendors = data || [];
      return this.vendors;
    } catch (error) {
      console.error('Fehler beim Laden der Dienstleister:', error);
      throw error;
    }
  }

  // Termin hinzufügen
  async addAppointment(appointment) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          ...appointment,
          created_at: new Date().toISOString()
        })
        .select();
        
      if (error) throw error;
      this.appointments.push(data[0]);
      return data[0];
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Termins:', error);
      throw error;
    }
  }

  // Termin aktualisieren
  async updateAppointment(id, updates) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      
      // Lokale Daten aktualisieren
      const index = this.appointments.findIndex(appointment => appointment.id === id);
      if (index !== -1) {
        this.appointments[index] = data[0];
      }
      
      return data[0];
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Termins:', error);
      throw error;
    }
  }

  // Termin löschen
  async removeAppointment(id) {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Lokale Daten aktualisieren
      this.appointments = this.appointments.filter(appointment => appointment.id !== id);
      
      return true;
    } catch (error) {
      console.error('Fehler beim Löschen des Termins:', error);
      throw error;
    }
  }

  // Termine für einen bestimmten Tag abrufen
  getAppointmentsForDay(date) {
    return this.appointments.filter(appointment => {
      const appointmentDate = parseISO(appointment.start_time);
      return isSameDay(appointmentDate, date);
    });
  }

  // Prüfen, ob ein Tag Termine hat
  dayHasAppointments(day) {
    return this.appointments.some(appointment => {
      const appointmentDate = parseISO(appointment.start_time);
      return isSameDay(appointmentDate, day);
    });
  }

  // Anzahl der Termine für einen Tag abrufen
  getAppointmentCount(day) {
    return this.appointments.filter(appointment => {
      const appointmentDate = parseISO(appointment.start_time);
      return isSameDay(appointmentDate, day);
    }).length;
  }

  // Dienstleisternamen anhand der ID abrufen
  getVendorName(vendorId) {
    const vendor = this.vendors.find(v => v.id === vendorId);
    return vendor ? vendor.name : 'Unbekannter Dienstleister';
  }

  // Zeit formatieren
  formatTimeString(dateString) {
    const date = parseISO(dateString);
    return format(date, 'HH:mm');
  }

  // Status-Badge-Variante abrufen
  getStatusBadge(status) {
    switch (status) {
      case 'scheduled':
        return 'default';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'destructive';
      case 'rescheduled':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  // Zum vorherigen Monat navigieren
  prevMonth() {
    this.currentMonth = subMonths(this.currentMonth, 1);
    return this.currentMonth;
  }

  // Zum nächsten Monat navigieren
  nextMonth() {
    this.currentMonth = addMonths(this.currentMonth, 1);
    return this.currentMonth;
  }

  // Zum heutigen Tag navigieren
  goToToday() {
    this.currentMonth = new Date();
    this.selectedDate = new Date();
    return {
      currentMonth: this.currentMonth,
      selectedDate: this.selectedDate
    };
  }

  // Tage des aktuellen Monats abrufen
  getMonthDays() {
    const monthStart = startOfMonth(this.currentMonth);
    const monthEnd = endOfMonth(this.currentMonth);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  }

  // Wochentag des ersten Tags im Monat abrufen (0 = Sonntag, 1 = Montag, usw.)
  getStartDay() {
    return getDay(startOfMonth(this.currentMonth));
  }

  // Kalender als iCal exportieren
  exportCalendar() {
    // Implementierung des iCal-Exports
    // ...
    return 'iCal-Daten';
  }
}

export default new AppointmentCalendarService();
