# Konfigurationsanleitung für die LemonVows Hochzeitsplanungs-App

Diese Anleitung beschreibt, wie Sie die LemonVows Hochzeitsplanungs-App konfigurieren und die neuen Funktionen (JGA-Planungsmodul und Hochzeitshomepage) einrichten können. Die Anleitung ist speziell für Nicht-Programmierer konzipiert und führt Sie Schritt für Schritt durch den Prozess.

## Inhaltsverzeichnis

1. [Erste Schritte](#erste-schritte)
   - [Anmeldung und Zugang](#anmeldung-und-zugang)
   - [Dashboard-Übersicht](#dashboard-übersicht)

2. [JGA-Planungsmodul konfigurieren](#jga-planungsmodul-konfigurieren)
   - [Grundeinstellungen](#grundeinstellungen-jga)
   - [Teilnehmer einladen](#teilnehmer-einladen-jga)
   - [Berechtigungen verwalten](#berechtigungen-verwalten-jga)
   - [Module aktivieren und deaktivieren](#module-aktivieren-und-deaktivieren)

3. [Hochzeitshomepage konfigurieren](#hochzeitshomepage-konfigurieren)
   - [Grundeinstellungen](#grundeinstellungen-homepage)
   - [Design und Theme auswählen](#design-und-theme-auswählen)
   - [Inhalte hinzufügen](#inhalte-hinzufügen)
   - [Berechtigungen verwalten](#berechtigungen-verwalten-homepage)
   - [Veröffentlichung und Teilen](#veröffentlichung-und-teilen)

4. [WeWeb-Integration nutzen](#weweb-integration-nutzen)
   - [Zugriff auf WeWeb](#zugriff-auf-weweb)
   - [Komponenten anpassen](#komponenten-anpassen)
   - [Änderungen veröffentlichen](#änderungen-veröffentlichen)

5. [Häufige Fragen und Problemlösungen](#häufige-fragen-und-problemlösungen)

## Erste Schritte

### Anmeldung und Zugang

1. Öffnen Sie einen Webbrowser und navigieren Sie zur LemonVows Hochzeitsplanungs-App unter: https://hochzeitsapp-really.vercel.app/login

2. Melden Sie sich mit Ihren Zugangsdaten an. Falls Sie noch kein Konto haben, klicken Sie auf "Registrieren" und folgen Sie den Anweisungen zur Kontoerstellung.

3. Nach erfolgreicher Anmeldung werden Sie zum Hauptdashboard weitergeleitet, wo Sie Zugriff auf alle Funktionen der App haben.

### Dashboard-Übersicht

Das Dashboard ist in verschiedene Bereiche unterteilt:

- **Meine Hochzeit**: Hier finden Sie alle Funktionen zur Planung Ihrer Hochzeit.
- **JGA-Planung**: Hier können Sie den Junggesellen- oder Junggesellinnenabschied planen.
- **Hochzeitshomepage**: Hier können Sie Ihre persönliche Hochzeitshomepage erstellen und verwalten.
- **Einstellungen**: Hier können Sie Ihr Profil und allgemeine Einstellungen verwalten.

Klicken Sie auf den jeweiligen Bereich, um zu den entsprechenden Funktionen zu gelangen.

## JGA-Planungsmodul konfigurieren

### Grundeinstellungen JGA

1. Klicken Sie im Dashboard auf "JGA-Planung".

2. Wenn Sie zum ersten Mal auf diesen Bereich zugreifen, werden Sie aufgefordert, einen neuen JGA zu erstellen. Klicken Sie auf "JGA erstellen".

3. Füllen Sie das Formular mit den grundlegenden Informationen aus:
   - **Name des JGA**: Geben Sie einen Namen für den JGA ein (z.B. "JGA von Lisa").
   - **Für wen**: Wählen Sie, ob es sich um einen JGA für die Braut oder den Bräutigam handelt.
   - **Voraussichtliches Datum**: Geben Sie ein vorläufiges Datum ein (kann später geändert werden).
   - **Beschreibung**: Fügen Sie optional eine kurze Beschreibung hinzu.

4. Klicken Sie auf "Speichern", um den JGA zu erstellen.

5. Sie werden zum JGA-Dashboard weitergeleitet, wo Sie alle Module des JGA-Planungstools sehen.

### Teilnehmer einladen JGA

1. Klicken Sie im JGA-Dashboard auf "Teilnehmer verwalten".

2. Klicken Sie auf "Teilnehmer hinzufügen".

3. Geben Sie die E-Mail-Adressen der Personen ein, die Sie einladen möchten. Sie können mehrere E-Mail-Adressen durch Kommas getrennt eingeben.

4. Wählen Sie die Rolle für die eingeladenen Personen:
   - **Organisator**: Kann alles bearbeiten und weitere Teilnehmer einladen.
   - **Teilnehmer**: Kann an der Planung teilnehmen, aber keine grundlegenden Einstellungen ändern.
   - **Gast**: Kann nur Informationen sehen, aber nichts bearbeiten.

5. Fügen Sie optional eine persönliche Nachricht hinzu.

6. Klicken Sie auf "Einladungen senden".

7. Die eingeladenen Personen erhalten eine E-Mail mit einem Link, über den sie der JGA-Planung beitreten können.

### Berechtigungen verwalten JGA

1. Klicken Sie im JGA-Dashboard auf "Berechtigungen".

2. Hier sehen Sie eine Liste aller Personen, die Zugriff auf die JGA-Planung haben, zusammen mit ihren aktuellen Berechtigungen.

3. Um Berechtigungen zu ändern, klicken Sie auf das Bearbeiten-Symbol neben der entsprechenden Person.

4. Wählen Sie die neue Rolle aus dem Dropdown-Menü:
   - **Besitzer**: Vollständiger Zugriff, kann alles bearbeiten und löschen.
   - **Administrator**: Kann alles bearbeiten, aber nicht löschen.
   - **Bearbeiter**: Kann Inhalte hinzufügen und bearbeiten.
   - **Betrachter**: Kann nur ansehen, aber nichts bearbeiten.

5. Klicken Sie auf "Speichern", um die Änderungen zu übernehmen.

6. Um jemandem den Zugriff zu entziehen, klicken Sie auf das Löschen-Symbol neben der Person und bestätigen Sie die Aktion.

### Module aktivieren und deaktivieren

1. Klicken Sie im JGA-Dashboard auf "Einstellungen".

2. Scrollen Sie zum Abschnitt "Module".

3. Hier können Sie die verschiedenen Module des JGA-Planungstools aktivieren oder deaktivieren:
   - **Terminplanung**: Für die Abstimmung über das JGA-Datum.
   - **Budgetverwaltung**: Für die Verwaltung und Aufteilung der Kosten.
   - **Aktivitätenplanung**: Für die Planung von Aktivitäten.
   - **Aufgabenzuweisung**: Für die Zuweisung von Aufgaben an Teilnehmer.
   - **Überraschungsideensammlung**: Für das Sammeln von Überraschungsideen.
   - **Einladungs- und RSVP-Management**: Für die Verwaltung von Einladungen.
   - **JGA-Fotogalerie**: Für das Teilen von Fotos.

4. Aktivieren oder deaktivieren Sie die Module nach Bedarf, indem Sie die entsprechenden Schalter umlegen.

5. Klicken Sie auf "Speichern", um die Änderungen zu übernehmen.

## Hochzeitshomepage konfigurieren

### Grundeinstellungen Homepage

1. Klicken Sie im Dashboard auf "Hochzeitshomepage".

2. Wenn Sie zum ersten Mal auf diesen Bereich zugreifen, werden Sie aufgefordert, eine neue Homepage zu erstellen. Klicken Sie auf "Homepage erstellen".

3. Füllen Sie das Formular mit den grundlegenden Informationen aus:
   - **Namen des Brautpaares**: Geben Sie die Namen des Brautpaares ein (z.B. "Lisa & Max").
   - **Hochzeitsdatum**: Wählen Sie das Datum der Hochzeit aus.
   - **Willkommenstext**: Schreiben Sie einen kurzen Willkommenstext für Ihre Gäste.
   - **Kontakt-E-Mail**: Geben Sie eine E-Mail-Adresse an, unter der Gäste Sie bei Fragen erreichen können.

4. Klicken Sie auf "Speichern", um die Homepage zu erstellen.

5. Sie werden zum Homepage-Dashboard weitergeleitet, wo Sie alle Funktionen der Hochzeitshomepage sehen.

### Design und Theme auswählen

1. Klicken Sie im Homepage-Dashboard auf den Tab "Design".

2. Wählen Sie ein Theme aus der Galerie aus, indem Sie darauf klicken. Sie sehen eine Vorschau des Themes.

3. Nachdem Sie ein Theme ausgewählt haben, können Sie es anpassen:
   - **Farbschema**: Wählen Sie Ihre Hauptfarbe und Akzentfarbe.
   - **Schriftarten**: Wählen Sie Schriftarten für Überschriften und Text.
   - **Hintergrund**: Wählen Sie ein Hintergrundbild oder eine Hintergrundfarbe.
   - **Header-Bild**: Laden Sie ein Bild für den Header-Bereich hoch.

4. Nutzen Sie die Vorschau-Funktion, um zu sehen, wie Ihre Änderungen aussehen.

5. Klicken Sie auf "Speichern", um das Design zu übernehmen.

### Inhalte hinzufügen

Ihre Hochzeitshomepage besteht aus verschiedenen Abschnitten, die Sie individuell befüllen können:

1. **Events**: Klicken Sie auf den Tab "Events", um Veranstaltungen hinzuzufügen.
   - Klicken Sie auf "Event hinzufügen".
   - Geben Sie Titel, Datum, Uhrzeit, Ort und Beschreibung ein.
   - Markieren Sie Hauptveranstaltungen entsprechend.
   - Klicken Sie auf "Speichern".

2. **Galerie**: Klicken Sie auf den Tab "Galerie", um Fotos hochzuladen.
   - Klicken Sie auf "Fotos hinzufügen".
   - Wählen Sie Fotos von Ihrem Computer aus.
   - Fügen Sie optional Titel und Beschreibungen hinzu.
   - Organisieren Sie die Fotos in Alben.
   - Klicken Sie auf "Hochladen".

3. **FAQ**: Klicken Sie auf den Tab "FAQ", um häufig gestellte Fragen hinzuzufügen.
   - Klicken Sie auf "FAQ hinzufügen".
   - Geben Sie die Frage und die Antwort ein.
   - Klicken Sie auf "Speichern".

4. **Geschenke**: Klicken Sie auf den Tab "Geschenke", um Ihre Wunschliste zu erstellen.
   - Klicken Sie auf "Geschenk hinzufügen".
   - Geben Sie Titel, Beschreibung, Preis und optional einen Link ein.
   - Fügen Sie ein Bild hinzu, wenn verfügbar.
   - Klicken Sie auf "Speichern".

5. **RSVP**: Klicken Sie auf den Tab "RSVP", um das Antwortformular anzupassen.
   - Passen Sie die Fragen und Optionen an.
   - Legen Sie fest, bis wann Antworten möglich sind.
   - Klicken Sie auf "Speichern".

6. **Unterkünfte**: Klicken Sie auf den Tab "Unterkünfte", um Übernachtungsmöglichkeiten hinzuzufügen.
   - Klicken Sie auf "Unterkunft hinzufügen".
   - Geben Sie Name, Adresse, Preiskategorie und Beschreibung ein.
   - Fügen Sie einen Link zur Buchung hinzu.
   - Klicken Sie auf "Speichern".

7. **Gästebuch**: Klicken Sie auf den Tab "Gästebuch", um das Gästebuch zu konfigurieren.
   - Legen Sie fest, ob Einträge moderiert werden sollen.
   - Passen Sie die Einstellungen für Fotos und Benachrichtigungen an.
   - Klicken Sie auf "Speichern".

8. **Karte**: Klicken Sie auf den Tab "Karte", um die interaktive Karte einzurichten.
   - Geben Sie die Adressen der wichtigen Orte ein.
   - Fügen Sie Informationen zu Parkmöglichkeiten hinzu.
   - Klicken Sie auf "Speichern".

9. **Countdown**: Klicken Sie auf den Tab "Countdown", um den Countdown anzupassen.
   - Wählen Sie ein Design für den Countdown.
   - Legen Sie fest, wo der Countdown angezeigt werden soll.
   - Klicken Sie auf "Speichern".

### Berechtigungen verwalten Homepage

1. Klicken Sie im Homepage-Dashboard auf den Tab "Einstellungen" und dann auf "Berechtigungen".

2. Hier sehen Sie eine Liste aller Personen, die Zugriff auf die Hochzeitshomepage haben, zusammen mit ihren aktuellen Berechtigungen.

3. Um jemandem Zugriff zu gewähren, klicken Sie auf "Berechtigung hinzufügen".
   - Geben Sie die E-Mail-Adresse der Person ein.
   - Wählen Sie die Rolle aus dem Dropdown-Menü.
   - Klicken Sie auf "Hinzufügen".

4. Um Berechtigungen zu ändern, klicken Sie auf das Bearbeiten-Symbol neben der entsprechenden Person.
   - Wählen Sie die neue Rolle aus dem Dropdown-Menü.
   - Klicken Sie auf "Speichern".

5. Um jemandem den Zugriff zu entziehen, klicken Sie auf das Löschen-Symbol neben der Person und bestätigen Sie die Aktion.

### Veröffentlichung und Teilen

1. Wenn Ihre Hochzeitshomepage fertig ist, klicken Sie im Homepage-Dashboard auf den Tab "Einstellungen" und dann auf "Veröffentlichung".

2. Überprüfen Sie Ihre Homepage mit der Vorschau-Funktion.

3. Wenn alles in Ordnung ist, klicken Sie auf "Veröffentlichen".

4. Nach der Veröffentlichung erhalten Sie eine URL, die Sie mit Ihren Gästen teilen können.

5. Sie können die URL auf verschiedene Arten teilen:
   - Kopieren Sie die URL und teilen Sie sie direkt.
   - Nutzen Sie die E-Mail-Funktion, um die URL per E-Mail zu versenden.
   - Erstellen Sie einen QR-Code, den Sie auf Ihre Einladungen drucken können.

6. Sie können Ihre Homepage jederzeit aktualisieren. Die Änderungen werden automatisch auf der veröffentlichten Seite angezeigt.

7. Um die Veröffentlichung rückgängig zu machen, klicken Sie auf "Deaktivieren".

## WeWeb-Integration nutzen

Die LemonVows Hochzeitsplanungs-App ist mit WeWeb als No-Code-Lösung integriert, was es Ihnen ermöglicht, die App ohne Programmierkenntnisse anzupassen.

### Zugriff auf WeWeb

1. Klicken Sie im Hauptdashboard auf "Einstellungen" und dann auf "WeWeb-Integration".

2. Klicken Sie auf "WeWeb-Editor öffnen".

3. Sie werden zum WeWeb-Dashboard weitergeleitet, wo Sie sich anmelden müssen. Verwenden Sie dieselben Zugangsdaten wie für die LemonVows App.

4. Nach der Anmeldung sehen Sie das LemonVows-Projekt im WeWeb-Dashboard.

### Komponenten anpassen

1. Klicken Sie im WeWeb-Dashboard auf das LemonVows-Projekt, um es zu öffnen.

2. Sie sehen nun den visuellen Editor mit allen Komponenten der App.

3. Um eine Komponente zu bearbeiten:
   - Klicken Sie auf die Komponente, die Sie ändern möchten.
   - Im rechten Bereich erscheinen die Eigenschaften der Komponente.
   - Ändern Sie die Eigenschaften nach Bedarf (z.B. Text, Farbe, Größe).

4. Um eine neue Komponente hinzuzufügen:
   - Ziehen Sie die gewünschte Komponente aus der linken Seitenleiste auf die Seite.
   - Positionieren Sie die Komponente an der gewünschten Stelle.
   - Passen Sie die Eigenschaften der Komponente an.

5. Um eine Komponente zu löschen:
   - Klicken Sie auf die Komponente, die Sie löschen möchten.
   - Drücken Sie die Entf-Taste oder klicken Sie auf das Löschen-Symbol.

### Änderungen veröffentlichen

1. Nachdem Sie Ihre Änderungen vorgenommen haben, klicken Sie auf "Vorschau", um sie zu überprüfen.

2. Wenn alles in Ordnung ist, klicken Sie auf "Veröffentlichen".

3. Wählen Sie die Umgebung aus, in der Sie veröffentlichen möchten (in der Regel "Produktion").

4. Klicken Sie auf "Veröffentlichen", um die Änderungen live zu schalten.

5. Ihre Änderungen sind nun in der LemonVows App sichtbar.

## Häufige Fragen und Problemlösungen

### Ich kann mich nicht anmelden

- Überprüfen Sie, ob Sie die richtige E-Mail-Adresse und das richtige Passwort verwenden.
- Klicken Sie auf "Passwort vergessen", um Ihr Passwort zurückzusetzen.
- Stellen Sie sicher, dass Ihre Internetverbindung stabil ist.

### Ich kann keine Fotos hochladen

- Überprüfen Sie, ob die Dateigröße unter 10 MB liegt.
- Unterstützte Dateiformate sind JPG, PNG und GIF.
- Versuchen Sie, den Browser zu aktualisieren oder einen anderen Browser zu verwenden.

### Meine Gäste können nicht auf die Homepage zugreifen

- Stellen Sie sicher, dass die Homepage veröffentlicht ist.
- Überprüfen Sie, ob Sie die korrekte URL geteilt haben.
- Prüfen Sie, ob die Gäste eine stabile Internetverbindung haben.

### Ich möchte ein Feature hinzufügen, das nicht verfügbar ist

- Einige Funktionen können über die WeWeb-Integration hinzugefügt werden.
- Für komplexere Anforderungen kontaktieren Sie bitte den Support.

### Ich habe Änderungen in WeWeb vorgenommen, aber sie sind nicht sichtbar

- Stellen Sie sicher, dass Sie die Änderungen veröffentlicht haben.
- Es kann einige Minuten dauern, bis die Änderungen sichtbar werden.
- Leeren Sie den Cache Ihres Browsers und laden Sie die Seite neu.

### Ich möchte meine Homepage löschen

- Gehen Sie zu "Einstellungen" > "Allgemein".
- Scrollen Sie nach unten zum Abschnitt "Gefahrenzone".
- Klicken Sie auf "Homepage löschen" und bestätigen Sie die Aktion.
- Beachten Sie, dass diese Aktion nicht rückgängig gemacht werden kann.

---

Bei weiteren Fragen oder Problemen wenden Sie sich bitte an unseren Support unter support@lemonvows.com oder nutzen Sie die Chat-Funktion in der App.
