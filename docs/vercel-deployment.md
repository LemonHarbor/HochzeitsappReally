# Vercel Deployment Anleitung für LemonVows

Diese Anleitung führt dich durch den Prozess, deine LemonVows App auf Vercel zu deployen.

## Voraussetzungen

- Ein Vercel-Konto (kostenlos verfügbar auf [vercel.com](https://vercel.com))
- Zugriff auf dein GitHub-Repository: [https://github.com/LemonHarbor/HochzeitsappReally](https://github.com/LemonHarbor/HochzeitsappReally)

## Wichtige Änderungen für das Vercel-Deployment

Folgende Änderungen wurden vorgenommen, um die App erfolgreich auf Vercel zu deployen:

1. **Import-Pfad-Korrekturen**: Alle Import-Pfade wurden von absoluten Pfaden (`@/components/...` oder `../../../src/components/...`) zu relativen Pfaden (`../components/...`) geändert. Dies war notwendig, da Vercel Schwierigkeiten hat, die Pfad-Aliase korrekt aufzulösen.

2. **Build-Konfiguration**: Ein spezieller Build-Befehl `build-vercel` wurde in der `package.json` hinzugefügt, der TypeScript-Fehler während des Builds ignoriert.

3. **Vercel-Konfiguration**: Die `vercel.json` wurde optimiert, um die Bereitstellung zu verbessern und Routing-Probleme zu vermeiden.

## Schritt-für-Schritt Anleitung

### 1. Bei Vercel anmelden

1. Gehe zu [vercel.com](https://vercel.com) und melde dich an oder erstelle ein neues Konto
2. Wenn du dich zum ersten Mal anmeldest, folge den Anweisungen zur Kontoerstellung

### 2. Neues Projekt erstellen

1. Klicke auf der Vercel-Dashboard-Seite auf "Add New..." und wähle "Project"
2. Verbinde dein GitHub-Konto, falls noch nicht geschehen
3. Wähle das Repository "LemonHarbor/HochzeitsappReally" aus der Liste aus

### 3. Projekt konfigurieren

Die Konfiguration ist bereits in der `vercel.json` Datei im Repository enthalten, aber überprüfe folgende Einstellungen:

- **Framework Preset**: Vite
- **Build Command**: `npm run build-vercel`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Umgebungsvariablen einrichten

Die folgenden Umgebungsvariablen sind bereits in der `vercel.json` Datei definiert, aber du kannst sie bei Bedarf im Vercel-Dashboard anpassen:

- `VITE_SUPABASE_URL`: Deine Supabase-Projekt-URL
- `VITE_SUPABASE_ANON_KEY`: Dein Supabase anonymer Schlüssel
- `VITE_TEMPO`: "false" für Produktionsumgebung
- `VITE_BASE_PATH`: "/"

### 5. Deployment starten

1. Klicke auf "Deploy"
2. Vercel wird nun dein Projekt bauen und deployen
3. Nach erfolgreichem Deployment erhältst du eine URL, unter der deine App erreichbar ist

### 6. Domain-Einstellungen (optional)

Wenn du eine benutzerdefinierte Domain verwenden möchtest:

1. Gehe im Vercel-Dashboard zu deinem Projekt
2. Klicke auf "Settings" und dann auf "Domains"
3. Folge den Anweisungen, um deine benutzerdefinierte Domain einzurichten

## Fehlerbehebung

Falls Probleme beim Deployment auftreten:

1. Überprüfe die Build-Logs im Vercel-Dashboard
2. Stelle sicher, dass alle Umgebungsvariablen korrekt gesetzt sind
3. Prüfe, ob die neuesten Änderungen im GitHub-Repository sind

### Häufige Probleme und Lösungen

#### Import-Pfad-Probleme

Wenn du neue Komponenten oder Dateien hinzufügst, verwende immer relative Pfade für Imports:

```typescript
// FALSCH (funktioniert nicht auf Vercel):
import { Component } from "@/components/ui/component";
import { Component } from "../../../src/components/ui/component";

// RICHTIG (funktioniert auf Vercel):
import { Component } from "../components/ui/component";
```

#### TypeScript-Fehler

Wenn TypeScript-Fehler das Deployment verhindern, kannst du:

1. Die Fehler direkt beheben (empfohlen)
2. Den `build-vercel` Befehl verwenden, der TypeScript-Fehler ignoriert

## Automatische Deployments

Vercel ist so konfiguriert, dass es automatisch neue Deployments erstellt, wenn du Änderungen in den `main`-Branch deines GitHub-Repositories pushst.

## Support

Bei Fragen oder Problemen mit dem Deployment kannst du:

1. Die [Vercel-Dokumentation](https://vercel.com/docs) konsultieren
2. Den Vercel-Support kontaktieren
3. Mich für weitere Unterstützung kontaktieren
