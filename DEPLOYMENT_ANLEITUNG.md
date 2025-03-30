# LemonVows by LemonHarbor - Deployment-Anleitung

Diese Anleitung erklärt, wie Sie Ihre LemonVows-Anwendung auf Vercel deployen und verwalten können.

## Inhaltsverzeichnis

1. [Voraussetzungen](#voraussetzungen)
2. [GitHub-Repository aktualisieren](#github-repository-aktualisieren)
3. [Vercel-Deployment](#vercel-deployment)
4. [Deployment-Einstellungen anpassen](#deployment-einstellungen-anpassen)
5. [Umgebungsvariablen konfigurieren](#umgebungsvariablen-konfigurieren)
6. [Domains und SSL](#domains-und-ssl)
7. [Deployment-Logs überprüfen](#deployment-logs-überprüfen)
8. [Rollbacks durchführen](#rollbacks-durchführen)
9. [Häufige Probleme und Lösungen](#häufige-probleme-und-lösungen)

## Voraussetzungen

Bevor Sie mit dem Deployment beginnen, stellen Sie sicher, dass Sie Folgendes haben:

- Ein GitHub-Konto mit Zugriff auf das [LemonVows-Repository](https://github.com/LemonHarbor/HochzeitsappReally)
- Ein Vercel-Konto (kostenlos verfügbar unter [vercel.com](https://vercel.com))
- Grundlegende Kenntnisse über Git und Deployment-Prozesse (oder folgen Sie einfach dieser Anleitung)

## GitHub-Repository aktualisieren

Wenn Sie Änderungen an Ihrer Anwendung vornehmen möchten, können Sie dies auf zwei Arten tun:

### 1. Über die GitHub-Weboberfläche

1. Navigieren Sie zum [LemonVows-Repository](https://github.com/LemonHarbor/HochzeitsappReally)
2. Klicken Sie auf die Datei, die Sie bearbeiten möchten
3. Klicken Sie auf den Stift-Button, um die Datei zu bearbeiten
4. Nehmen Sie Ihre Änderungen vor
5. Scrollen Sie nach unten und geben Sie eine Commit-Nachricht ein (z.B. "Preise aktualisiert")
6. Klicken Sie auf "Commit changes"

### 2. Über WeWeb (No-Code)

Folgen Sie der [NO_CODE_ANLEITUNG.md](NO_CODE_ANLEITUNG.md) für detaillierte Anweisungen zur Verwendung von WeWeb.

## Vercel-Deployment

Vercel ist mit GitHub verbunden und deployt automatisch neue Versionen, wenn Änderungen gepusht werden:

1. **Automatisches Deployment**: Jedes Mal, wenn Sie Änderungen in das GitHub-Repository pushen, erkennt Vercel diese und startet automatisch einen neuen Build-Prozess.

2. **Deployment-Status**: Sie können den Status des Deployments im Vercel-Dashboard überprüfen:
   - Gehen Sie zu [vercel.com](https://vercel.com) und melden Sie sich an
   - Wählen Sie das "HochzeitsappReally"-Projekt
   - Unter "Deployments" sehen Sie alle aktuellen und vergangenen Deployments

3. **Deployment-Zeit**: Ein typisches Deployment dauert etwa 2-5 Minuten, abhängig von der Größe der Änderungen und der Auslastung von Vercel.

## Deployment-Einstellungen anpassen

Sie können verschiedene Einstellungen für Ihr Deployment anpassen:

1. **Build-Einstellungen**:
   - Gehen Sie zum Vercel-Dashboard
   - Wählen Sie Ihr Projekt
   - Klicken Sie auf "Settings" > "General"
   - Unter "Build & Development Settings" können Sie den Build-Befehl anpassen

2. **Framework-Einstellungen**:
   - Standardmäßig erkennt Vercel automatisch, dass es sich um ein React-Projekt handelt
   - Sie können dies unter "Framework Preset" ändern, falls nötig

## Umgebungsvariablen konfigurieren

Umgebungsvariablen sind wichtig für die Konfiguration Ihrer Anwendung:

1. **Umgebungsvariablen hinzufügen**:
   - Gehen Sie zum Vercel-Dashboard
   - Wählen Sie Ihr Projekt
   - Klicken Sie auf "Settings" > "Environment Variables"
   - Fügen Sie Schlüssel-Wert-Paare hinzu (z.B. `API_URL=https://api.example.com`)

2. **Umgebungen**:
   - Sie können verschiedene Variablen für verschiedene Umgebungen festlegen (Production, Preview, Development)
   - Wählen Sie die entsprechende Umgebung aus dem Dropdown-Menü

## Domains und SSL

Vercel bietet automatisch eine SSL-verschlüsselte Domain für Ihr Projekt:

1. **Standard-Domain**: Ihre Anwendung ist unter `https://hochzeitsapp-really.vercel.app` verfügbar

2. **Benutzerdefinierte Domain hinzufügen**:
   - Gehen Sie zum Vercel-Dashboard
   - Wählen Sie Ihr Projekt
   - Klicken Sie auf "Settings" > "Domains"
   - Klicken Sie auf "Add"
   - Geben Sie Ihre Domain ein (z.B. `www.lemonvows.com`)
   - Folgen Sie den Anweisungen zur DNS-Konfiguration

3. **SSL**: Vercel konfiguriert automatisch SSL für alle Domains

## Deployment-Logs überprüfen

Wenn Probleme auftreten, können Sie die Deployment-Logs überprüfen:

1. **Build-Logs**:
   - Gehen Sie zum Vercel-Dashboard
   - Wählen Sie Ihr Projekt
   - Klicken Sie auf das neueste Deployment
   - Klicken Sie auf "View Build Logs"

2. **Runtime-Logs**:
   - Im selben Bereich können Sie auf "Runtime Logs" klicken, um Logs der laufenden Anwendung zu sehen

## Rollbacks durchführen

Wenn ein Deployment Probleme verursacht, können Sie zu einer früheren Version zurückkehren:

1. **Rollback durchführen**:
   - Gehen Sie zum Vercel-Dashboard
   - Wählen Sie Ihr Projekt
   - Klicken Sie auf "Deployments"
   - Finden Sie ein früheres, funktionierendes Deployment
   - Klicken Sie auf die drei Punkte und wählen Sie "Promote to Production"

2. **Automatisches Rollback**: Sie können auch automatische Rollbacks konfigurieren:
   - Gehen Sie zu "Settings" > "Git"
   - Aktivieren Sie "Cancel failed deployments"

## Häufige Probleme und Lösungen

### Problem: Deployment schlägt fehl

**Lösung**:
1. Überprüfen Sie die Build-Logs auf spezifische Fehler
2. Stellen Sie sicher, dass alle Abhängigkeiten korrekt installiert sind
3. Überprüfen Sie die `vercel.json`-Datei auf korrekte Konfiguration

### Problem: Änderungen werden nicht angezeigt

**Lösung**:
1. Stellen Sie sicher, dass die Änderungen erfolgreich gepusht wurden
2. Überprüfen Sie, ob das Deployment abgeschlossen ist
3. Leeren Sie den Browser-Cache mit Strg+F5 oder Cmd+Shift+R
4. Warten Sie einige Minuten, da CDN-Caching zu Verzögerungen führen kann

### Problem: Fehler in der Anwendung nach Deployment

**Lösung**:
1. Überprüfen Sie die Browser-Konsole auf JavaScript-Fehler
2. Überprüfen Sie die Runtime-Logs in Vercel
3. Führen Sie einen Rollback zu einer früheren Version durch, falls nötig

---

Diese Anleitung wird regelmäßig aktualisiert, um neue Funktionen und Verbesserungen zu berücksichtigen. Letzte Aktualisierung: März 2025.
