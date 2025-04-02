import { ref, reactive } from 'vue';
import { supabase } from '../lib/supabase';

// Typen für Fehlerbehandlung
export interface SupabaseError {
  code: string;
  message: string;
  details?: string;
  hint?: string;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: SupabaseError | null;
  loading: boolean;
}

// Generischer Supabase-Service für Fehlerbehandlung
export function useSupabaseService() {
  // Globaler Fehlerstatus
  const globalError = ref<SupabaseError | null>(null);
  const isLoading = ref<boolean>(false);
  
  // Fehlerstatistiken für Monitoring
  const errorStats = reactive({
    count: 0,
    lastError: null as Date | null,
    errorsByType: {} as Record<string, number>
  });

  // Wrapper für Supabase-Anfragen mit einheitlicher Fehlerbehandlung
  async function executeSupabaseQuery<T>(
    queryFn: () => Promise<{ data: T | null; error: any }>,
    errorContext: string
  ): Promise<SupabaseResponse<T>> {
    isLoading.value = true;
    globalError.value = null;
    
    try {
      const { data, error } = await queryFn();
      
      if (error) {
        handleError(error, errorContext);
        return { data: null, error, loading: false };
      }
      
      return { data, error: null, loading: false };
    } catch (err: any) {
      const error = normalizeError(err, errorContext);
      handleError(error, errorContext);
      return { data: null, error, loading: false };
    } finally {
      isLoading.value = false;
    }
  }

  // Fehlerbehandlung
  function handleError(error: any, context: string) {
    const normalizedError = normalizeError(error, context);
    globalError.value = normalizedError;
    
    // Fehlerstatistiken aktualisieren
    errorStats.count++;
    errorStats.lastError = new Date();
    
    const errorType = normalizedError.code || 'unknown';
    errorStats.errorsByType[errorType] = (errorStats.errorsByType[errorType] || 0) + 1;
    
    // Fehler in der Konsole protokollieren
    console.error(`[${context}] ${normalizedError.message}`, normalizedError);
    
    // Hier könnte man auch Fehler an einen Monitoring-Service senden
  }

  // Fehler normalisieren
  function normalizeError(error: any, context: string): SupabaseError {
    // Wenn es bereits ein Supabase-Fehler ist
    if (error && error.code && error.message) {
      return error as SupabaseError;
    }
    
    // Für String-Fehler
    if (typeof error === 'string') {
      return {
        code: 'CUSTOM_ERROR',
        message: error,
        details: context
      };
    }
    
    // Für Error-Objekte
    if (error instanceof Error) {
      return {
        code: 'JS_ERROR',
        message: error.message,
        details: error.stack,
        hint: context
      };
    }
    
    // Fallback für unbekannte Fehlertypen
    return {
      code: 'UNKNOWN_ERROR',
      message: 'Ein unbekannter Fehler ist aufgetreten',
      details: JSON.stringify(error),
      hint: context
    };
  }

  // Benutzerfreundliche Fehlermeldungen
  function getUserFriendlyErrorMessage(error: SupabaseError | null): string {
    if (!error) return '';
    
    // Bekannte Fehlercodes mit benutzerfreundlichen Meldungen
    const errorMessages: Record<string, string> = {
      'PGRST301': 'Die Ressource wurde nicht gefunden.',
      'PGRST302': 'Der Zugriff auf diese Ressource wurde verweigert.',
      '23505': 'Ein Eintrag mit diesen Daten existiert bereits.',
      '23503': 'Der Eintrag kann nicht erstellt werden, da eine Referenz fehlt.',
      '23514': 'Die Daten entsprechen nicht den Anforderungen.',
      'P0001': 'Ein Datenbankfehler ist aufgetreten.',
      'auth/invalid-email': 'Die E-Mail-Adresse ist ungültig.',
      'auth/user-disabled': 'Dieses Benutzerkonto wurde deaktiviert.',
      'auth/user-not-found': 'Es wurde kein Benutzer mit dieser E-Mail-Adresse gefunden.',
      'auth/wrong-password': 'Das eingegebene Passwort ist falsch.',
      'auth/email-already-in-use': 'Diese E-Mail-Adresse wird bereits verwendet.',
      'auth/weak-password': 'Das Passwort ist zu schwach.',
      'auth/invalid-credential': 'Die Anmeldedaten sind ungültig.',
      'auth/invalid-verification-code': 'Der Verifizierungscode ist ungültig.',
      'auth/invalid-verification-id': 'Die Verifizierungs-ID ist ungültig.',
      'auth/requires-recent-login': 'Diese Aktion erfordert eine erneute Anmeldung.',
      'auth/too-many-requests': 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.',
      'storage/unauthorized': 'Nicht autorisiert für diese Speicheroperation.',
      'storage/quota-exceeded': 'Speicherplatz überschritten.',
      'storage/object-not-found': 'Die angeforderte Datei wurde nicht gefunden.',
      'NETWORK_ERROR': 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.',
      'TIMEOUT_ERROR': 'Die Anfrage hat zu lange gedauert. Bitte versuchen Sie es später erneut.',
      'CUSTOM_ERROR': error.message,
      'JS_ERROR': 'Ein Fehler ist aufgetreten: ' + error.message,
      'UNKNOWN_ERROR': 'Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
    };
    
    // Versuche, eine passende Fehlermeldung zu finden
    return errorMessages[error.code] || error.message || 'Ein unbekannter Fehler ist aufgetreten.';
  }

  // Spezifische Supabase-Operationen mit Fehlerbehandlung
  
  // Daten abrufen
  async function fetchData<T>(
    table: string, 
    query: any = {},
    options: { select?: string; single?: boolean } = {}
  ): Promise<SupabaseResponse<T>> {
    return executeSupabaseQuery(async () => {
      let queryBuilder = supabase.from(table).select(options.select || '*');
      
      // Filter anwenden
      if (query.filter) {
        for (const [column, value] of Object.entries(query.filter)) {
          queryBuilder = queryBuilder.eq(column, value);
        }
      }
      
      // Sortierung anwenden
      if (query.orderBy) {
        queryBuilder = queryBuilder.order(query.orderBy.column, { 
          ascending: query.orderBy.ascending 
        });
      }
      
      // Limit anwenden
      if (query.limit) {
        queryBuilder = queryBuilder.limit(query.limit);
      }
      
      // Einzelnes Ergebnis oder Liste
      if (options.single) {
        return queryBuilder.single();
      }
      
      return queryBuilder;
    }, `fetch:${table}`);
  }
  
  // Daten einfügen
  async function insertData<T>(
    table: string, 
    data: any
  ): Promise<SupabaseResponse<T>> {
    return executeSupabaseQuery(async () => {
      return supabase.from(table).insert(data).select().single();
    }, `insert:${table}`);
  }
  
  // Daten aktualisieren
  async function updateData<T>(
    table: string, 
    id: string, 
    data: any
  ): Promise<SupabaseResponse<T>> {
    return executeSupabaseQuery(async () => {
      return supabase
        .from(table)
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
    }, `update:${table}`);
  }
  
  // Daten löschen
  async function deleteData(
    table: string, 
    id: string
  ): Promise<SupabaseResponse<null>> {
    return executeSupabaseQuery(async () => {
      const { error } = await supabase.from(table).delete().eq('id', id);
      return { data: null, error };
    }, `delete:${table}`);
  }
  
  // Datei hochladen
  async function uploadFile(
    bucket: string,
    path: string,
    file: File
  ): Promise<SupabaseResponse<{ path: string; url: string }>> {
    return executeSupabaseQuery(async () => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) throw error;
      
      // Öffentliche URL abrufen
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data?.path || path);
        
      return { 
        data: { 
          path: data?.path || path, 
          url: urlData.publicUrl 
        }, 
        error: null 
      };
    }, `upload:${bucket}`);
  }
  
  // Datei löschen
  async function deleteFile(
    bucket: string,
    path: string
  ): Promise<SupabaseResponse<null>> {
    return executeSupabaseQuery(async () => {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);
        
      return { data: null, error };
    }, `deleteFile:${bucket}`);
  }

  return {
    // Status
    globalError,
    isLoading,
    errorStats,
    
    // Hilfsfunktionen
    getUserFriendlyErrorMessage,
    
    // Datenoperationen
    fetchData,
    insertData,
    updateData,
    deleteData,
    
    // Dateioperationen
    uploadFile,
    deleteFile,
    
    // Generische Ausführung
    executeSupabaseQuery
  };
}
