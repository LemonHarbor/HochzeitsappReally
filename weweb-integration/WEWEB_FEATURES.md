# WeWeb-spezifische Funktionen

Diese Datei dokumentiert die WeWeb-spezifischen Funktionen, die in den konvertierten Komponenten implementiert wurden.

## 1. Mehrsprachigkeit (DE/EN)

Alle Komponenten unterstützen Mehrsprachigkeit mit Deutsch und Englisch als verfügbare Sprachen. Die Implementierung umfasst:

- Sprachauswahl über die `language`-Prop (de/en)
- Übersetzungsdateien in den model.json-Dateien
- Übersetzungsfunktion `translate()` in den Service-Klassen
- Reaktive Aktualisierung der UI bei Sprachänderungen

### Beispiel für Übersetzungsdaten:

```json
"translations": {
  "de": {
    "title": "WeWeb Integration",
    "description": "Verbinden Sie Ihre LemonVows App mit WeWeb für No-Code-Bearbeitung",
    "connectButton": "Mit WeWeb verbinden"
  },
  "en": {
    "title": "WeWeb Integration",
    "description": "Connect your LemonVows app to WeWeb for no-code editing",
    "connectButton": "Connect to WeWeb"
  }
}
```

## 2. Dark Mode

Alle Komponenten unterstützen einen Dark Mode mit anpassbaren Farbschemata:

- Theme-Auswahl über die `theme`-Prop (light/dark)
- Dynamische CSS-Klassen basierend auf dem aktuellen Theme
- Reaktive Aktualisierung der UI bei Theme-Änderungen
- Konsistente Farbpalette für beide Themes

### Beispiel für Theme-Klassen:

```javascript
const themeClasses = computed(() => {
  return {
    container: props.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800',
    button: {
      primary: props.theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
    }
  };
});
```

## 3. Mobile-First Design

Alle Komponenten wurden mit einem Mobile-First-Ansatz entwickelt:

- Responsive Layouts mit Flexbox und Grid
- Anpassbare Größen für verschiedene Bildschirmgrößen
- Touch-freundliche Bedienelemente
- Optimierte Ladezeiten durch effiziente Ressourcennutzung

## 4. WeWeb-Konfiguration

Jede Komponente enthält eine vollständige WeWeb-Konfiguration:

- `weweb`-Objekt mit Typ und UI-Schema
- `wwElement`-Konfiguration für die WeWeb-Oberfläche
- `wwConfig`-Objekt mit Labels, Icons und Standardwerten
- Anpassbare Eigenschaften über die WeWeb-Oberfläche

### Beispiel für WeWeb-Konfiguration:

```javascript
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
    }
  }
}
```

## 5. Validierung und Fehlerbehandlung

Alle Komponenten enthalten robuste Validierungs- und Fehlerbehandlungsmechanismen:

- Validierung von Pflichteigenschaften
- Benutzerfreundliche Fehlermeldungen
- Fallback-Werte für fehlende Eigenschaften
- Konsistente Fehlerdarstellung in beiden Themes

## 6. Event-Handling

Die Komponenten implementieren ein konsistentes Event-Handling-System:

- Event-Listener-Registrierung in den Service-Klassen
- Event-Auslösung bei wichtigen Aktionen
- Event-Propagation an übergeordnete Komponenten
- Reaktive Aktualisierung der UI bei Event-Auslösung

## 7. Vorschau-Funktionen

Einige Komponenten bieten Vorschau-Funktionen für eine bessere Benutzererfahrung:

- SEO-Komponente mit Vorschauen für Google, Facebook und Twitter
- Bildkomponente mit Validierung und Fehleranzeige
- WeWeb-Integration mit Statusanzeige

## Nächste Schritte

Die folgenden WeWeb-spezifischen Funktionen könnten in zukünftigen Versionen implementiert werden:

1. Unterstützung für weitere Sprachen (FR, ES)
2. Verbesserte Barrierefreiheit (ARIA-Attribute, Tastaturnavigation)
3. Animation und Übergänge für eine bessere Benutzererfahrung
4. Erweiterte Anpassungsoptionen in der WeWeb-Oberfläche
5. Integration mit weiteren WeWeb-Plugins und -Diensten
