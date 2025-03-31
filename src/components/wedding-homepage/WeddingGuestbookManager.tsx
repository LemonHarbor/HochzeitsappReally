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
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Trash2, 
  Edit, 
  MessageSquare, 
  Heart, 
  Check 
} from "lucide-react";
import { WeddingGuestbookEntry } from "@/types/wedding-homepage";
import { 
  createWeddingGuestbookEntry, 
  getWeddingGuestbookEntriesByHomepageId, 
  updateWeddingGuestbookEntry,
  deleteWeddingGuestbookEntry
} from "@/services/weddingHomepageService";

interface WeddingGuestbookManagerProps {
  homepageId: string;
}

const WeddingGuestbookManager: React.FC<WeddingGuestbookManagerProps> = ({ homepageId }) => {
  const [entries, setEntries] = useState<WeddingGuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [savingEntry, setSavingEntry] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  // Load guestbook entries
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getWeddingGuestbookEntriesByHomepageId(homepageId, false);
        setEntries(data);
      } catch (error) {
        console.error("Error loading wedding guestbook entries:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [homepageId]);

  // Reset form
  const resetForm = () => {
    setName("");
    setMessage("");
    setEditingEntryId(null);
  };

  // Set form for editing
  const setFormForEditing = (entry: WeddingGuestbookEntry) => {
    setName(entry.name);
    setMessage(entry.message);
    setEditingEntryId(entry.id!);
  };

  // Save guestbook entry
  const handleSaveEntry = async () => {
    if (!name || !message) {
      alert("Bitte fülle alle Pflichtfelder aus.");
      return;
    }
    
    try {
      setSavingEntry(true);
      
      const entryData = {
        homepage_id: homepageId,
        name,
        message,
        is_approved: true // Auto-approve when added by admin
      };
      
      let savedEntry: WeddingGuestbookEntry;
      
      if (editingEntryId) {
        // Update existing entry
        savedEntry = await updateWeddingGuestbookEntry(editingEntryId, entryData);
        setEntries(entries.map(entry => 
          entry.id === editingEntryId ? savedEntry : entry
        ));
      } else {
        // Create new entry
        savedEntry = await createWeddingGuestbookEntry(entryData);
        setEntries([...entries, savedEntry]);
      }
      
      resetForm();
    } catch (error) {
      console.error("Error saving wedding guestbook entry:", error);
      alert("Fehler beim Speichern des Gästebucheintrags. Bitte versuche es erneut.");
    } finally {
      setSavingEntry(false);
    }
  };

  // Delete guestbook entry
  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm("Bist du sicher, dass du diesen Gästebucheintrag löschen möchtest?")) {
      return;
    }
    
    try {
      await deleteWeddingGuestbookEntry(entryId);
      setEntries(entries.filter(entry => entry.id !== entryId));
    } catch (error) {
      console.error("Error deleting wedding guestbook entry:", error);
      alert("Fehler beim Löschen des Gästebucheintrags. Bitte versuche es erneut.");
    }
  };

  // Toggle approval status
  const handleToggleApproval = async (entryId: string, isApproved: boolean) => {
    try {
      const updatedEntry = await updateWeddingGuestbookEntry(entryId, { is_approved: !isApproved });
      setEntries(entries.map(entry => 
        entry.id === entryId ? updatedEntry : entry
      ));
    } catch (error) {
      console.error("Error toggling guestbook entry approval:", error);
      alert("Fehler beim Aktualisieren des Genehmigungsstatus. Bitte versuche es erneut.");
    }
  };

  // Filter entries by approval status
  const approvedEntries = entries.filter(entry => entry.is_approved);
  const pendingEntries = entries.filter(entry => !entry.is_approved);

  if (loading) {
    return <div className="flex justify-center p-8">Lade Gästebucheinträge...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gästebuch</CardTitle>
        <CardDescription>
          Verwalte die Einträge im Gästebuch deiner Hochzeitshomepage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Pending Entries */}
          {pendingEntries.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Ausstehende Einträge</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Nachricht</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingEntries.map(entry => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{entry.message}</TableCell>
                        <TableCell>{new Date(entry.created_at!).toLocaleDateString('de-DE')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleApproval(entry.id!, entry.is_approved)}
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Genehmigen
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFormForEditing(entry)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEntry(entry.id!)}
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
            </div>
          )}

          {/* Approved Entries */}
          <div>
            <h3 className="text-lg font-medium mb-2">Genehmigte Einträge</h3>
            {approvedEntries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded-lg">
                Noch keine genehmigten Gästebucheinträge vorhanden.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {approvedEntries.map(entry => (
                  <Card key={entry.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium flex items-center">
                            {entry.name}
                            <Badge variant="outline" className="ml-2">Genehmigt</Badge>
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(entry.created_at!).toLocaleDateString('de-DE')}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleApproval(entry.id!, entry.is_approved)}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFormForEditing(entry)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEntry(entry.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-2 p-3 bg-muted rounded-md">
                        <p className="italic whitespace-pre-wrap">{entry.message}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Eintrag hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingEntryId ? "Gästebucheintrag bearbeiten" : "Neuen Gästebucheintrag hinzufügen"}
              </DialogTitle>
              <DialogDescription>
                Füge einen Eintrag zum Gästebuch hinzu.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name*</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="z.B. Familie Müller"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="message">Nachricht*</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Deine Nachricht an das Brautpaar..."
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleSaveEntry} 
                disabled={!name || !message || savingEntry}
              >
                {savingEntry ? "Wird gespeichert..." : (editingEntryId ? "Aktualisieren" : "Hinzufügen")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default WeddingGuestbookManager;
