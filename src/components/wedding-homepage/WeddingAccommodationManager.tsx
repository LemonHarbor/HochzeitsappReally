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
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Trash2, 
  Edit, 
  Building, 
  MapPin, 
  ExternalLink 
} from "lucide-react";
import { WeddingAccommodation } from "@/types/wedding-homepage";
import { 
  createWeddingAccommodation, 
  getWeddingAccommodationsByHomepageId, 
  updateWeddingAccommodation,
  deleteWeddingAccommodation
} from "@/services/weddingHomepageService";

interface WeddingAccommodationManagerProps {
  homepageId: string;
}

const WeddingAccommodationManager: React.FC<WeddingAccommodationManagerProps> = ({ homepageId }) => {
  const [accommodations, setAccommodations] = useState<WeddingAccommodation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [website, setWebsite] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [savingAccommodation, setSavingAccommodation] = useState(false);
  const [editingAccommodationId, setEditingAccommodationId] = useState<string | null>(null);

  // Load accommodations
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getWeddingAccommodationsByHomepageId(homepageId);
        setAccommodations(data);
      } catch (error) {
        console.error("Error loading wedding accommodations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [homepageId]);

  // Reset form
  const resetForm = () => {
    setName("");
    setDescription("");
    setAddress("");
    setPriceRange("");
    setWebsite("");
    setImageUrl("");
    setEditingAccommodationId(null);
  };

  // Set form for editing
  const setFormForEditing = (accommodation: WeddingAccommodation) => {
    setName(accommodation.name);
    setDescription(accommodation.description || "");
    setAddress(accommodation.address || "");
    setPriceRange(accommodation.price_range || "");
    setWebsite(accommodation.website || "");
    setImageUrl(accommodation.image_url || "");
    setEditingAccommodationId(accommodation.id!);
  };

  // Save accommodation
  const handleSaveAccommodation = async () => {
    if (!name) {
      alert("Bitte gib mindestens einen Namen ein.");
      return;
    }
    
    try {
      setSavingAccommodation(true);
      
      const accommodationData = {
        homepage_id: homepageId,
        name,
        description: description || undefined,
        address: address || undefined,
        price_range: priceRange || undefined,
        website: website || undefined,
        image_url: imageUrl || undefined
      };
      
      let savedAccommodation: WeddingAccommodation;
      
      if (editingAccommodationId) {
        // Update existing accommodation
        savedAccommodation = await updateWeddingAccommodation(editingAccommodationId, accommodationData);
        setAccommodations(accommodations.map(accommodation => 
          accommodation.id === editingAccommodationId ? savedAccommodation : accommodation
        ));
      } else {
        // Create new accommodation
        savedAccommodation = await createWeddingAccommodation(accommodationData);
        setAccommodations([...accommodations, savedAccommodation]);
      }
      
      resetForm();
    } catch (error) {
      console.error("Error saving wedding accommodation:", error);
      alert("Fehler beim Speichern der Unterkunft. Bitte versuche es erneut.");
    } finally {
      setSavingAccommodation(false);
    }
  };

  // Delete accommodation
  const handleDeleteAccommodation = async (accommodationId: string) => {
    if (!confirm("Bist du sicher, dass du diese Unterkunft löschen möchtest?")) {
      return;
    }
    
    try {
      await deleteWeddingAccommodation(accommodationId);
      setAccommodations(accommodations.filter(accommodation => accommodation.id !== accommodationId));
    } catch (error) {
      console.error("Error deleting wedding accommodation:", error);
      alert("Fehler beim Löschen der Unterkunft. Bitte versuche es erneut.");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Lade Unterkünfte...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Unterkünfte</CardTitle>
        <CardDescription>
          Verwalte Übernachtungsmöglichkeiten für deine Gäste
        </CardDescription>
      </CardHeader>
      <CardContent>
        {accommodations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Noch keine Unterkünfte vorhanden. Füge Übernachtungsmöglichkeiten hinzu, damit deine Gäste wissen, wo sie übernachten können.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accommodations.map(accommodation => (
              <Card key={accommodation.id} className="overflow-hidden">
                <div className="relative">
                  {accommodation.image_url ? (
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={accommodation.image_url} 
                        alt={accommodation.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-muted flex items-center justify-center">
                      <Building className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{accommodation.name}</h3>
                      {accommodation.price_range && (
                        <p className="text-sm mt-1">
                          {accommodation.price_range}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormForEditing(accommodation)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAccommodation(accommodation.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {accommodation.description && (
                    <p className="text-sm text-muted-foreground mt-2">{accommodation.description}</p>
                  )}
                  
                  {accommodation.address && (
                    <div className="flex items-center mt-2 text-sm">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{accommodation.address}</span>
                    </div>
                  )}
                  
                  {accommodation.website && (
                    <div className="mt-3">
                      <a 
                        href={accommodation.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center"
                      >
                        Website besuchen
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Unterkunft hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAccommodationId ? "Unterkunft bearbeiten" : "Neue Unterkunft hinzufügen"}
              </DialogTitle>
              <DialogDescription>
                Füge eine Übernachtungsmöglichkeit für deine Gäste hinzu.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name*</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="z.B. Hotel Seeblick"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Weitere Details zur Unterkunft..."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="z.B. Hauptstraße 1, 10115 Berlin"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="priceRange">Preisklasse</Label>
                <Input
                  id="priceRange"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  placeholder="z.B. 80-120 € pro Nacht"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="z.B. https://hotel-seeblick.de"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Bild-URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="z.B. https://example.com/hotel.jpg"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleSaveAccommodation} 
                disabled={!name || savingAccommodation}
              >
                {savingAccommodation ? "Wird gespeichert..." : (editingAccommodationId ? "Aktualisieren" : "Hinzufügen")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default WeddingAccommodationManager;
