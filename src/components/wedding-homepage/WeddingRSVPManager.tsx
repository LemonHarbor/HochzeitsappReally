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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Trash2, 
  Edit, 
  Mail, 
  Phone, 
  Check, 
  X, 
  MessageSquare 
} from "lucide-react";
import { WeddingRSVP } from "@/types/wedding-homepage";
import { 
  getWeddingRSVPsByHomepageId, 
  updateWeddingRSVP,
  deleteWeddingRSVP
} from "@/services/weddingHomepageService";

interface WeddingRSVPManagerProps {
  homepageId: string;
}

const WeddingRSVPManager: React.FC<WeddingRSVPManagerProps> = ({ homepageId }) => {
  const [rsvps, setRsvps] = useState<WeddingRSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRSVP, setSelectedRSVP] = useState<WeddingRSVP | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Load RSVPs
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getWeddingRSVPsByHomepageId(homepageId);
        setRsvps(data);
      } catch (error) {
        console.error("Error loading wedding RSVPs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [homepageId]);

  // Delete RSVP
  const handleDeleteRSVP = async (rsvpId: string) => {
    if (!confirm("Bist du sicher, dass du diese RSVP-Antwort löschen möchtest?")) {
      return;
    }
    
    try {
      await deleteWeddingRSVP(rsvpId);
      setRsvps(rsvps.filter(rsvp => rsvp.id !== rsvpId));
      
      // Close details if the deleted RSVP was being viewed
      if (selectedRSVP && selectedRSVP.id === rsvpId) {
        setIsDetailsOpen(false);
        setSelectedRSVP(null);
      }
    } catch (error) {
      console.error("Error deleting wedding RSVP:", error);
      alert("Fehler beim Löschen der RSVP-Antwort. Bitte versuche es erneut.");
    }
  };

  // View RSVP details
  const handleViewDetails = (rsvp: WeddingRSVP) => {
    setSelectedRSVP(rsvp);
    setIsDetailsOpen(true);
  };

  // Calculate statistics
  const totalGuests = rsvps.length;
  const attendingGuests = rsvps.filter(rsvp => rsvp.attending).length;
  const decliningGuests = rsvps.filter(rsvp => !rsvp.attending).length;
  const totalAttendees = rsvps.reduce((sum, rsvp) => rsvp.attending ? sum + rsvp.number_of_guests : sum, 0);

  if (loading) {
    return <div className="flex justify-center p-8">Lade RSVP-Antworten...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>RSVP-Verwaltung</CardTitle>
        <CardDescription>
          Verwalte die Zu- und Absagen deiner Gäste
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* RSVP Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">Gesamt</p>
                <p className="text-3xl font-bold">{totalGuests}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">Zusagen</p>
                <p className="text-3xl font-bold text-green-600">{attendingGuests}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">Absagen</p>
                <p className="text-3xl font-bold text-red-600">{decliningGuests}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">Personen gesamt</p>
                <p className="text-3xl font-bold">{totalAttendees}</p>
              </CardContent>
            </Card>
          </div>

          {/* RSVP List */}
          {rsvps.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Noch keine RSVP-Antworten vorhanden.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Anzahl</TableHead>
                    <TableHead>Kontakt</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rsvps.map(rsvp => (
                    <TableRow key={rsvp.id}>
                      <TableCell className="font-medium">{rsvp.name}</TableCell>
                      <TableCell>
                        {rsvp.attending ? (
                          <Badge variant="success" className="flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            Zusage
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <X className="h-3 w-3" />
                            Absage
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{rsvp.number_of_guests}</TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          {rsvp.email && (
                            <div className="flex items-center text-xs">
                              <Mail className="mr-1 h-3 w-3 text-muted-foreground" />
                              {rsvp.email}
                            </div>
                          )}
                          {rsvp.phone && (
                            <div className="flex items-center text-xs">
                              <Phone className="mr-1 h-3 w-3 text-muted-foreground" />
                              {rsvp.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(rsvp)}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRSVP(rsvp.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>

      {/* RSVP Details Dialog */}
      {selectedRSVP && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>RSVP-Details</DialogTitle>
              <DialogDescription>
                Details zur Antwort von {selectedRSVP.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Status</h3>
                <p>
                  {selectedRSVP.attending ? (
                    <Badge variant="success" className="mt-1">Zusage</Badge>
                  ) : (
                    <Badge variant="destructive" className="mt-1">Absage</Badge>
                  )}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Anzahl der Personen</h3>
                <p>{selectedRSVP.number_of_guests}</p>
              </div>
              
              {selectedRSVP.email && (
                <div>
                  <h3 className="text-sm font-medium">E-Mail</h3>
                  <p>{selectedRSVP.email}</p>
                </div>
              )}
              
              {selectedRSVP.phone && (
                <div>
                  <h3 className="text-sm font-medium">Telefon</h3>
                  <p>{selectedRSVP.phone}</p>
                </div>
              )}
              
              {selectedRSVP.dietary_restrictions && (
                <div>
                  <h3 className="text-sm font-medium">Ernährungsbesonderheiten</h3>
                  <p>{selectedRSVP.dietary_restrictions}</p>
                </div>
              )}
              
              {selectedRSVP.message && (
                <div>
                  <h3 className="text-sm font-medium">Nachricht</h3>
                  <p className="whitespace-pre-wrap">{selectedRSVP.message}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium">Eingegangen am</h3>
                <p>{new Date(selectedRSVP.created_at!).toLocaleString('de-DE')}</p>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="destructive" 
                onClick={() => {
                  handleDeleteRSVP(selectedRSVP.id!);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Löschen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default WeddingRSVPManager;
