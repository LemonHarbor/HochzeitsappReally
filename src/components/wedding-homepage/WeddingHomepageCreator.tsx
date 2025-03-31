import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Trash2, 
  Edit, 
  Palette, 
  Check,
  Calendar,
  Users,
  Heart
} from "lucide-react";
import { WeddingTheme, WeddingHomepage } from "@/types/wedding-homepage";
import { 
  getWeddingThemes,
  createWeddingHomepage,
  updateWeddingHomepage
} from "@/services/weddingHomepageService";

interface WeddingHomepageCreatorProps {
  userId: string;
  existingHomepage?: WeddingHomepage | null;
  onHomepageCreated?: (homepageId: string) => void;
}

const WeddingHomepageCreator: React.FC<WeddingHomepageCreatorProps> = ({ 
  userId, 
  existingHomepage,
  onHomepageCreated
}) => {
  const [themes, setThemes] = useState<WeddingTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  
  // Form states
  const [title, setTitle] = useState("");
  const [coupleNames, setCoupleNames] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#3a3a3a");
  const [secondaryColor, setSecondaryColor] = useState("#d4af37");
  const [fontFamily, setFontFamily] = useState("Playfair Display, serif");
  
  // Load themes and existing homepage data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load themes
        const themesData = await getWeddingThemes();
        setThemes(themesData);
        
        // Set default theme if no existing homepage
        if (!existingHomepage && themesData.length > 0) {
          setSelectedTheme(themesData[0].id);
          setPrimaryColor(themesData[0].primary_color);
          setSecondaryColor(themesData[0].secondary_color);
          setFontFamily(themesData[0].font_family);
        }
        
        // Load existing homepage data if available
        if (existingHomepage) {
          setTitle(existingHomepage.title);
          setCoupleNames(existingHomepage.couple_names);
          setWeddingDate(existingHomepage.wedding_date);
          setSelectedTheme(existingHomepage.theme);
          setPrimaryColor(existingHomepage.primary_color);
          setSecondaryColor(existingHomepage.secondary_color);
          setFontFamily(existingHomepage.font_family);
        }
      } catch (error) {
        console.error("Error loading wedding homepage creator data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [existingHomepage]);

  // Handle theme selection
  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    
    // Update colors and font based on selected theme
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setPrimaryColor(theme.primary_color);
      setSecondaryColor(theme.secondary_color);
      setFontFamily(theme.font_family);
    }
  };

  // Save homepage
  const handleSaveHomepage = async () => {
    if (!title || !coupleNames || !weddingDate || !selectedTheme) {
      alert("Bitte fülle alle Pflichtfelder aus.");
      return;
    }
    
    try {
      setSaving(true);
      
      const homepageData = {
        user_id: userId,
        title,
        couple_names: coupleNames,
        wedding_date: weddingDate,
        theme: selectedTheme,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        font_family: fontFamily,
        is_published: false
      };
      
      let savedHomepage: WeddingHomepage;
      
      if (existingHomepage) {
        // Update existing homepage
        savedHomepage = await updateWeddingHomepage(existingHomepage.id!, homepageData);
      } else {
        // Create new homepage
        savedHomepage = await createWeddingHomepage(homepageData);
      }
      
      // Call the callback with the homepage ID
      if (onHomepageCreated) {
        onHomepageCreated(savedHomepage.id!);
      }
    } catch (error) {
      console.error("Error saving wedding homepage:", error);
      alert("Fehler beim Speichern der Hochzeitshomepage. Bitte versuche es erneut.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Lade Hochzeitshomepage-Creator...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{existingHomepage ? "Hochzeitshomepage bearbeiten" : "Hochzeitshomepage erstellen"}</CardTitle>
        <CardDescription>
          Gestalte deine persönliche Hochzeitshomepage für deine Gäste
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Grundinformationen
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center">
              <Palette className="mr-2 h-4 w-4" />
              Design & Stil
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="pt-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titel der Homepage</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="z.B. Unsere Hochzeit"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="coupleNames">Namen des Brautpaars</Label>
                <Input
                  id="coupleNames"
                  value={coupleNames}
                  onChange={(e) => setCoupleNames(e.target.value)}
                  placeholder="z.B. Julia & Thomas"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="weddingDate">Hochzeitsdatum</Label>
                <Input
                  id="weddingDate"
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="design" className="pt-4">
            <div className="space-y-6">
              <div>
                <Label className="mb-2 block">Theme auswählen</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {themes.map(theme => (
                    <div 
                      key={theme.id}
                      className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                        selectedTheme === theme.id 
                          ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleThemeSelect(theme.id)}
                    >
                      <div className="aspect-video relative">
                        <img 
                          src={theme.preview_image} 
                          alt={theme.name} 
                          className="w-full h-full object-cover"
                        />
                        {theme.is_premium && (
                          <Badge className="absolute top-2 right-2">Premium</Badge>
                        )}
                        {selectedTheme === theme.id && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <Check className="h-8 w-8 text-primary" />
                          </div>
                        )}
                      </div>
                      <div className="p-2 bg-background">
                        <p className="font-medium text-sm">{theme.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{theme.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="primaryColor">Primärfarbe</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded-md border"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <Input
                      id="primaryColor"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="secondaryColor">Sekundärfarbe</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded-md border"
                      style={{ backgroundColor: secondaryColor }}
                    />
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="fontFamily">Schriftart</Label>
                <Select 
                  value={fontFamily} 
                  onValueChange={setFontFamily}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Playfair Display, serif">Playfair Display (Elegant)</SelectItem>
                    <SelectItem value="Montserrat, sans-serif">Montserrat (Modern)</SelectItem>
                    <SelectItem value="Roboto, sans-serif">Roboto (Schlicht)</SelectItem>
                    <SelectItem value="Dancing Script, cursive">Dancing Script (Verspielt)</SelectItem>
                    <SelectItem value="Libre Baskerville, serif">Libre Baskerville (Klassisch)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-6 p-4 border rounded-md">
                <h3 className="text-lg font-medium mb-2">Vorschau</h3>
                <div 
                  className="p-6 rounded-md"
                  style={{ 
                    backgroundColor: primaryColor + '10',
                    borderColor: secondaryColor,
                    borderWidth: '1px',
                    fontFamily: fontFamily
                  }}
                >
                  <h1 
                    className="text-2xl font-bold mb-2"
                    style={{ color: primaryColor }}
                  >
                    {title || "Unsere Hochzeit"}
                  </h1>
                  <p 
                    className="text-lg mb-4"
                    style={{ color: secondaryColor }}
                  >
                    {coupleNames || "Julia & Thomas"}
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" style={{ color: secondaryColor }} />
                    <span>{weddingDate ? new Date(weddingDate).toLocaleDateString('de-DE') : "01.01.2025"}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      style={{ 
                        backgroundColor: primaryColor,
                        color: '#ffffff'
                      }}
                    >
                      Primärfarbe
                    </Button>
                    <Button
                      variant="outline"
                      style={{ 
                        borderColor: secondaryColor,
                        color: secondaryColor
                      }}
                    >
                      Sekundärfarbe
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Abbrechen</Button>
        <Button 
          onClick={handleSaveHomepage} 
          disabled={saving}
        >
          {saving ? "Wird gespeichert..." : (existingHomepage ? "Aktualisieren" : "Erstellen")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WeddingHomepageCreator;
