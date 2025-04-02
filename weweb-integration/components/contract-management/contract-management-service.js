// Contract Management Service für LemonVows
// Dieser Service verwaltet die Vertragslogik

import { supabase } from '../../../src/lib/supabase';
import { parseISO, addDays, differenceInDays, format } from 'date-fns';

class ContractManagementService {
  constructor() {
    this.contracts = [];
    this.activeTab = 'contracts';
    this.selectedContract = null;
    this.formMode = 'add';
  }

  // Verträge laden
  async loadContracts(userId) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      this.contracts = data || [];
      return this.contracts;
    } catch (error) {
      console.error('Fehler beim Laden der Verträge:', error);
      throw error;
    }
  }

  // Vertrag hinzufügen
  async addContract(contract) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .insert({
          ...contract,
          created_at: new Date().toISOString()
        })
        .select();
        
      if (error) throw error;
      this.contracts.push(data[0]);
      return data[0];
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Vertrags:', error);
      throw error;
    }
  }

  // Vertrag aktualisieren
  async updateContract(id, updates) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      
      // Lokale Daten aktualisieren
      const index = this.contracts.findIndex(contract => contract.id === id);
      if (index !== -1) {
        this.contracts[index] = data[0];
      }
      
      return data[0];
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Vertrags:', error);
      throw error;
    }
  }

  // Vertrag löschen
  async removeContract(id) {
    try {
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Lokale Daten aktualisieren
      this.contracts = this.contracts.filter(contract => contract.id !== id);
      
      return true;
    } catch (error) {
      console.error('Fehler beim Löschen des Vertrags:', error);
      throw error;
    }
  }

  // Vertrag anzeigen
  viewContract(url) {
    if (!url) return false;
    
    try {
      window.open(url, '_blank');
      return true;
    } catch (error) {
      console.error('Fehler beim Öffnen des Vertrags:', error);
      return false;
    }
  }

  // Ablaufende Verträge abrufen
  getExpiringContracts(daysThreshold = 30) {
    const today = new Date();
    const thresholdDate = addDays(today, daysThreshold);
    
    return this.contracts.filter(contract => {
      if (!contract.expiration_date) return false;
      
      const expirationDate = parseISO(contract.expiration_date);
      return expirationDate <= thresholdDate && expirationDate >= today;
    }).sort((a, b) => {
      const dateA = parseISO(a.expiration_date);
      const dateB = parseISO(b.expiration_date);
      return dateA - dateB;
    });
  }

  // Tage bis zum Ablauf berechnen
  getDaysUntilExpiration(expirationDateString) {
    if (!expirationDateString) return null;
    
    const today = new Date();
    const expirationDate = parseISO(expirationDateString);
    return differenceInDays(expirationDate, today);
  }

  // Status-Badge-Variante abrufen
  getStatusBadge(status) {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'expired':
        return 'destructive';
      case 'cancelled':
        return 'destructive';
      case 'draft':
      default:
        return 'secondary';
    }
  }

  // Datum formatieren
  formatDate(dateString) {
    if (!dateString) return '';
    const date = parseISO(dateString);
    return format(date, 'dd.MM.yyyy');
  }

  // Dateigröße formatieren
  formatFileSize(bytes) {
    if (!bytes) return '';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  // Vertrag hochladen
  async uploadContractFile(file, path) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${path}/${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('contracts')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('contracts')
        .getPublicUrl(filePath);
        
      return {
        url: urlData.publicUrl,
        type: file.type,
        size: file.size,
        name: file.name
      };
    } catch (error) {
      console.error('Fehler beim Hochladen der Vertragsdatei:', error);
      throw error;
    }
  }
}

export default new ContractManagementService();
