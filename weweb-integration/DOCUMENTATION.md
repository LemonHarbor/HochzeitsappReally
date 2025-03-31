# LemonVows by LemonHarbor - Dokumentation

## Übersicht

LemonVows ist eine umfassende Hochzeitsplanungs-App, die mit WeWeb als No-Code-Lösung entwickelt wurde. Die App bietet verschiedene Preisstufen und Funktionen, um Paaren bei der Planung ihrer Hochzeit zu helfen.

## Preisstufen

Die App bietet vier Preisstufen:

1. **Free Version (0€)**
   - Grundfunktionen für bis zu 20 Gäste
   - Automatischer Zeitplangenerator
   - Einfache Gästeliste
   - Grundlegende Budgetplanung
   - Einfache Aufgabenliste

2. **Basis (29,99€/Monat)**
   - Erweiterte Funktionen für bis zu 50 Gäste
   - Detaillierte Gästeverwaltung mit RSVP-Tracking
   - Erweiterte Budgetplanung mit Berichten
   - Aufgabenlisten mit Erinnerungen
   - Lieferantenmanagement
   - Einfache Sitzplatzplanung
   - Basis-Fotogalerie

3. **Premium (89,99€/Monat)**
   - Alle Funktionen mit unbegrenzter Gästeanzahl
   - Vollständige Gästeverwaltung mit detailliertem RSVP-Tracking
   - Umfassende Budgetplanung mit detaillierten Berichten
   - Erweiterte Aufgabenlisten mit Erinnerungen und Zuweisungen
   - Umfassendes Lieferantenmanagement mit Bewertungen
   - Interaktive Sitzplatzplanung mit Drag-and-Drop
   - Erweiterte Fotogalerie mit Sharing-Optionen
   - Trauzeugenbereich mit Rollenvergabe

4. **Deluxe (199,99€/Monat)**
   - Premium-Funktionen plus persönlicher Assistent
   - KI-Redengenerator
   - NFT-Gästebuch
   - Unbegrenzte Gästeanzahl
   - Prioritäts-Support
   - Alle Premium-Funktionen inklusive

## Kernfunktionen

### Gästemanagement
- Verwaltung der Gästeliste
- RSVP-Tracking
- Gästekategorien (Familie, Freunde, Kollegen, etc.)
- Kontaktinformationen
- Menüauswahl
- Spezielle Anforderungen (Allergien, etc.)

### Budgetplanung
- Budgetübersicht
- Kategorisierte Ausgaben
- Ausgabenverfolgung
- Budgetberichte
- Bezahlte/Unbezahlte Posten
- Kostenvergleich (Geplant vs. Tatsächlich)

### Aufgabenlisten
- Aufgabenübersicht
- Kategorisierte Aufgaben
- Fälligkeitsdaten
- Erinnerungen
- Aufgabenzuweisung
- Fortschrittsverfolgung

### Lieferantenmanagement
- Lieferantenübersicht
- Kategorisierte Lieferanten
- Kontaktinformationen
- Vertragsmanagement
- Zahlungsverfolgung
- Lieferantenbewertungen

### Sitzplatzplanung
- Interaktive Sitzplatzplanung
- Drag-and-Drop-Funktionalität
- Tischkategorien
- Gästezuweisung
- Menüauswahl pro Gast
- Exportierbare Sitzpläne

### Fotogalerie
- Albenorganisation
- Fotoupload
- Sharing-Optionen
- Kommentarfunktion
- Likes
- Zugriffssteuerung

### Trauzeugenbereich
- Geschützter Bereich für Trauzeugen
- Rollenvergabe
- Aufgabenzuweisung
- Notizen
- Ereignisplanung
- Zugriffssteuerung

### Automatischer Zeitplangenerator
- Generierung eines Zeitplans basierend auf dem Hochzeitsdatum
- Meilensteine
- Aufgaben mit Fälligkeitsdaten
- Anpassbare Zeitpläne

## Technische Details

### WeWeb-Integration
Die App wurde mit WeWeb als No-Code-Lösung entwickelt. Die Integration umfasst:

- Komponenten für alle Kernfunktionen
- Responsive Design
- Benutzerfreundliche Oberfläche
- Anpassbare Konfiguration

### Verzeichnisstruktur
```
/weweb-integration/
  /components/
    /pricing-tiers/
    /timeline-generator/
    /guest-management/
    /budget-planning/
    /task-management/
    /vendor-management/
    /seating-planner/
    /photo-gallery/
    /best-man-section/
  /config/
    weweb-config.js
  /deploy/
    deploy.js
    index.html
  /test/
    test-app.js
```

### Komponenten
Jede Komponente besteht aus:
- Modell (JSON-Datei)
- Service (JavaScript-Datei)
- UI-Komponente (JavaScript-Datei)

## Anpassung der App

Als Nicht-Programmierer können Sie die App über die WeWeb-Oberfläche anpassen:

### Texte ändern
1. Melden Sie sich bei WeWeb an
2. Navigieren Sie zur gewünschten Seite
3. Klicken Sie auf den Text, den Sie ändern möchten
4. Bearbeiten Sie den Text im Eigenschaftenbereich

### Bilder ändern
1. Melden Sie sich bei WeWeb an
2. Navigieren Sie zur gewünschten Seite
3. Klicken Sie auf das Bild, das Sie ändern möchten
4. Laden Sie ein neues Bild im Eigenschaftenbereich hoch

### Preise ändern
1. Melden Sie sich bei WeWeb an
2. Navigieren Sie zur Preisseite
3. Klicken Sie auf den Preis, den Sie ändern möchten
4. Bearbeiten Sie den Preis im Eigenschaftenbereich

### Funktionen ändern
1. Melden Sie sich bei WeWeb an
2. Navigieren Sie zum Workflow-Bereich
3. Wählen Sie die Funktion aus, die Sie ändern möchten
4. Passen Sie die Logik nach Bedarf an

## Bereitstellung

Die App kann auf verschiedenen Plattformen bereitgestellt werden:

### WeWeb Hosting
1. Melden Sie sich bei WeWeb an
2. Klicken Sie auf "Veröffentlichen"
3. Wählen Sie "WeWeb Hosting"
4. Folgen Sie den Anweisungen

### Vercel
1. Exportieren Sie das Projekt aus WeWeb
2. Laden Sie es auf Vercel hoch
3. Konfigurieren Sie die Bereitstellungseinstellungen
4. Klicken Sie auf "Bereitstellen"

### Netlify
1. Exportieren Sie das Projekt aus WeWeb
2. Laden Sie es auf Netlify hoch
3. Konfigurieren Sie die Bereitstellungseinstellungen
4. Klicken Sie auf "Bereitstellen"

## Support

Bei Fragen oder Problemen wenden Sie sich bitte an:
- E-Mail: support@lemonharbor.com
- Telefon: +49 123 456789
- Website: www.lemonharbor.com/support
