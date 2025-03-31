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
  Gift, 
  Check, 
  X 
} from "lucide-react";
import { WeddingGift } from "@/types/wedding-homepage";
import { 
  createWeddingGift, 
  getWeddingGiftsByHomepageId, 
  updateWeddingGift,
  deleteWeddingGift
} from "@/services/weddingHomepageService";

interface WeddingGiftRegistryManagerProps {
  homepageId: string;
}

const WeddingGiftRegistryManager: React.FC<WeddingGiftRegistryManagerProps> = ({ homepageId }) => {
  const [gifts, setGifts] = useState<WeddingGift[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [savingGift, setSavingGift] = useState(false);
  const [editingGiftId, setEditingGiftId] = useState<string | null>(null);

  // Load gifts
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getWeddingGiftsByHomepageId(homepageId);
        setGifts(data);
      } catch (error) {
        console.error("Error loading wedding gifts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [homepageId]);

  // Reset form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setLink("");
    setImageUrl("");
    setEditingGiftId(null);
  };

  // Set form for editing
  const setFormForEditing = (gift: WeddingGift) => {
    setTitle(gift.title);
    setDescription(gift.description || "");
    setPrice(gift.price ? gift.price.toString() : "");
    setLink(gift.link || "");
    setImageUrl(gift.image_url || "");
    setEditingGiftId(gift.id!);
  };

  // Save gift
  const handleSaveGift = async () => {
    if (!title) {
      alert("Bitte gib mindestens einen Titel ein.");
      return;
    }
    
    try {
      setSavingGift(true);
      
      const giftData = {
        homepage_id: homepageId,
        title,
        description: description || undefined,
        price: price ? parseFloat(price) : undefined,
        link: link || undefined,
        image_url: imageUrl || undefined,
        is_reserved: false,
        reserved_by: undefined
      };
      
      let savedGift: WeddingGift;
      
      if (editingGiftId) {
        // Update existing gift
        savedGift = await updateWeddingGift(editingGiftId, giftData);
        setGifts(gifts.map(gift => 
          gift.id === editingGiftId ? savedGift : gift
        ));
      } else {
        // Create new gift
        savedGift = await createWeddingGift(giftData);
        setGifts([...gifts, savedGift]);
      }
      
      resetForm();
    } catch (error) {
      console.error("Error saving wedding gift:", error);
      alert("Fehler beim Speichern des Geschenks. Bitte versuche es erneut.");
    } finally {
      setSavingGift(false);
    }
  };

  // Delete gift
  const handleDeleteGift = async (giftId: string) => {
    if (!confirm("Bist du sicher, dass du dieses Geschenk löschen möchtest?")) {
      return;
    }
    
    try {
      await deleteWeddingGift(giftId);
      setGifts(gifts.filter(gift => gift.id !== giftId));
    } catch (error) {
      console.error("Error deleting wedding gift:", error);
      alert("Fehler beim Löschen des Geschenks. Bitte versuche es erneut.");
    }
  };

  // Toggle gift reservation
  const handleToggleReservation = async (giftId: string, isReserved: boolean) => {
    try {
      const updatedGift = await updateWeddingGift(giftId, { 
        is_reserved: !isReserved,
        reserved_by: !isReserved ? "Manuell reserviert" : undefined
      });
      
      setGifts(gifts.map(gift => 
        gift.id === giftId ? updatedGift : gift
      ));
    } catch (error) {
      console.error("Error toggling gift reservation:", error);
      alert("Fehler beim Aktualisieren der Reservierung. Bitte versuche es erneut.");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Lade Geschenkliste...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Geschenkeliste</CardTitle>
        <CardDescription>
          Verwalte deine Wunschliste für Hochzeitsgeschenke
        </CardDescription>
      </CardHeader>
      <CardContent>
        {gifts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Noch keine Geschenke in der Liste. Füge Geschenkideen hinzu, damit deine Gäste wissen, was ihr euch wünscht.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gifts.map(gift => (
              <Card key={gift.id} className="overflow-hidden">
                <div className="relative">
                  {gift.image_url ? (
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={gift.image_url} 
                        alt={gift.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-muted flex items-center justify-center">
                      <Gift className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {gift.is_reserved && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg py-1 px-3">Reserviert</Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{gift.title}</h3>
                      {gift.price && (
                        <p className="text-sm font-medium mt-1">
                          {gift.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleReservation(gift.id!, gift.is_reserved)}
                      >
                        {gift.is_reserved ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormForEditing(gift)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGift(gift.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {gift.description && (
                    <p className="text-sm text-muted-foreground mt-2">{gift.description}</p>
                  )}
                  
                  {gift.link && (
                    <div className="mt-3">
                      <a 
                        href={gift.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Zum Geschenk →
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
              Geschenk hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingGiftId ? "Geschenk bearbeiten" : "Neues Geschenk hinzufügen"}
              </DialogTitle>
              <DialogDescription>
                Füge ein Geschenk zu deiner Wunschliste hinzu.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titel*</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="z.B. Kaffeemaschine"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Weitere Details zum Geschenk..."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="price">Preis (€)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="z.B. 99.99"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="link">Link</Label>
                <Input
                  id="link"
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="z.B. https://example.com/produkt"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Bild-URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="z.B. https://example.com/bild.jpg"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleSaveGift} 
                disabled={!title || savingGift}
              >
                {savingGift ? "Wird gespeichert..." : (editingGiftId ? "Aktualisieren" : "Hinzufügen")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default WeddingGiftRegistryManager;
