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
  MapPin, 
  Calendar, 
  Clock 
} from "lucide-react";
import { WeddingEvent } from "@/types/wedding-homepage";
import { 
  createWeddingEvent, 
  getWeddingEventsByHomepageId, 
  updateWeddingEvent,
  deleteWeddingEvent
} from "@/services/weddingHomepageService";

interface WeddingEventManagerProps {
  homepageId: string;
}

const WeddingEventManager: React.FC<WeddingEventManagerProps> = ({ homepageId }) => {
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [isMainEvent, setIsMainEvent] = useState(false);
  const [savingEvent, setSavingEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Load events
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getWeddingEventsByHomepageId(homepageId);
        setEvents(data);
      } catch (error) {
        console.error("Error loading wedding events:", error);
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
    setDate("");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setAddress("");
    setIsMainEvent(false);
    setEditingEventId(null);
  };

  // Set form for editing
  const setFormForEditing = (event: WeddingEvent) => {
    setTitle(event.title);
    setDescription(event.description || "");
    setDate(event.date);
    setStartTime(event.start_time || "");
    setEndTime(event.end_time || "");
    setLocation(event.location || "");
    setAddress(event.address || "");
    setIsMainEvent(event.is_main_event);
    setEditingEventId(event.id!);
  };

  // Save event
  const handleSaveEvent = async () => {
    if (!title || !date) {
      alert("Bitte fülle alle Pflichtfelder aus.");
      return;
    }
    
    try {
      setSavingEvent(true);
      
      const eventData = {
        homepage_id: homepageId,
        title,
        description: description || undefined,
        date,
        start_time: startTime || undefined,
        end_time: endTime || undefined,
        location: location || undefined,
        address: address || undefined,
        is_main_event: isMainEvent
      };
      
      let savedEvent: WeddingEvent;
      
      if (editingEventId) {
        // Update existing event
        savedEvent = await updateWeddingEvent(editingEventId, eventData);
        setEvents(events.map(event => 
          event.id === editingEventId ? savedEvent : event
        ));
      } else {
        // Create new event
        savedEvent = await createWeddingEvent(eventData);
        setEvents([...events, savedEvent]);
      }
      
      resetForm();
    } catch (error) {
      console.error("Error saving wedding event:", error);
      alert("Fehler beim Speichern des Events. Bitte versuche es erneut.");
    } finally {
      setSavingEvent(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Bist du sicher, dass du dieses Event löschen möchtest?")) {
      return;
    }
    
    try {
      await deleteWeddingEvent(eventId);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error("Error deleting wedding event:", error);
      alert("Fehler beim Löschen des Events. Bitte versuche es erneut.");
    }
  };

  // Filter events based on active tab
  const filteredEvents = events.filter(event => {
    if (activeTab === "all") return true;
    if (activeTab === "main") return event.is_main_event;
    return false;
  });

  if (loading) {
    return <div className="flex justify-center p-8">Lade Events...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Veranstaltungen</CardTitle>
        <CardDescription>
          Verwalte die Veranstaltungen deiner Hochzeit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">Alle Events</TabsTrigger>
            <TabsTrigger value="main">Hauptveranstaltungen</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="pt-4">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Keine Events in dieser Kategorie vorhanden.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map(event => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-4 md:p-6 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-medium">{event.title}</h3>
                            {event.is_main_event && (
                              <Badge className="mt-1">Hauptveranstaltung</Badge>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFormForEditing(event)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEvent(event.id!)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {event.description && (
                          <p className="mt-2 text-muted-foreground">{event.description}</p>
                        )}
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {new Date(event.date).toLocaleDateString('de-DE')}
                          </div>
                          
                          {(event.start_time || event.end_time) && (
                            <div className="flex items-center text-sm">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              {event.start_time && event.end_time 
                                ? `${event.start_time} - ${event.end_time} Uhr`
                                : event.start_time 
                                  ? `Ab ${event.start_time} Uhr`
                                  : `Bis ${event.end_time} Uhr`
                              }
                            </div>
                          )}
                          
                          {event.location && (
                            <div className="flex items-center text-sm">
                              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                              {event.location}
                              {event.address && `, ${event.address}`}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Event hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingEventId ? "Event bearbeiten" : "Neues Event hinzufügen"}
              </DialogTitle>
              <DialogDescription>
                Füge ein Event zu deiner Hochzeitshomepage hinzu.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titel*</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="z.B. Standesamtliche Trauung"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Weitere Details zum Event..."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="date">Datum*</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Beginn</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="endTime">Ende</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="location">Ort</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="z.B. Schloss Schönbrunn"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="z.B. Schönbrunner Schloßstraße 47, 1130 Wien"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isMainEvent"
                  checked={isMainEvent}
                  onChange={(e) => setIsMainEvent(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isMainEvent">Als Hauptveranstaltung markieren</Label>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleSaveEvent} 
                disabled={!title || !date || savingEvent}
              >
                {savingEvent ? "Wird gespeichert..." : (editingEventId ? "Aktualisieren" : "Hinzufügen")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default WeddingEventManager;
