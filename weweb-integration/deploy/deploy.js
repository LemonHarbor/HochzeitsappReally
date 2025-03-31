// WeWeb Deployment Script für LemonVows
// Dieses Skript bereitet die Anwendung für die Bereitstellung vor

// Konfiguration für die Bereitstellung
const deploymentConfig = {
  appName: "LemonVows by LemonHarbor",
  version: "1.0.0",
  description: "Hochzeitsplanungs-App mit umfangreichen Funktionen",
  author: "LemonHarbor",
  components: [
    "pricing-tiers",
    "timeline-generator",
    "guest-management",
    "budget-planning",
    "task-management",
    "vendor-management",
    "seating-planner",
    "photo-gallery",
    "best-man-section"
  ],
  pages: [
    {
      name: "Home",
      path: "/",
      components: ["pricing-tiers"]
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      components: ["timeline-generator", "task-management"]
    },
    {
      name: "Gäste",
      path: "/guests",
      components: ["guest-management"]
    },
    {
      name: "Budget",
      path: "/budget",
      components: ["budget-planning"]
    },
    {
      name: "Lieferanten",
      path: "/vendors",
      components: ["vendor-management"]
    },
    {
      name: "Sitzplan",
      path: "/seating",
      components: ["seating-planner"]
    },
    {
      name: "Fotos",
      path: "/photos",
      components: ["photo-gallery"]
    },
    {
      name: "Trauzeugen",
      path: "/best-man",
      components: ["best-man-section"]
    }
  ],
  theme: {
    colors: {
      primary: "#F5A9B8", // Rosé
      secondary: "#FFFFFF", // Weiß
      accent: "#D4AF37", // Gold
      background: "#FFFFFF",
      text: "#333333"
    },
    fonts: {
      heading: "Playfair Display",
      body: "Montserrat"
    }
  }
};

