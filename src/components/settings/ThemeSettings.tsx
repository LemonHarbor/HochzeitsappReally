import React, { useState, useEffect } from "react";
import { Lock, Unlock, Check, Palette } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../src/components/ui/card";
import { Button } from "../../../../src/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../src/components/ui/tabs";
import { Separator } from "../../../../src/components/ui/separator";
import { Label } from "../../../../src/components/ui/label";
import { Input } from "../../../../src/components/ui/input";
import {
  colorThemes,
  setActiveTheme,
  getActiveTheme,
  ColorTheme,
  setCustomColor,
} from "../../../../src/lib/themes";
import { useToast } from "../../../../src/components/ui/use-toast";

interface ThemeSettingsProps {
  onPurchaseTheme?: (themeId: string) => Promise<boolean>;
}

const ThemeSettings = ({
  onPurchaseTheme = async () => false,
}: ThemeSettingsProps) => {
  const [activeTheme, setActiveThemeState] =
    useState<ColorTheme>(getActiveTheme());
  const [customColors, setCustomColors] = useState({
    primary: "",
    secondary: "",
    accent: "",
  });
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { toast } = useToast();

  // Apply the active theme when component mounts
  useEffect(() => {
    const theme = getActiveTheme();
    document.documentElement.classList.add("theme-transition");
    setActiveThemeState(theme);

    // Remove transition class after theme is applied
    const timeout = setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  const handleThemeChange = (themeId: string) => {
    const theme = colorThemes.find((t) => t.id === themeId);

    if (!theme) return;

    if (theme.isPremium && !theme.isActive) {
      toast({
        title: "Premium-Theme",
        description: "Dieses Theme muss zuerst freigeschaltet werden.",
        variant: "default",
      });
      return;
    }

    document.documentElement.classList.add("theme-transition");
    setActiveTheme(themeId);
    setActiveThemeState(getActiveTheme());

    // Remove transition class after theme is applied
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 300);

    toast({
      title: "Theme geändert",
      description: `Das Theme wurde zu "${theme.name}" geändert.`,
    });
  };

  const handlePurchaseTheme = async (themeId: string) => {
    setIsPurchasing(true);
    try {
      // In a real app, this would make a payment API call
      const success = await onPurchaseTheme(themeId);

      if (success) {
        // Update the theme's premium status locally
        const themeIndex = colorThemes.findIndex((t) => t.id === themeId);
        if (themeIndex >= 0) {
          colorThemes[themeIndex].isPremium = false;
          setActiveTheme(themeId);
          setActiveThemeState(getActiveTheme());

          toast({
            title: "Theme freigeschaltet",
            description: `Das Theme "${colorThemes[themeIndex].name}" wurde erfolgreich freigeschaltet.`,
          });
        }
      } else {
        toast({
          title: "Kauf fehlgeschlagen",
          description:
            "Der Kauf konnte nicht abgeschlossen werden. Bitte versuchen Sie es später erneut.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleCustomColorChange = (colorType: string, value: string) => {
    setCustomColors((prev) => ({
      ...prev,
      [colorType]: value,
    }));

    // Convert hex to HSL and apply
    const hslValue = hexToHSL(value);
    if (hslValue) {
      setCustomColor(colorType, hslValue);
    }
  };

  // Helper function to convert hex color to HSL format
  const hexToHSL = (hex: string): string | null => {
    // Remove the # if present
    hex = hex.replace(/^#/, "");

    // Parse the hex values
    let r, g, b;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16) / 255;
      g = parseInt(hex[1] + hex[1], 16) / 255;
      b = parseInt(hex[2] + hex[2], 16) / 255;
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16) / 255;
      g = parseInt(hex.substring(2, 4), 16) / 255;
      b = parseInt(hex.substring(4, 6), 16) / 255;
    } else {
      return null; // Invalid hex color
    }

    // Find the minimum and maximum values to calculate the lightness
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      // Achromatic (gray)
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }

      h /= 6;
    }

    // Convert to degrees, percentage, percentage
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `${h} ${s}% ${l}%`;
  };

  return (
    <Card className="w-full bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Farbschema-Einstellungen
        </CardTitle>
        <CardDescription>
          Wählen Sie ein Farbschema für Ihre Hochzeitsplanung oder passen Sie
          die Farben individuell an
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="themes">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="themes">Vordefinierte Themes</TabsTrigger>
            <TabsTrigger value="custom">Individuelle Farben</TabsTrigger>
          </TabsList>

          <TabsContent value="themes" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colorThemes.map((theme) => (
                <div
                  key={theme.id}
                  className={`relative rounded-lg border-2 p-4 transition-all ${theme.isActive ? "border-primary" : "border-border"} ${theme.isPremium && !theme.isActive ? "opacity-70" : ""}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium">{theme.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {theme.description}
                      </p>
                    </div>
                    {theme.isPremium && !theme.isActive ? (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    ) : theme.isActive ? (
                      <Check className="h-5 w-5 text-primary" />
                    ) : (
                      <Unlock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div
                      className="h-8 rounded-md"
                      style={{ backgroundColor: theme.colors.primary }}
                      title="Primärfarbe"
                    />
                    <div
                      className="h-8 rounded-md"
                      style={{ backgroundColor: theme.colors.secondary }}
                      title="Sekundärfarbe"
                    />
                    <div
                      className="h-8 rounded-md"
                      style={{ backgroundColor: theme.colors.accent }}
                      title="Akzentfarbe"
                    />
                    <div
                      className="h-8 rounded-md border"
                      style={{ backgroundColor: theme.colors.background }}
                      title="Hintergrundfarbe"
                    />
                  </div>

                  {theme.isPremium && !theme.isActive ? (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => handlePurchaseTheme(theme.id)}
                      disabled={isPurchasing}
                    >
                      {isPurchasing ? "Wird freigeschaltet..." : "Freischalten"}
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant={theme.isActive ? "secondary" : "default"}
                      onClick={() => handleThemeChange(theme.id)}
                      disabled={theme.isActive}
                    >
                      {theme.isActive ? "Aktiv" : "Auswählen"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Individuelle Farben anpassen
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Passen Sie die Farben Ihrer Hochzeitsplanung individuell an
                  Ihre Wünsche an.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primärfarbe</Label>
                  <div className="flex gap-2">
                    <div
                      className="h-10 w-10 rounded-md border"
                      style={{
                        backgroundColor:
                          customColors.primary || activeTheme.colors.primary,
                      }}
                    />
                    <Input
                      id="primary-color"
                      type="color"
                      value={customColors.primary || activeTheme.colors.primary}
                      onChange={(e) =>
                        handleCustomColorChange("primary", e.target.value)
                      }
                      className="w-full h-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Hauptfarbe für Buttons und wichtige Elemente
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Sekundärfarbe</Label>
                  <div className="flex gap-2">
                    <div
                      className="h-10 w-10 rounded-md border"
                      style={{
                        backgroundColor:
                          customColors.secondary ||
                          activeTheme.colors.secondary,
                      }}
                    />
                    <Input
                      id="secondary-color"
                      type="color"
                      value={
                        customColors.secondary || activeTheme.colors.secondary
                      }
                      onChange={(e) =>
                        handleCustomColorChange("secondary", e.target.value)
                      }
                      className="w-full h-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Farbe für sekundäre Elemente und Hintergründe
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accent-color">Akzentfarbe</Label>
                  <div className="flex gap-2">
                    <div
                      className="h-10 w-10 rounded-md border"
                      style={{
                        backgroundColor:
                          customColors.accent || activeTheme.colors.accent,
                      }}
                    />
                    <Input
                      id="accent-color"
                      type="color"
                      value={customColors.accent || activeTheme.colors.accent}
                      onChange={(e) =>
                        handleCustomColorChange("accent", e.target.value)
                      }
                      className="w-full h-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Farbe für Hervorhebungen und Akzente
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="font-medium">Vorschau</h3>
                <div className="p-4 border rounded-lg bg-background">
                  <h4 className="text-lg font-bold text-foreground mb-2">
                    Beispiel-Überschrift
                  </h4>
                  <p className="text-foreground mb-4">
                    Dies ist ein Beispieltext in der Primärfarbe.
                  </p>

                  <div className="flex gap-2 mb-4">
                    <Button>Primär-Button</Button>
                    <Button variant="secondary">Sekundär-Button</Button>
                    <Button variant="outline">Outline-Button</Button>
                  </div>

                  <div className="p-3 bg-secondary rounded-md text-secondary-foreground mb-4">
                    Dies ist ein Beispiel für einen Bereich mit der
                    Sekundärfarbe.
                  </div>

                  <div className="p-3 bg-accent/20 rounded-md text-accent-foreground">
                    Dies ist ein Beispiel für einen Bereich mit der Akzentfarbe.
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    // Reset to the active theme
                    setCustomColors({
                      primary: "",
                      secondary: "",
                      accent: "",
                    });
                    setActiveTheme(activeTheme.id);

                    toast({
                      title: "Farben zurückgesetzt",
                      description:
                        "Die individuellen Farben wurden zurückgesetzt.",
                    });
                  }}
                  variant="outline"
                  className="mr-2"
                >
                  Zurücksetzen
                </Button>

                <Button
                  onClick={() => {
                    toast({
                      title: "Farben gespeichert",
                      description:
                        "Ihre individuellen Farben wurden gespeichert.",
                    });
                  }}
                >
                  Speichern
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ThemeSettings;
