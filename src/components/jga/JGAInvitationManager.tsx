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
import { PlusCircle, Trash2, Edit, Mail, Send, Copy, Check } from "lucide-react";
import { JGAParticipant } from "@/types/jga";
import { 
  createJGAParticipant, 
  getJGAParticipantsByEvent, 
  updateJGAParticipant,
  deleteJGAParticipant
} from "@/services/jgaService";

interface JGAInvitationManagerProps {
  eventId: string;
  currentParticipantId: string;
  isOrganizer: boolean;
}

const JGAInvitationManager: React.FC<JGAInvitationManagerProps> = ({ 
  eventId, 
  currentParticipantId, 
  isOrganizer 
}) => {
  const [participants, setParticipants] = useState<JGAParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteLink, setInviteLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  
  // Form states
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRsvpStatus, setNewRsvpStatus] = useState<"pending" | "confirmed" | "declined">("pending");
  const [addingParticipant, setAddingParticipant] = useState(false);
  const [editingParticipantId, setEditingParticipantId] = useState<string | null>(null);

  // Load participants
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getJGAParticipantsByEvent(eventId);
        setParticipants(data);
        
        // Generate invite link
        const baseUrl = window.location.origin;
        setInviteLink(`${baseUrl}/jga/invite/${eventId}`);
      } catch (error) {
        console.error("Error loading participants:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [eventId]);

  // Reset form
  const resetForm = () => {
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setNewRsvpStatus("pending");
    setEditingParticipantId(null);
  };

  // Set form for editing
  const setFormForEditing = (participant: JGAParticipant) => {
    setNewName(participant.name);
    setNewEmail(participant.email || "");
    setNewPhone(participant.phone || "");
    setNewRsvpStatus(participant.rsvp_status as "pending" | "confirmed" | "declined");
    setEditingParticipantId(participant.id!);
  };

  // Add or update a participant
  const handleSaveParticipant = async () => {
    if (!newName) return;
    
    try {
      setAddingParticipant(true);
      
      const participantData = {
        name: newName,
        email: newEmail || undefined,
        phone: newPhone || undefined,
        rsvp_status: newRsvpStatus,
        is_organizer: false, // Only the creator can be organizer
        user_id: undefined, // Will be set when user registers
        event_id: eventId
      };
      
      let savedParticipant: JGAParticipant;
      
      if (editingParticipantId) {
        // Update existing participant
        savedParticipant = await updateJGAParticipant(editingParticipantId, participantData);
        setParticipants(participants.map(participant => 
          participant.id === editingParticipantId ? savedParticipant : participant
        ));
      } else {
        // Create new participant
        savedParticipant = await createJGAParticipant(participantData);
        setParticipants([...participants, savedParticipant]);
      }
      
      resetForm();
    } catch (error) {
      console.error("Error saving participant:", error);
    } finally {
      setAddingParticipant(false);
    }
  };

  // Delete a participant
  const handleDeleteParticipant = async (participantId: string) => {
    try {
      await deleteJGAParticipant(participantId);
      setParticipants(participants.filter(participant => participant.id !== participantId));
    } catch (error) {
      console.error("Error deleting participant:", error);
    }
  };

  // Update RSVP status
  const handleUpdateRsvpStatus = async (participantId: string, status: "pending" | "confirmed" | "declined") => {
    try {
      const updatedParticipant = await updateJGAParticipant(participantId, { rsvp_status: status });
      setParticipants(participants.map(participant => 
        participant.id === participantId ? updatedParticipant : participant
      ));
    } catch (error) {
      console.error("Error updating RSVP status:", error);
    }
  };

  // Copy invite link to clipboard
  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  // Send email invitation
  const handleSendEmailInvitation = async (email: string) => {
    // In a real app, this would send an email with the invite link
    alert(`Email invitation would be sent to ${email} with link: ${inviteLink}`);
  };

  // Get RSVP status badge
  const getRsvpStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Ausstehend</Badge>;
      case "confirmed":
        return <Badge variant="success">Zugesagt</Badge>;
      case "declined":
        return <Badge variant="destructive">Abgesagt</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Count participants by RSVP status
  const confirmedCount = participants.filter(p => p.rsvp_status === "confirmed").length;
  const pendingCount = participants.filter(p => p.rsvp_status === "pending").length;
  const declinedCount = participants.filter(p => p.rsvp_status === "declined").length;

  if (loading) {
    return <div className="flex justify-center p-8">Lade Teilnehmer...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Einladungsverwaltung</CardTitle>
        <CardDescription>
          Verwalte Einladungen und Teilnehmer für den JGA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Invite Link */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Einladungslink</h3>
            <div className="flex items-center gap-2">
              <Input value={inviteLink} readOnly className="flex-1" />
              <Button variant="outline" onClick={handleCopyInviteLink}>
                {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Teile diesen Link, um Teilnehmer zum JGA einzuladen.
            </p>
          </div>

          {/* Participants Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg text-center">
              <h4 className="font-medium">Gesamt</h4>
              <p className="text-2xl font-bold">{participants.length}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
              <h4 className="font-medium">Zugesagt</h4>
              <p className="text-2xl font-bold">{confirmedCount}</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg text-center">
              <h4 className="font-medium">Ausstehend</h4>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
          </div>

          {/* Participants List */}
          <div>
            <h3 className="text-lg font-medium mb-2">Teilnehmer</h3>
            {participants.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground border rounded-lg">
                Noch keine Teilnehmer vorhanden.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Kontakt</TableHead>
                    <TableHead>Status</TableHead>
                    {isOrganizer && <TableHead className="text-right">Aktionen</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map(participant => (
                    <TableRow key={participant.id}>
                      <TableCell>
                        <div className="font-medium">
                          {participant.name}
                          {participant.is_organizer && (
                            <Badge variant="outline" className="ml-2">Organisator</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {participant.email && (
                            <div className="flex items-center text-sm">
                              <Mail className="mr-1 h-4 w-4 text-muted-foreground" />
                              {participant.email}
                            </div>
                          )}
                          {participant.phone && (
                            <div className="text-sm">
                              {participant.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRsvpStatusBadge(participant.rsvp_status)}
                      </TableCell>
                      {isOrganizer && (
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            {participant.email && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSendEmailInvitation(participant.email!)}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFormForEditing(participant)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {!participant.is_organizer && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteParticipant(participant.id!)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </CardContent>
      {isOrganizer && (
        <CardFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Teilnehmer hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingParticipantId ? "Teilnehmer bearbeiten" : "Teilnehmer hinzufügen"}
                </DialogTitle>
                <DialogDescription>
                  Füge einen neuen Teilnehmer zum JGA hinzu.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Vollständiger Name"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">E-Mail (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="email@beispiel.de"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefon (optional)</Label>
                  <Input
                    id="phone"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+49 123 456789"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="rsvpStatus">RSVP-Status</Label>
                  <Select 
                    value={newRsvpStatus} 
                    onValueChange={(value) => setNewRsvpStatus(value as "pending" | "confirmed" | "declined")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Ausstehend</SelectItem>
                      <SelectItem value="confirmed">Zugesagt</SelectItem>
                      <SelectItem value="declined">Abgesagt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleSaveParticipant} 
                  disabled={!newName || addingParticipant}
                >
                  {addingParticipant ? "Wird gespeichert..." : (editingParticipantId ? "Aktualisieren" : "Hinzufügen")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      )}
    </Card>
  );
};

export default JGAInvitationManager;
