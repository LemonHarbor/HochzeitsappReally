# WeWeb-Integration Dokumentation

Diese Dokumentation beschreibt den Prozess der Integration der Hochzeitsapp in WeWeb, um eine No-Code-Alternative zu ermöglichen.

## 1. Überblick

Die Hochzeitsapp wurde erfolgreich für die WeWeb-Integration vorbereitet, indem React-Komponenten zu Vue-Komponenten konvertiert und mit der WeWeb-Komponentenanatomie kompatibel gemacht wurden. Die Integration ermöglicht es, die App in WeWeb zu bearbeiten und anzupassen, ohne Programmierkenntnisse zu benötigen.

## 2. WeWeb-Komponentenanatomie

Jede WeWeb-Komponente besteht aus vier Hauptdateien:

1. **component.json** - Definition der Komponente mit Props, Methoden, Events und Styles
2. **[name]-model.json** - Datenmodell für die Komponente
3. **[name]-service.js** - Geschäftslogik für die Komponente
4. **[name]-ui.js** - Vue-Komponente mit WeWeb-Konfiguration

Diese Struktur ermöglicht eine klare Trennung von Daten, Logik und Darstellung und macht die Komponenten in WeWeb anpassbar.

## 3. Konvertierte Komponenten

Folgende Komponenten wurden erfolgreich konvertiert und mit der WeWeb-Komponentenanatomie kompatibel gemacht:

### 3.1 WeWebIntegration

Eine Komponente zur Verbindung mit WeWeb für No-Code-Bearbeitung.

- **Funktionen**: Verbindung mit WeWeb, Anzeige der WeWeb-Dokumentation, Synchronisierung mit WeWeb
- **Dateien**: 
  - component.json
  - weweb-integration-model.json
  - weweb-integration-service.js
  - weweb-integration-ui.js

### 3.2 ImageWithSEO

Eine SEO-optimierte Bildkomponente.

- **Funktionen**: Bildanzeige mit SEO-Attributen, responsive Bildanpassung
- **Dateien**: 
  - component.json
  - image-with-seo-model.json
  - image-with-seo-service.js
  - image-with-seo-ui.js

### 3.3 SEO

Eine umfassende SEO-Optimierungskomponente.

- **Funktionen**: Meta-Tag-Generierung, SEO-Vorschau für Google, Facebook und Twitter
- **Dateien**: 
  - component.json
  - seo-model.json
  - seo-service.js
  - seo-ui.js

### 3.4 Trauzeugen-Bereich

Eine Komponente für den geschützten Bereich für Trauzeugen.

- **Funktionen**: JGA-Planungstool, Abstimmungsfunktion, Kostenaufteilungssystem
- **Dateien**: 
  - component.json
  - trauzeugen-bereich-model.json
  - trauzeugen-bereich-service.js
  - trauzeugen-bereich-ui.js

## 4. WeWeb-spezifische Funktionen

### 4.1 Mehrsprachigkeit (DE/EN/FR/ES)

Alle Komponenten unterstützen Mehrsprachigkeit mit Deutsch und Englisch als Hauptsprachen und Französisch und Spanisch als zusätzliche Sprachen.

- **Implementierung**: 
  - Sprachauswahl über die `language`-Prop
  - Übersetzungsdateien in den model.json-Dateien
  - Übersetzungsfunktion in den Service-Klassen

### 4.2 Dark Mode

Alle Komponenten unterstützen einen verbesserten Dark Mode mit anpassbaren Farbschemata.

- **Implementierung**: 
  - Theme-Auswahl über die `theme`-Prop
  - Dynamische CSS-Klassen basierend auf dem aktuellen Theme
  - Konsistente Farbpalette für beide Themes

### 4.3 Mobile-First Design

Alle Komponenten wurden mit einem Mobile-First-Ansatz entwickelt.

- **Implementierung**: 
  - Responsive Layouts mit Flexbox und Grid
  - Anpassbare Größen für verschiedene Bildschirmgrößen
  - Touch-freundliche Bedienelemente

## 5. Integration in WeWeb

### 5.1 Komponenten importieren

1. Öffnen Sie Ihr WeWeb-Projekt
2. Navigieren Sie zu "Components" > "Import Component"
3. Wählen Sie den Ordner der zu importierenden Komponente aus
4. Klicken Sie auf "Import"

### 5.2 Komponenten verwenden

1. Ziehen Sie die importierte Komponente aus der Komponentenliste auf Ihre Seite
2. Konfigurieren Sie die Komponente über das Eigenschaftenpanel
3. Verbinden Sie die Komponente mit Datenquellen oder anderen Komponenten

### 5.3 Komponenten anpassen

1. Ändern Sie das Erscheinungsbild über die Style-Eigenschaften
2. Passen Sie die Funktionalität über die Props an
3. Verbinden Sie Events mit Aktionen

## 6. Tipps für die Verwendung

### 6.1 Mehrsprachigkeit

- Verwenden Sie die `language`-Prop, um die Sprache zu ändern
- Stellen Sie sicher, dass alle Texte in allen unterstützten Sprachen vorhanden sind

### 6.2 Dark Mode

- Verwenden Sie die `theme`-Prop, um zwischen Hell- und Dunkel-Modus zu wechseln
- Testen Sie beide Modi, um sicherzustellen, dass alle Elemente gut sichtbar sind

### 6.3 Mobile-Optimierung

- Testen Sie die Komponenten auf verschiedenen Bildschirmgrößen
- Verwenden Sie die responsive Vorschau in WeWeb, um das Verhalten zu überprüfen

## 7. Fehlerbehebung

### 7.1 Komponente wird nicht angezeigt

- Überprüfen Sie, ob alle erforderlichen Props gesetzt sind
- Prüfen Sie die Konsole auf Fehlermeldungen
- Stellen Sie sicher, dass die Komponente korrekt importiert wurde

### 7.2 Styling-Probleme

- Überprüfen Sie die Theme-Einstellung
- Prüfen Sie, ob CSS-Konflikte mit anderen Komponenten bestehen
- Verwenden Sie die WeWeb-Inspektor-Funktion, um Styling-Probleme zu identifizieren

### 7.3 Datenprobleme

- Überprüfen Sie die Verbindung zu Supabase
- Stellen Sie sicher, dass die erforderlichen Tabellen und Spalten existieren
- Prüfen Sie die Berechtigungen für den Zugriff auf die Daten

## 8. Nächste Schritte

- Weitere Komponenten konvertieren und in WeWeb integrieren
- Benutzerfeedback sammeln und Verbesserungen vornehmen
- Automatisierte Tests für die WeWeb-Integration implementieren
