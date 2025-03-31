# WeWeb Integration für LemonVows by LemonHarbor

Diese Dokumentation beschreibt die Integration von WeWeb als No-Code-Lösung für die LemonVows Hochzeitsplanungs-App.

## Übersicht

Die bestehende LemonVows-Anwendung wird mit WeWeb als No-Code-Lösung erweitert, um es Nicht-Programmierern zu ermöglichen, alle Inhalte und Funktionen selbst anzupassen. Diese Integration behält die bestehenden Komponenten und Funktionen bei und erweitert sie mit den Möglichkeiten von WeWeb.

## Vorteile der WeWeb-Integration

- **Einfache Anpassung**: Texte, Bilder, Preise und grundlegende Funktionen können ohne Programmierkenntnisse geändert werden
- **Visuelle Entwicklung**: Drag-and-Drop-Interface für einfache UI-Änderungen
- **Datenintegration**: Nahtlose Verbindung mit der bestehenden Supabase-Datenbank
- **Responsive Design**: Automatische Anpassung an verschiedene Bildschirmgrößen
- **Schnelle Iteration**: Änderungen können sofort veröffentlicht werden

## Implementierungsplan

1. **WeWeb-Projekt einrichten**
   - Verbindung mit der bestehenden Supabase-Datenbank herstellen
   - Benutzerauthentifizierung konfigurieren
   - Datenmodelle importieren

2. **UI-Komponenten entwickeln**
   - Design mit Pastelltönen in Rosé, Weiß und Gold umsetzen
   - Responsive Layouts für alle Geräte erstellen
   - Bestehende Komponenten in WeWeb nachbilden

3. **Preisstufen implementieren**
   - Free Version (0€): Grundfunktionen für bis zu 20 Gäste
   - Basis (29,99€/Monat): Erweiterte Funktionen für bis zu 50 Gäste
   - Premium (89,99€/Monat): Alle Funktionen mit unbegrenzter Gästeanzahl
   - Deluxe (199,99€/Monat): Premium-Funktionen plus zusätzliche Features

4. **Kernfunktionen entwickeln**
   - Automatischer Zeitplangenerator
   - Gästemanagement mit RSVP-Tracking
   - Budget-Planung und -Verfolgung
   - Aufgabenlisten und Zeitpläne
   - Lieferantenmanagement
   - Sitzplatzplanung mit Drag-and-Drop
   - Fotogalerie mit Sharing-Optionen

5. **Testen und Deployment**
   - Umfassende Tests aller Funktionen
   - Deployment der WeWeb-Anwendung
   - Dokumentation für den Endbenutzer

## Technische Details

### WeWeb-Konfiguration

Die WeWeb-Integration wird folgende Konfigurationen verwenden:

- **Authentifizierung**: Integration mit Supabase Auth
- **Datenbank**: Verbindung zur bestehenden Supabase-Datenbank
- **API-Endpunkte**: Nutzung der bestehenden API-Endpunkte
- **Hosting**: Deployment über WeWeb-Hosting mit Custom Domain

### Datenmodelle

Die folgenden Datenmodelle werden in WeWeb integriert:

- Benutzer und Authentifizierung
- Gäste und RSVP-Status
- Budget und Ausgaben
- Aufgaben und Zeitpläne
- Lieferanten und Bewertungen
- Sitzplatzplanung
- Fotos und Medien

### Benutzerrollen

Die Anwendung unterstützt verschiedene Benutzerrollen:

- **Admin**: Vollständiger Zugriff auf alle Funktionen
- **Brautpaar**: Zugriff auf alle Hochzeitsplanungsfunktionen
- **Trauzeugen**: Eingeschränkter Zugriff auf bestimmte Bereiche
- **Gäste**: Nur Zugriff auf öffentliche Informationen und RSVP

## Entwicklungsfortschritt

- [x] Analyse des bestehenden Repositories
- [x] Untersuchung der bereitgestellten HTML-Version
- [x] Recherche zu WeWeb-Funktionen und -Möglichkeiten
- [x] Einrichtung der Entwicklungsumgebung
- [ ] Modifikation des bestehenden Repositories für WeWeb
- [ ] Einrichtung des WeWeb-Projekts
- [ ] Design der App-UI-Komponenten
- [ ] Implementierung der Preisstufen
- [ ] Entwicklung der Kernfunktionen
- [ ] Tests und Deployment
