# LemonVows by LemonHarbor - Dokumentation

Diese Dokumentation enthält alle wichtigen Informationen zu den Änderungen und Verbesserungen, die an der LemonVows-Anwendung vorgenommen wurden.

## Inhaltsverzeichnis

1. [Übersicht der Änderungen](#übersicht-der-änderungen)
2. [Behebung der Klick-Interaktionsprobleme](#behebung-der-klick-interaktionsprobleme)
3. [Implementierung des Entwicklermodus](#implementierung-des-entwicklermodus)
4. [Login-Funktionalität](#login-funktionalität)
5. [Landingpage](#landingpage)
6. [WeWeb-Integration](#weweb-integration)
7. [Preisstruktur](#preisstruktur)
8. [Mobile Optimierung](#mobile-optimierung)
9. [SEO-Optimierungen](#seo-optimierungen)
10. [Bekannte Probleme und Lösungen](#bekannte-probleme-und-lösungen)

## Übersicht der Änderungen

Die folgenden Hauptänderungen wurden an der LemonVows-Anwendung vorgenommen:

- **Branding**: Aktualisierung des Namens auf "LemonVows by LemonHarbor"
- **Klick-Interaktionen**: Behebung von Problemen, die Benutzerinteraktionen verhinderten
- **Entwicklermodus**: Verbesserung des Zugriffs und der Funktionalität
- **Login-System**: Implementierung einer funktionierenden Anmeldung
- **Landingpage**: Erstellung einer professionellen, responsiven Landingpage
- **WeWeb-Integration**: Hinzufügung einer No-Code-Bearbeitungsoption
- **Preisstruktur**: Anpassung der Preise, um den Funktionsumfang besser widerzuspiegeln
- **Mobile Optimierung**: Verbesserung der Benutzeroberfläche für mobile Geräte
- **SEO**: Implementierung von Optimierungen für Suchmaschinen

## Behebung der Klick-Interaktionsprobleme

### Problem

Nach dem Deployment auf Vercel funktionierten keine Klick-Interaktionen in der App. Benutzer konnten auf keine Elemente klicken, was die grundlegende Funktionalität der Anwendung beeinträchtigte.

### Lösung

Die Klick-Interaktionsprobleme wurden durch mehrere Maßnahmen behoben:

1. **CSS-Fixes**: Implementierung von CSS-Regeln, die sicherstellen, dass alle Elemente korrekte `pointer-events`-Werte haben:
   ```css
   * {
     pointer-events: auto !important;
   }
   ```

2. **JavaScript-Fixes**: Hinzufügung von JavaScript-Code, der dynamisch alle interaktiven Elemente identifiziert und sicherstellt, dass sie klickbar sind:
   ```javascript
   const makeClickable = () => {
     const elements = document.querySelectorAll('button, a, input, select, textarea, [role="button"]');
     elements.forEach(el => {
       el.style.pointerEvents = 'auto';
       el.style.cursor = 'pointer';
     });
   };
   ```

3. **Event-Debugging**: Implementierung von Debugging-Code, der Klick-Events protokolliert, um Probleme leichter zu identifizieren:
   ```javascript
   document.addEventListener('click', (e) => {
     console.log('Click detected at:', e.clientX, e.clientY);
     console.log('Target:', e.target);
   }, true);
   ```

4. **Overlay-Entfernung**: Identifizierung und Entfernung von Overlay-Elementen, die Klicks blockieren könnten:
   ```javascript
   const overlays = document.querySelectorAll('.overlay, .modal-backdrop, [style*="position: fixed"]');
   overlays.forEach(overlay => {
     if (overlay instanceof HTMLElement) {
       overlay.style.pointerEvents = 'none';
     }
   });
   ```

Diese Änderungen wurden in der `index.html`-Datei und in der `App.tsx`-Komponente implementiert.

## Implementierung des Entwicklermodus

### Funktionalität

Der Entwicklermodus bietet Administratoren Zugriff auf erweiterte Funktionen und Einstellungen:

1. **Aktivierung**: Der Entwicklermodus kann über einen Button in der unteren rechten Ecke der Anmeldeseite aktiviert werden.

2. **Visuelle Indikatoren**: Wenn der Entwicklermodus aktiv ist, wird dies durch folgende Elemente angezeigt:
   - Ein temporäres Benachrichtigungsfenster
   - Ein permanenter Indikator in der unteren rechten Ecke
   - Eine Klasse `developer-mode` auf dem `body`-Element für globale Styling-Änderungen

3. **Persistenz**: Der Status des Entwicklermodus wird in `localStorage` gespeichert, sodass er zwischen Sitzungen erhalten bleibt.

4. **API**: Der Entwicklermodus bietet folgende Funktionen:
   - `isDeveloperMode`: Boolean-Wert, der angibt, ob der Modus aktiv ist
   - `toggleDeveloperMode()`: Funktion zum Umschalten des Modus
   - `enableDeveloperMode()`: Funktion zum Aktivieren des Modus
   - `disableDeveloperMode()`: Funktion zum Deaktivieren des Modus

Die Implementierung befindet sich in der Datei `src/lib/developer.tsx`.

## Login-Funktionalität

Die Login-Funktionalität wurde verbessert, um eine reibungslose Benutzeranmeldung zu ermöglichen:

1. **Benutzeroberfläche**: Die Login-Seite bietet Eingabefelder für E-Mail und Passwort sowie Optionen für Passwort vergessen und Registrierung.

2. **Funktionalität**: Die Login-Logik speichert den Authentifizierungsstatus in `localStorage` und leitet den Benutzer nach erfolgreicher Anmeldung zum Dashboard weiter.

3. **Feedback**: Benutzer erhalten klares Feedback durch Warnmeldungen bei erfolgreicher Anmeldung oder Fehlern.

4. **Gastzugang**: Es gibt eine Option für Gäste, mit einem Einladungscode auf die Hochzeitsinformationen zuzugreifen.

Die Implementierung befindet sich in der Datei `src/pages/login.tsx`.

## Landingpage

Die neue Landingpage präsentiert LemonVows professionell und ansprechend:

1. **Struktur**: Die Landingpage besteht aus folgenden Abschnitten:
   - Hero-Bereich mit prägnanter Headline und Call-to-Action
   - Funktionen-Bereich mit Icons und Beschreibungen
   - Testimonials von zufriedenen Nutzern
   - Preisgestaltung und Pakete
   - FAQ-Bereich
   - Kontaktformular und Footer

2. **Design**: Das Design verwendet das gewünschte Farbschema in Rosé, Weiß und Gold und ist modern und elegant.

3. **Responsive Design**: Die Landingpage ist vollständig responsiv und für alle Geräte (Desktop, Tablet, Mobil) optimiert.

4. **Integration**: Die Landingpage ist nahtlos in die Hauptanwendung integriert und wird automatisch für nicht authentifizierte Benutzer angezeigt.

Die Implementierung befindet sich im Verzeichnis `src/pages/landing/`.

## WeWeb-Integration

Für Benutzer ohne Programmierkenntnisse wurde eine WeWeb-Integration hinzugefügt:

1. **Komponente**: Die `WeWebIntegration`-Komponente bietet eine Benutzeroberfläche für die Verbindung mit WeWeb.

2. **Zugriff**: Die Integration ist nur im Entwicklermodus verfügbar.

3. **Funktionen**: Die Integration bietet:
   - Einen Button zum Verbinden mit WeWeb
   - Einen Link zur WeWeb-Dokumentation
   - Statusinformationen zur Verbindung

4. **Anleitung**: Eine umfassende Anleitung (`NO_CODE_ANLEITUNG.md`) erklärt, wie WeWeb zur Bearbeitung der Anwendung ohne Programmierkenntnisse verwendet werden kann.

Die Implementierung befindet sich in der Datei `src/components/WeWebIntegration.tsx`.

## Preisstruktur

Die Preisstruktur wurde aktualisiert, um den umfangreichen Funktionsumfang besser widerzuspiegeln:

1. **Basis-Plan**: 29,99€/Monat
   - Gästemanagement (bis zu 50 Gäste)
   - Einfache Budgetverfolgung
   - Grundlegende Aufgabenlisten
   - Einfache Sitzplatzplanung
   - 14 Tage Testphase für Premium-Funktionen

2. **Premium-Plan**: 89,99€/Monat
   - Unbegrenzte Gästeverwaltung mit RSVP-Tracking
   - Detaillierte Budgetverfolgung mit Berichten
   - Erweiterte Aufgabenlisten mit Erinnerungen
   - Lieferantenmanagement und -bewertungen
   - Interaktive Sitzplatzplanung
   - Fotogalerie für Hochzeitsfotos
   - Prioritäts-Support

3. **Deluxe-Plan**: 199,99€/Monat
   - Alle Premium-Funktionen
   - Persönlicher Hochzeitsplaner-Assistent
   - Exklusive Design-Vorlagen
   - Hochzeitswebsite mit eigenem Domain
   - Unbegrenzte Fotospeicherung
   - KI-gestützter Hochzeitsredengenerator
   - NFT-Gästebuch für digitale Erinnerungen
   - Prioritäts-Support rund um die Uhr

Die Implementierung befindet sich in der Datei `src/pages/landing/sections/Pricing.tsx`.

## Mobile Optimierung

Die mobile Benutzeroberfläche wurde erheblich verbessert:

1. **Responsive Design**: Alle Komponenten passen sich automatisch an verschiedene Bildschirmgrößen an.

2. **Mobile-First-Ansatz**: Das Design wurde mit einem Mobile-First-Ansatz entwickelt, um eine optimale Darstellung auf Smartphones zu gewährleisten.

3. **Touch-Optimierung**: Interaktive Elemente wurden für Touch-Eingaben optimiert, mit ausreichend großen Zielbereichen.

4. **Performance**: Die Ladezeiten wurden für mobile Geräte optimiert, um eine schnelle Benutzererfahrung zu gewährleisten.

Die mobile Optimierung wurde durch CSS-Media-Queries in den Dateien `src/pages/landing/landing.css` und `src/pages/landing/mobile.css` implementiert.

## SEO-Optimierungen

Für eine bessere Sichtbarkeit in Suchmaschinen wurden folgende SEO-Optimierungen implementiert:

1. **Meta-Tags**: Hinzufügung von relevanten Meta-Tags für Titel, Beschreibung und Keywords.

2. **Strukturierte Daten**: Implementierung von strukturierten Daten für eine bessere Darstellung in Suchergebnissen.

3. **Sitemap**: Erstellung einer Sitemap für Suchmaschinen-Crawler.

4. **robots.txt**: Konfiguration einer robots.txt-Datei für die Steuerung des Crawler-Verhaltens.

5. **Semantisches HTML**: Verwendung von semantischem HTML für eine bessere Zugänglichkeit und SEO.

Die SEO-Optimierungen wurden in der `index.html`-Datei und durch die Komponenten in `src/components/SEO.tsx` und `src/components/ImageWithSEO.tsx` implementiert.

## Bekannte Probleme und Lösungen

### Problem: Vercel-Deployment zeigt leere Seite

**Symptom**: Nach dem Deployment auf Vercel wird eine leere Seite angezeigt.

**Lösung**: 
1. Stellen Sie sicher, dass die Vercel-Konfiguration korrekt ist:
   - Überprüfen Sie die `vercel.json`-Datei
   - Stellen Sie sicher, dass der Build-Befehl korrekt ist
   - Überprüfen Sie die Umgebungsvariablen

2. Wenn das Problem weiterhin besteht, versuchen Sie:
   - Löschen Sie den `.next`-Ordner und führen Sie einen neuen Build durch
   - Überprüfen Sie die Vercel-Logs auf spezifische Fehler
   - Stellen Sie sicher, dass alle erforderlichen Abhängigkeiten installiert sind

### Problem: Entwicklermodus wird nicht aktiviert

**Symptom**: Der Entwicklermodus wird nicht aktiviert, wenn der Toggle-Button geklickt wird.

**Lösung**:
1. Überprüfen Sie die Browser-Konsole auf Fehler
2. Stellen Sie sicher, dass `localStorage` verfügbar ist und funktioniert
3. Versuchen Sie, den Entwicklermodus manuell zu aktivieren:
   ```javascript
   localStorage.setItem('devMode', 'true');
   window.location.reload();
   ```

### Problem: Login funktioniert nicht

**Symptom**: Die Anmeldung funktioniert nicht, obwohl gültige Anmeldedaten eingegeben wurden.

**Lösung**:
1. Überprüfen Sie die Browser-Konsole auf Fehler
2. Stellen Sie sicher, dass `localStorage` verfügbar ist und funktioniert
3. Versuchen Sie, sich manuell anzumelden:
   ```javascript
   localStorage.setItem('authenticated', 'true');
   window.location.href = '/';
   ```

---

Diese Dokumentation wird regelmäßig aktualisiert, um neue Funktionen und Verbesserungen zu berücksichtigen. Letzte Aktualisierung: März 2025.
