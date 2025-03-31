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
  MapPin, 
  Search, 
  Plus, 
  Minus, 
  Maximize, 
  Minimize 
} from "lucide-react";
import { WeddingEvent } from "@/types/wedding-homepage";
import { getWeddingEventsByHomepageId } from "@/services/weddingHomepageService";

interface WeddingMapManagerProps {
  homepageId: string;
}

const WeddingMapManager: React.FC<WeddingMapManagerProps> = ({ homepageId }) => {
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapApiKey, setMapApiKey] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: 52.520008, lng: 13.404954 }); // Default to Berlin
  const [mapZoom, setMapZoom] = useState(12);
  const [selectedEvent, setSelectedEvent] = useState<WeddingEvent | null>(null);
  
  // Load events with locations
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getWeddingEventsByHomepageId(homepageId);
        // Filter events with locations
        const eventsWithLocation = data.filter(event => event.location && event.address);
        setEvents(eventsWithLocation);
        
        // If there's a main event with location, center the map on it
        const mainEvent = eventsWithLocation.find(event => event.is_main_event);
        if (mainEvent && mainEvent.address) {
          // In a real app, we would geocode the address here
          // For now, we'll just use the default center
        }
      } catch (error) {
        console.error("Error loading wedding events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [homepageId]);

  // Save map settings
  const handleSaveMapSettings = () => {
    // In a real app, we would save the map settings to the database
    alert("Karteneinstellungen gespeichert!");
  };

  // Geocode address (mock function)
  const handleGeocodeAddress = (address: string) => {
    // In a real app, we would use a geocoding service
    alert(`Adresse "${address}" würde jetzt geocodiert werden.`);
  };

  // Zoom in/out
  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in' && mapZoom < 20) {
      setMapZoom(mapZoom + 1);
    } else if (direction === 'out' && mapZoom > 1) {
      setMapZoom(mapZoom - 1);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Lade Kartendaten...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Interaktive Karte</CardTitle>
        <CardDescription>
          Konfiguriere die Karte mit Wegbeschreibungen zu deinen Veranstaltungsorten
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Map API Key Input */}
          <div className="grid gap-2">
            <Label htmlFor="mapApiKey">Google Maps API-Schlüssel</Label>
            <Input
              id="mapApiKey"
              value={mapApiKey}
              onChange={(e) => setMapApiKey(e.target.value)}
              placeholder="Dein Google Maps API-Schlüssel"
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              Du benötigst einen Google Maps API-Schlüssel, um die Karte auf deiner Hochzeitshomepage anzuzeigen.
              <a 
                href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline ml-1"
              >
                Mehr erfahren
              </a>
            </p>
          </div>

          {/* Map Preview */}
          <div>
            <h3 className="text-lg font-medium mb-2">Kartenvorschau</h3>
            <div className="relative border rounded-md overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                {mapApiKey ? (
                  <div className="w-full h-full bg-gray-200 relative">
                    {/* This would be a real Google Map in production */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-muted-foreground">Google Maps würde hier angezeigt werden</p>
                    </div>
                    
                    {/* Map Controls */}
                    <div className="absolute top-2 right-2 flex flex-col space-y-2">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleZoom('in')}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleZoom('out')}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                      >
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p>Gib einen Google Maps API-Schlüssel ein, um die Karte zu aktivieren</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Event Locations */}
          <div>
            <h3 className="text-lg font-medium mb-2">Veranstaltungsorte</h3>
            {events.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded-lg">
                Keine Veranstaltungen mit Ortsangaben vorhanden. Füge Orte zu deinen Veranstaltungen hinzu, um sie auf der Karte anzuzeigen.
              </div>
            ) : (
              <div className="space-y-2">
                {events.map(event => (
                  <div 
                    key={event.id} 
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedEvent?.id === event.id 
                        ? 'bg-primary/10 border-primary' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        {event.is_main_event && (
                          <Badge className="mt-1">Hauptveranstaltung</Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGeocodeAddress(event.address!);
                        }}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center mt-2 text-sm">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{event.location}</span>
                      {event.address && <span className="ml-1 text-muted-foreground">({event.address})</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={handleSaveMapSettings}
          disabled={!mapApiKey}
        >
          Karteneinstellungen speichern
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WeddingMapManager;