// Funktion zum Erstellen der Deployment-Dateien
function createDeploymentFiles() {
  const fs = require('fs');
  const path = require('path');
  
  // Deployment-Verzeichnis erstellen
  const deployDir = path.join(__dirname, '../deploy');
  if (!fs.existsSync(deployDir)) {
    fs.mkdirSync(deployDir, { recursive: true });
  }
  
  // Komponenten kopieren
  deploymentConfig.components.forEach(component => {
    const componentDir = path.join(__dirname, `../components/${component}`);
    const deployComponentDir = path.join(deployDir, `components/${component}`);
    
    if (!fs.existsSync(deployComponentDir)) {
      fs.mkdirSync(deployComponentDir, { recursive: true });
    }
    
    // Dateien im Komponentenverzeichnis kopieren
    const files = fs.readdirSync(componentDir);
    files.forEach(file => {
      const srcPath = path.join(componentDir, file);
      const destPath = path.join(deployComponentDir, file);
      
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  });
  
  // Konfigurationsdatei erstellen
  const configPath = path.join(deployDir, 'weweb-config.json');
  fs.writeFileSync(configPath, JSON.stringify(deploymentConfig, null, 2));
  
  // Index-Datei erstellen
  const indexPath = path.join(deployDir, 'index.html');
  const indexContent = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${deploymentConfig.appName}</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@300;400;500;700&display=swap">
  <style>
    :root {
      --color-primary: ${deploymentConfig.theme.colors.primary};
      --color-secondary: ${deploymentConfig.theme.colors.secondary};
      --color-accent: ${deploymentConfig.theme.colors.accent};
      --color-background: ${deploymentConfig.theme.colors.background};
      --color-text: ${deploymentConfig.theme.colors.text};
    }
    
    body {
      font-family: ${deploymentConfig.theme.fonts.body}, sans-serif;
      color: var(--color-text);
      background-color: var(--color-background);
      margin: 0;
      padding: 0;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: ${deploymentConfig.theme.fonts.heading}, serif;
    }
  </style>
  <script src="https://cdn.weweb.io/public/v1/weweb-client.js"></script>
</head>
<body>
  <div id="app"></div>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      WeWeb.init({
        container: '#app',
        config: './weweb-config.json'
      });
    });
  </script>
</body>
</html>
  `;
  fs.writeFileSync(indexPath, indexContent);
  
  // Manifest-Datei erstellen
  const manifestPath = path.join(deployDir, 'manifest.json');
  const manifestContent = {
    name: deploymentConfig.appName,
    short_name: "LemonVows",
    description: deploymentConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: deploymentConfig.theme.colors.background,
    theme_color: deploymentConfig.theme.colors.primary,
    icons: [
      {
        src: "icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png"
      },
      {
        src: "icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png"
      },
      {
        src: "icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png"
      },
      {
        src: "icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png"
      },
      {
        src: "icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png"
      },
      {
        src: "icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png"
      },
      {
        src: "icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifestContent, null, 2));
  
  // README-Datei erstellen
  const readmePath = path.join(deployDir, 'README.md');
  const readmeContent = `# ${deploymentConfig.appName}

Version: ${deploymentConfig.version}

## Beschreibung

${deploymentConfig.description}

## Bereitstellung

Diese Anwendung wurde mit WeWeb erstellt und kann auf verschiedenen Hosting-Plattformen bereitgestellt werden.

### Bereitstellungsoptionen

1. **WeWeb Hosting**: Die einfachste Methode ist die Bereitstellung über WeWeb Hosting.
2. **Vercel**: Die Anwendung kann auch auf Vercel bereitgestellt werden.
3. **Netlify**: Alternativ kann die Anwendung auf Netlify bereitgestellt werden.

## Komponenten

Die Anwendung besteht aus den folgenden Komponenten:

${deploymentConfig.components.map(component => `- ${component}`).join('\n')}

## Seiten

Die Anwendung enthält die folgenden Seiten:

${deploymentConfig.pages.map(page => `- ${page.name} (${page.path})`).join('\n')}

## Design

Das Design verwendet die folgenden Farben und Schriftarten:

### Farben

- Primär: ${deploymentConfig.theme.colors.primary} (Rosé)
- Sekundär: ${deploymentConfig.theme.colors.secondary} (Weiß)
- Akzent: ${deploymentConfig.theme.colors.accent} (Gold)

### Schriftarten

- Überschriften: ${deploymentConfig.theme.fonts.heading}
- Text: ${deploymentConfig.theme.fonts.body}
`;
  fs.writeFileSync(readmePath, readmeContent);
  
  console.log('Deployment-Dateien wurden erfolgreich erstellt.');
  return deployDir;
}

// Funktion zum Erstellen eines ZIP-Archivs für die Bereitstellung
function createDeploymentZip() {
  const fs = require('fs');
  const path = require('path');
  const archiver = require('archiver');
  
  const deployDir = path.join(__dirname, '../deploy');
  const outputPath = path.join(__dirname, '../LemonVows-WeWeb.zip');
  
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Maximale Kompression
  });
  
  output.on('close', function() {
    console.log(`Deployment-ZIP wurde erstellt: ${outputPath}`);
    console.log(`Größe: ${archive.pointer()} Bytes`);
  });
  
  archive.on('error', function(err) {
    throw err;
  });
  
  archive.pipe(output);
  
  // Alle Dateien im Deployment-Verzeichnis hinzufügen
  archive.directory(deployDir, false);
  
  archive.finalize();
  
  return outputPath;
}

// Hauptfunktion
function deploy() {
  console.log('Starte Deployment-Prozess für LemonVows...');
  
  try {
    // Deployment-Dateien erstellen
    const deployDir = createDeploymentFiles();
    
    // ZIP-Archiv erstellen
    const zipPath = createDeploymentZip();
    
    console.log('Deployment-Prozess abgeschlossen.');
    
    return {
      success: true,
      deployDir,
      zipPath
    };
  } catch (error) {
    console.error('Fehler beim Deployment:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Deployment ausführen
if (require.main === module) {
  deploy();
}

module.exports = {
  deploy,
  createDeploymentFiles,
  createDeploymentZip,
  deploymentConfig
};
