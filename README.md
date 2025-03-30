# LemonVows - Hochzeitsplanungs-App

## Übersicht

LemonVows ist eine umfassende Hochzeitsplanungs-App, die Paaren hilft, ihre Hochzeit zu organisieren und zu verwalten. Die App bietet Funktionen für Gästeverwaltung, Tischplanung, Budgetverfolgung, Zeitplanung und mehr.

## Dokumentation

### Für Benutzer
- [Anpassungsleitfaden](./docs/customization-guide.md) - Wie du die App an deine Bedürfnisse anpassen kannst
- [Vercel Deployment Anleitung](./docs/vercel-deployment.md) - Wie du die App auf Vercel deployen kannst

### Für Entwickler
- [Projektstruktur](#projektstruktur)
- [Technologie-Stack](#technologie-stack)
- [Lokale Entwicklung](#lokale-entwicklung)
- [Deployment](#deployment)

## Projektstruktur

```
HochzeitsappReally/
├── public/              # Statische Assets
│   ├── icons/           # App-Icons
│   ├── images/          # Bilder
│   ├── manifest.json    # PWA-Manifest
│   └── sw.js            # Service Worker
├── src/                 # Quellcode
│   ├── components/      # React-Komponenten
│   ├── context/         # React-Kontexte
│   ├── hooks/           # Custom React-Hooks
│   ├── lib/             # Hilfsbibliotheken
│   ├── pages/           # Hauptseiten
│   ├── services/        # API-Dienste
│   └── types/           # TypeScript-Typdefinitionen
├── supabase/            # Supabase-Konfiguration
├── .env                 # Umgebungsvariablen (Entwicklung)
├── .env.production      # Umgebungsvariablen (Produktion)
├── vercel.json          # Vercel-Konfiguration
└── vite.config.ts       # Vite-Konfiguration
```

## Technologie-Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Build-Tool**: Vite
- **Backend/Datenbank**: Supabase
- **Hosting**: Vercel
- **UI-Komponenten**: Radix UI, Shadcn UI
- **Authentifizierung**: Supabase Auth
- **Echtzeit-Updates**: Supabase Realtime

## Lokale Entwicklung

### Voraussetzungen

- Node.js (v18 oder höher)
- npm oder yarn
- Git

### Installation

1. Repository klonen:
   ```
   git clone https://github.com/LemonHarbor/HochzeitsappReally.git
   cd HochzeitsappReally
   ```

2. Abhängigkeiten installieren:
   ```
   npm install
   ```

3. Umgebungsvariablen konfigurieren:
   - Kopiere `.env.example` zu `.env`
   - Füge deine Supabase-Anmeldedaten ein

4. Entwicklungsserver starten:
   ```
   npm run dev
   ```

## Deployment

Die App kann auf Vercel deployt werden. Folge der [Vercel Deployment Anleitung](./docs/vercel-deployment.md) für detaillierte Anweisungen.

## Lizenz

Alle Rechte vorbehalten.
