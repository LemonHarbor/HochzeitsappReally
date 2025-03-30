# Vercel Deployment Anleitung für LemonVows

Diese Anleitung führt dich durch den Prozess, deine LemonVows App auf Vercel zu deployen.

## Voraussetzungen

- Ein Vercel-Konto (kostenlos verfügbar auf [vercel.com](https://vercel.com))
- Zugriff auf dein GitHub-Repository: [https://github.com/LemonHarbor/HochzeitsappReally](https://github.com/LemonHarbor/HochzeitsappReally)

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
- **Build Command**: `npm run build-no-errors`
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

## Automatische Deployments

Vercel ist so konfiguriert, dass es automatisch neue Deployments erstellt, wenn du Änderungen in den `main`-Branch deines GitHub-Repositories pushst.

## Support

Bei Fragen oder Problemen mit dem Deployment kannst du:

1. Die [Vercel-Dokumentation](https://vercel.com/docs) konsultieren
2. Den Vercel-Support kontaktieren
3. Mich für weitere Unterstützung kontaktieren
