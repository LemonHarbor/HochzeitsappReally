export type ColorTheme = {
  id: string;
  name: string;
  description: string;
  isPremium: boolean;
  isActive: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    border: string;
  };
  cssVariables: Record<string, string>;
};

export const colorThemes: ColorTheme[] = [
  {
    id: "classic-elegance",
    name: "Klassische Eleganz",
    description: "Zeitlos, elegant und traditionell",
    isPremium: false,
    isActive: true,
    colors: {
      primary: "#1e3a8a", // Dunkelblau
      secondary: "#f3f4f6", // Hellgrau
      accent: "#7f1d1d", // Burgundrot
      background: "#ffffff", // Weiß
      foreground: "#1f2937", // Dunkelgrau
      muted: "#f3f4f6", // Hellgrau
      mutedForeground: "#6b7280", // Mittelgrau
      border: "#e5e7eb", // Hellgrau
    },
    cssVariables: {
      "--primary": "222.2 47.4% 11.2%",
      "--primary-foreground": "210 40% 98%",
      "--secondary": "210 40% 96.1%",
      "--secondary-foreground": "222.2 47.4% 11.2%",
      "--accent": "346.8 77.2% 49.8%",
      "--accent-foreground": "355.7 100% 97.3%",
      "--background": "0 0% 100%",
      "--foreground": "222.2 84% 4.9%",
      "--card": "0 0% 100%",
      "--card-foreground": "222.2 84% 4.9%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "222.2 84% 4.9%",
      "--muted": "210 40% 96.1%",
      "--muted-foreground": "215.4 16.3% 46.9%",
      "--border": "214.3 31.8% 91.4%",
      "--input": "214.3 31.8% 91.4%",
      "--ring": "222.2 84% 4.9%",
    },
  },
  {
    id: "romantic-rose",
    name: "Romantisches Rosé",
    description: "Romantisch, verträumt und weich",
    isPremium: true,
    isActive: false,
    colors: {
      primary: "#be185d", // Rosa
      secondary: "#fdf2f8", // Helles Rosa
      accent: "#b45309", // Gold
      background: "#ffffff", // Weiß
      foreground: "#1f2937", // Dunkelgrau
      muted: "#fdf2f8", // Helles Rosa
      mutedForeground: "#9d174d", // Dunkleres Rosa
      border: "#fbcfe8", // Helles Rosa
    },
    cssVariables: {
      "--primary": "336.8 84% 17.5%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "330 100% 98%",
      "--secondary-foreground": "336.8 84% 17.5%",
      "--accent": "35.5 91.7% 32.9%",
      "--accent-foreground": "0 0% 100%",
      "--background": "0 0% 100%",
      "--foreground": "222.2 84% 4.9%",
      "--card": "0 0% 100%",
      "--card-foreground": "222.2 84% 4.9%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "222.2 84% 4.9%",
      "--muted": "330 100% 98%",
      "--muted-foreground": "336.8 84% 17.5%",
      "--border": "327.7 73.3% 90.2%",
      "--input": "327.7 73.3% 90.2%",
      "--ring": "336.8 84% 17.5%",
    },
  },
  {
    id: "natural-green",
    name: "Natürliches Grün",
    description: "Natürlich, organisch und frisch",
    isPremium: true,
    isActive: false,
    colors: {
      primary: "#065f46", // Dunkelgrün
      secondary: "#ecfdf5", // Hellgrün
      accent: "#9a3412", // Terrakotta
      background: "#f9fafb", // Hellbeige
      foreground: "#1f2937", // Dunkelgrau
      muted: "#d1fae5", // Hellgrün
      mutedForeground: "#047857", // Mittelgrün
      border: "#a7f3d0", // Hellgrün
    },
    cssVariables: {
      "--primary": "158.1 64.4% 51.6%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "156.2 71.6% 95.9%",
      "--secondary-foreground": "158.1 64.4% 51.6%",
      "--accent": "20.5 90.2% 48.2%",
      "--accent-foreground": "0 0% 100%",
      "--background": "210 20% 98%",
      "--foreground": "222.2 84% 4.9%",
      "--card": "0 0% 100%",
      "--card-foreground": "222.2 84% 4.9%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "222.2 84% 4.9%",
      "--muted": "156.2 71.6% 95.9%",
      "--muted-foreground": "158.1 64.4% 51.6%",
      "--border": "156.5 71.4% 81.2%",
      "--input": "156.5 71.4% 81.2%",
      "--ring": "158.1 64.4% 51.6%",
    },
  },
  {
    id: "modern-blue",
    name: "Modernes Blau",
    description: "Modern, frisch und klar",
    isPremium: true,
    isActive: false,
    colors: {
      primary: "#1e40af", // Marineblau
      secondary: "#eff6ff", // Hellblau
      accent: "#fbbf24", // Gelb
      background: "#ffffff", // Weiß
      foreground: "#1f2937", // Dunkelgrau
      muted: "#bfdbfe", // Hellblau
      mutedForeground: "#3b82f6", // Mittelblau
      border: "#93c5fd", // Hellblau
    },
    cssVariables: {
      "--primary": "221.2 83.2% 53.3%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "213.8 100% 96.9%",
      "--secondary-foreground": "221.2 83.2% 53.3%",
      "--accent": "47.9 95.8% 53.1%",
      "--accent-foreground": "26 83.3% 14.1%",
      "--background": "0 0% 100%",
      "--foreground": "222.2 84% 4.9%",
      "--card": "0 0% 100%",
      "--card-foreground": "222.2 84% 4.9%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "222.2 84% 4.9%",
      "--muted": "213.8 100% 96.9%",
      "--muted-foreground": "221.2 83.2% 53.3%",
      "--border": "214.3 31.8% 91.4%",
      "--input": "214.3 31.8% 91.4%",
      "--ring": "221.2 83.2% 53.3%",
    },
  },
];

export const getActiveTheme = (): ColorTheme => {
  return colorThemes.find((theme) => theme.isActive) || colorThemes[0];
};

export const setActiveTheme = (themeId: string): void => {
  // Update active status in the themes array
  colorThemes.forEach((theme) => {
    theme.isActive = theme.id === themeId;
  });

  // Apply the theme to the document
  applyTheme(getActiveTheme());
};

export const applyTheme = (theme: ColorTheme): void => {
  const root = document.documentElement;

  // Apply all CSS variables from the theme
  Object.entries(theme.cssVariables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

// Custom color picker function
export const setCustomColor = (colorType: string, value: string): void => {
  const root = document.documentElement;
  root.style.setProperty(`--${colorType}`, value);
};
