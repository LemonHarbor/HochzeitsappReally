# Anpassungsleitfaden für LemonVows

Dieser Leitfaden erklärt, wie du deine LemonVows Hochzeitsapp anpassen kannst, ohne Programmierkenntnisse zu benötigen.

## Inhaltsverzeichnis
1. Einführung
2. Supabase-Einrichtung
3. App-Anpassungen
4. Designanpassungen
5. Funktionsanpassungen
6. Häufige Fragen

## 1. Einführung

LemonVows ist eine anpassbare Hochzeitsplanungs-App, die du nach deinen Wünschen gestalten kannst. Die meisten Anpassungen können über die Benutzeroberfläche oder durch einfache Konfigurationsdateien vorgenommen werden.

## 2. Supabase-Einrichtung

Die App verwendet Supabase als Datenbank. Hier ist, wie du deine eigene Supabase-Instanz einrichtest:

1. Gehe zu [supabase.com](https://supabase.com) und erstelle ein kostenloses Konto
2. Erstelle ein neues Projekt
3. Kopiere die Projekt-URL und den anonymen Schlüssel
4. Füge diese Werte in deine Vercel-Umgebungsvariablen ein:
   - `VITE_SUPABASE_URL`: Deine Supabase-Projekt-URL
   - `VITE_SUPABASE_ANON_KEY`: Dein Supabase anonymer Schlüssel

## 3. App-Anpassungen

### Allgemeine Informationen

1. Melde dich in der App an (Standardzugang: "Gast-Zugang" mit beliebigem Code)
2. Gehe zu "Einstellungen" > "Hochzeitsdetails"
3. Hier kannst du folgende Informationen anpassen:
   - Namen des Brautpaars
   - Hochzeitsdatum
   - Veranstaltungsort
   - Kontaktinformationen
   - Farbschema der App

### Gästeverwaltung

1. Gehe zum Menüpunkt "Gästeverwaltung"
2. Hier kannst du:
   - Gäste hinzufügen, bearbeiten oder löschen
   - Gäste in Kategorien einteilen
   - RSVP-Status verfolgen
   - Diätbeschränkungen und Notizen verwalten

### Tischplanung

1. Gehe zum Menüpunkt "Tischplanung"
2. Hier kannst du:
   - Tische hinzufügen und positionieren
   - Gäste den Tischen zuweisen
   - Tischgruppen erstellen
   - Die Sitzordnung visualisieren

## 4. Designanpassungen

### Farbschema

1. Gehe zu "Einstellungen" > "Design"
2. Wähle aus vordefinierten Farbschemata oder erstelle dein eigenes
3. Vorschau der Änderungen wird in Echtzeit angezeigt

### Logo und Bilder

1. Gehe zu "Einstellungen" > "Medien"
2. Lade dein eigenes Logo, Hintergrundbild oder Fotos hoch
3. Passe die Bildpositionen und -größen an

## 5. Funktionsanpassungen

### E-Mail-Benachrichtigungen

1. Gehe zu "Einstellungen" > "Benachrichtigungen"
2. Aktiviere oder deaktiviere verschiedene E-Mail-Benachrichtigungen:
   - RSVP-Bestätigungen
   - Erinnerungen
   - Updates für Gäste

### Gästebereich

1. Gehe zu "Einstellungen" > "Gästebereich"
2. Passe an, welche Informationen für Gäste sichtbar sind:
   - Zeitplan
   - Anfahrtsbeschreibung
   - Unterkunftsoptionen
   - Geschenkliste

## 6. Häufige Fragen

**F: Wie kann ich die App in einer anderen Sprache anzeigen?**
A: Gehe zu "Einstellungen" > "Sprache" und wähle deine bevorzugte Sprache aus.

**F: Kann ich die App offline nutzen?**
A: Ja, grundlegende Funktionen sind auch offline verfügbar. Für die vollständige Funktionalität wird jedoch eine Internetverbindung benötigt.

**F: Wie kann ich Änderungen rückgängig machen?**
A: Die meisten Aktionen haben eine "Rückgängig"-Option. Du findest auch einen Verlauf unter "Einstellungen" > "Aktivitäten".

**F: Wie kann ich weitere Anpassungen vornehmen, die nicht in der Benutzeroberfläche verfügbar sind?**
A: Für fortgeschrittene Anpassungen kontaktiere bitte den Support oder konsultiere einen Entwickler.

---

Bei weiteren Fragen oder Unterstützungsbedarf stehe ich dir gerne zur Verfügung!
