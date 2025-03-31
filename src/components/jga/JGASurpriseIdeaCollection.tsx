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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, Edit, ThumbsUp, ThumbsDown, Lock, Eye } from "lucide-react";
import { JGASurpriseIdea, JGAParticipant } from "@/types/jga";
import { 
  createJGASurpriseIdea, 
  getJGASurpriseIdeasByEvent, 
  updateJGASurpriseIdea,
  deleteJGASurpriseIdea
} from "@/services/jgaService";

interface JGASurpriseIdeaCollectionProps {
  eventId: string;
  currentParticipantId: string;
  participants: JGAParticipant[];
  isOrganizer: boolean;
}

const JGASurpriseIdeaCollection: React.FC<JGASurpriseIdeaCollectionProps> = ({ 
  eventId, 
  currentParticipantId, 
  participants, 
  isOrganizer 
}) => {
  const [ideas, setIdeas] = useState<JGASurpriseIdea[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [addingIdea, setAddingIdea] = useState(false);
  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);

  // Load ideas
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getJGASurpriseIdeasByEvent(eventId);
        setIdeas(data);
      } catch (error) {
        console.error("Error loading surprise ideas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [eventId]);

  // Reset form
  const resetForm = () => {
    setNewTitle("");
    setNewDescription("");
    setEditingIdeaId(null);
  };

  // Set form for editing
  const setFormForEditing = (idea: JGASurpriseIdea) => {
    setNewTitle(idea.title);
    setNewDescription(idea.description || "");
    setEditingIdeaId(idea.id!);
  };

  // Add or update an idea
  const handleSaveIdea = async () => {
    if (!newTitle) return;
    
    try {
      setAddingIdea(true);
      
      const ideaData = {
        title: newTitle,
        description: newDescription || undefined,
        created_by: currentParticipantId,
        is_approved: isOrganizer, // Auto-approve if organizer
        event_id: eventId
      };
      
      let savedIdea: JGASurpriseIdea;
      
      if (editingIdeaId) {
        // Update existing idea
        savedIdea = await updateJGASurpriseIdea(editingIdeaId, ideaData);
        setIdeas(ideas.map(idea => 
          idea.id === editingIdeaId ? savedIdea : idea
        ));
      } else {
        // Create new idea
        savedIdea = await createJGASurpriseIdea(ideaData);
        setIdeas([...ideas, savedIdea]);
      }
      
      resetForm();
    } catch (error) {
      console.error("Error saving surprise idea:", error);
    } finally {
      setAddingIdea(false);
    }
  };

  // Delete an idea
  const handleDeleteIdea = async (ideaId: string) => {
    try {
      await deleteJGASurpriseIdea(ideaId);
      setIdeas(ideas.filter(idea => idea.id !== ideaId));
    } catch (error) {
      console.error("Error deleting surprise idea:", error);
    }
  };

  // Approve or reject an idea
  const handleApproveIdea = async (ideaId: string, approve: boolean) => {
    try {
      const updatedIdea = await updateJGASurpriseIdea(ideaId, { is_approved: approve });
      setIdeas(ideas.map(idea => 
        idea.id === ideaId ? updatedIdea : idea
      ));
    } catch (error) {
      console.error("Error updating surprise idea approval:", error);
    }
  };

  // Get participant name by ID
  const getParticipantName = (participantId: string): string => {
    const participant = participants.find(p => p.id === participantId);
    return participant ? participant.name : "Unbekannt";
  };

  // Filter ideas by approval status
  const approvedIdeas = ideas.filter(idea => idea.is_approved);
  const pendingIdeas = ideas.filter(idea => !idea.is_approved);

  if (loading) {
    return <div className="flex justify-center p-8">Lade Überraschungsideen...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="mr-2 h-5 w-5 text-muted-foreground" />
          Überraschungsideen
        </CardTitle>
        <CardDescription>
          Sammle Ideen für Überraschungen, die vor dem Brautpaar geheim bleiben
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Approved Ideas */}
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <ThumbsUp className="mr-2 h-4 w-4 text-green-500" />
              Genehmigte Ideen
            </h3>
            {approvedIdeas.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground border rounded-lg">
                Noch keine genehmigten Überraschungsideen vorhanden.
              </div>
            ) : (
              <div className="space-y-2">
                {approvedIdeas.map(idea => (
                  <div key={idea.id} className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{idea.title}</h4>
                        {idea.description && (
                          <p className="text-sm mt-1">{idea.description}</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">
                          Vorgeschlagen von: {getParticipantName(idea.created_by)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {(isOrganizer || idea.created_by === currentParticipantId) && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFormForEditing(idea)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Überraschungsidee löschen</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bist du sicher, dass du diese Überraschungsidee löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteIdea(idea.id!)}>
                                    Löschen
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Ideas (only visible to organizers) */}
          {isOrganizer && (
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <Eye className="mr-2 h-4 w-4 text-amber-500" />
                Ideen zur Prüfung
              </h3>
              {pendingIdeas.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground border rounded-lg">
                  Keine Ideen zur Prüfung vorhanden.
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingIdeas.map(idea => (
                    <div key={idea.id} className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{idea.title}</h4>
                          {idea.description && (
                            <p className="text-sm mt-1">{idea.description}</p>
                          )}
                          <p className="text-sm text-muted-foreground mt-2">
                            Vorgeschlagen von: {getParticipantName(idea.created_by)}
                          </p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600"
                              onClick={() => handleApproveIdea(idea.id!, true)}
                            >
                              <ThumbsUp className="mr-1 h-4 w-4" />
                              Genehmigen
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleDeleteIdea(idea.id!)}
                            >
                              <ThumbsDown className="mr-1 h-4 w-4" />
                              Ablehnen
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFormForEditing(idea)}
                          >
                            <Edit className="mr-1 h-4 w-4" />
                            Bearbeiten
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Ideas (non-organizers can see their own pending ideas) */}
          {!isOrganizer && (
            <div>
              <h3 className="text-lg font-medium mb-2">Meine vorgeschlagenen Ideen</h3>
              {ideas.filter(idea => idea.created_by === currentParticipantId).length === 0 ? (
                <div className="text-center py-4 text-muted-foreground border rounded-lg">
                  Du hast noch keine Ideen vorgeschlagen.
                </div>
              ) : (
                <div className="space-y-2">
                  {ideas
                    .filter(idea => idea.created_by === currentParticipantId)
                    .map(idea => (
                      <div key={idea.id} className={`p-4 border rounded-lg ${
                        idea.is_approved 
                          ? "bg-green-50 dark:bg-green-900/20" 
                          : "bg-amber-50 dark:bg-amber-900/20"
                      }`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{idea.title}</h4>
                              <Badge variant={idea.is_approved ? "success" : "outline"}>
                                {idea.is_approved ? "Genehmigt" : "Ausstehend"}
                              </Badge>
                            </div>
                            {idea.description && (
                              <p className="text-sm mt-1">{idea.description}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFormForEditing(idea)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteIdea(idea.id!)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Neue Überraschungsidee vorschlagen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingIdeaId ? "Überraschungsidee bearbeiten" : "Neue Überraschungsidee vorschlagen"}
              </DialogTitle>
              <DialogDescription>
                Schlage eine Überraschung für den JGA vor, die vor dem Brautpaar geheim bleibt.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="z.B. Überraschungsbesuch von..."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Beschreibung (optional)</Label>
                <Textarea
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Weitere Details zur Überraschungsidee"
                />
              </div>
              
              {!isOrganizer && (
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  <p className="flex items-center">
                    <Lock className="mr-2 h-4 w-4" />
                    Dein Vorschlag wird von den Organisatoren geprüft, bevor er für alle sichtbar wird.
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                onClick={handleSaveIdea} 
                disabled={!newTitle || addingIdea}
              >
                {addingIdea ? "Wird gespeichert..." : (editingIdeaId ? "Aktualisieren" : "Vorschlagen")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default JGASurpriseIdeaCollection;
