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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Trash2, Edit, Euro } from "lucide-react";
import { JGABudgetItem, JGABudgetSplit, JGAParticipant } from "@/types/jga";
import { 
  createJGABudgetItem, 
  getJGABudgetItemsByEvent, 
  updateJGABudgetItem,
  deleteJGABudgetItem,
  getJGABudgetSplitsByItem,
  createJGABudgetSplit,
  updateJGABudgetSplit
} from "@/services/jgaService";

interface JGABudgetManagerProps {
  eventId: string;
  currentParticipantId: string;
  participants: JGAParticipant[];
  isOrganizer: boolean;
}

const JGABudgetManager: React.FC<JGABudgetManagerProps> = ({ 
  eventId, 
  currentParticipantId, 
  participants, 
  isOrganizer 
}) => {
  const [budgetItems, setBudgetItems] = useState<JGABudgetItem[]>([]);
  const [budgetSplits, setBudgetSplits] = useState<Record<string, JGABudgetSplit[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Form states
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");
  const [newItemPaidBy, setNewItemPaidBy] = useState("");
  const [newItemSplitType, setNewItemSplitType] = useState<"equal" | "custom" | "individual">("equal");
  const [customSplits, setCustomSplits] = useState<Record<string, number>>({});
  const [addingItem, setAddingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Load budget items and splits
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load budget items
        const items = await getJGABudgetItemsByEvent(eventId);
        setBudgetItems(items);

        // Load splits for each item
        const splitsData: Record<string, JGABudgetSplit[]> = {};
        for (const item of items) {
          const itemSplits = await getJGABudgetSplitsByItem(item.id!);
          splitsData[item.id!] = itemSplits;
        }
        setBudgetSplits(splitsData);
      } catch (error) {
        console.error("Error loading budget data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [eventId]);

  // Reset form
  const resetForm = () => {
    setNewItemTitle("");
    setNewItemDescription("");
    setNewItemAmount("");
    setNewItemPaidBy("");
    setNewItemSplitType("equal");
    setCustomSplits({});
    setEditingItemId(null);
  };

  // Set form for editing
  const setFormForEditing = (item: JGABudgetItem) => {
    setNewItemTitle(item.title);
    setNewItemDescription(item.description || "");
    setNewItemAmount(item.amount.toString());
    setNewItemPaidBy(item.paid_by || "");
    setNewItemSplitType(item.split_type as "equal" | "custom" | "individual");
    
    // If custom split, load the existing splits
    if (item.split_type === "custom" && budgetSplits[item.id!]) {
      const splits: Record<string, number> = {};
      budgetSplits[item.id!].forEach(split => {
        splits[split.participant_id] = split.amount;
      });
      setCustomSplits(splits);
    }
    
    setEditingItemId(item.id!);
  };

  // Add or update a budget item
  const handleSaveBudgetItem = async () => {
    if (!newItemTitle || !newItemAmount) return;
    
    try {
      setAddingItem(true);
      
      const amount = parseFloat(newItemAmount);
      if (isNaN(amount)) return;
      
      const itemData = {
        title: newItemTitle,
        description: newItemDescription || undefined,
        amount,
        paid_by: newItemPaidBy || undefined,
        split_type: newItemSplitType,
        event_id: eventId
      };
      
      let savedItem: JGABudgetItem;
      
      if (editingItemId) {
        // Update existing item
        savedItem = await updateJGABudgetItem(editingItemId, itemData);
        setBudgetItems(budgetItems.map(item => 
          item.id === editingItemId ? savedItem : item
        ));
      } else {
        // Create new item
        savedItem = await createJGABudgetItem(itemData);
        setBudgetItems([...budgetItems, savedItem]);
      }
      
      // Handle splits based on split type
      const newSplits: JGABudgetSplit[] = [];
      
      if (newItemSplitType === "equal") {
        // Equal split among all participants
        const splitAmount = amount / participants.length;
        
        for (const participant of participants) {
          const splitData = {
            budget_item_id: savedItem.id!,
            participant_id: participant.id!,
            amount: splitAmount,
            is_paid: participant.id === newItemPaidBy // Auto-mark as paid if this participant paid
          };
          
          const split = await createJGABudgetSplit(splitData);
          newSplits.push(split);
        }
      } else if (newItemSplitType === "custom") {
        // Custom split based on entered values
        for (const [participantId, splitAmount] of Object.entries(customSplits)) {
          if (splitAmount > 0) {
            const splitData = {
              budget_item_id: savedItem.id!,
              participant_id: participantId,
              amount: splitAmount,
              is_paid: participantId === newItemPaidBy // Auto-mark as paid if this participant paid
            };
            
            const split = await createJGABudgetSplit(splitData);
            newSplits.push(split);
          }
        }
      } else if (newItemSplitType === "individual") {
        // Individual - only the person who paid
        if (newItemPaidBy) {
          const splitData = {
            budget_item_id: savedItem.id!,
            participant_id: newItemPaidBy,
            amount: amount,
            is_paid: true // Always paid since this person paid for it themselves
          };
          
          const split = await createJGABudgetSplit(splitData);
          newSplits.push(split);
        }
      }
      
      // Update splits state
      setBudgetSplits({
        ...budgetSplits,
        [savedItem.id!]: newSplits
      });
      
      resetForm();
    } catch (error) {
      console.error("Error saving budget item:", error);
    } finally {
      setAddingItem(false);
    }
  };

  // Delete a budget item
  const handleDeleteBudgetItem = async (itemId: string) => {
    try {
      await deleteJGABudgetItem(itemId);
      setBudgetItems(budgetItems.filter(item => item.id !== itemId));
      
      // Remove splits for this item
      const newSplits = { ...budgetSplits };
      delete newSplits[itemId];
      setBudgetSplits(newSplits);
    } catch (error) {
      console.error("Error deleting budget item:", error);
    }
  };

  // Toggle payment status
  const handleTogglePayment = async (splitId: string, itemId: string, isPaid: boolean) => {
    try {
      const split = budgetSplits[itemId].find(s => s.id === splitId);
      if (!split) return;
      
      const updatedSplit = await updateJGABudgetSplit(splitId, { is_paid: !isPaid });
      
      // Update splits state
      setBudgetSplits({
        ...budgetSplits,
        [itemId]: budgetSplits[itemId].map(s => 
          s.id === splitId ? updatedSplit : s
        )
      });
    } catch (error) {
      console.error("Error toggling payment status:", error);
    }
  };

  // Calculate total budget
  const calculateTotalBudget = (): number => {
    return budgetItems.reduce((total, item) => total + item.amount, 0);
  };

  // Calculate what a participant owes
  const calculateParticipantOwes = (participantId: string): number => {
    let total = 0;
    
    Object.values(budgetSplits).forEach(splits => {
      splits.forEach(split => {
        if (split.participant_id === participantId && !split.is_paid) {
          total += split.amount;
        }
      });
    });
    
    return total;
  };

  // Calculate what a participant is owed
  const calculateParticipantOwed = (participantId: string): number => {
    let total = 0;
    
    budgetItems.forEach(item => {
      if (item.paid_by === participantId) {
        const itemSplits = budgetSplits[item.id!] || [];
        itemSplits.forEach(split => {
          if (split.participant_id !== participantId && !split.is_paid) {
            total += split.amount;
          }
        });
      }
    });
    
    return total;
  };

  // Get participant name by ID
  const getParticipantName = (participantId: string): string => {
    const participant = participants.find(p => p.id === participantId);
    return participant ? participant.name : "Unbekannt";
  };

  if (loading) {
    return <div className="flex justify-center p-8">Lade Budget...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Budget</CardTitle>
        <CardDescription>
          Verwalte das Budget für den JGA und teile die Kosten auf
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="items">Ausgaben</TabsTrigger>
            <TabsTrigger value="balances">Abrechnung</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="pt-4">
            <div className="grid gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Gesamtbudget</h3>
                <p className="text-3xl font-bold">{calculateTotalBudget().toFixed(2)} €</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Du schuldest</h3>
                  <p className="text-2xl font-bold text-red-500">
                    {calculateParticipantOwes(currentParticipantId).toFixed(2)} €
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Dir wird geschuldet</h3>
                  <p className="text-2xl font-bold text-green-500">
                    {calculateParticipantOwed(currentParticipantId).toFixed(2)} €
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Letzte Ausgaben</h3>
                {budgetItems.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Noch keine Ausgaben vorhanden.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {budgetItems.slice(0, 5).map(item => (
                      <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Bezahlt von: {item.paid_by ? getParticipantName(item.paid_by) : "Nicht angegeben"}
                          </p>
                        </div>
                        <p className="font-bold">{item.amount.toFixed(2)} €</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="items" className="pt-4">
            {budgetItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Noch keine Ausgaben vorhanden.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ausgabe</TableHead>
                    <TableHead>Betrag</TableHead>
                    <TableHead>Bezahlt von</TableHead>
                    <TableHead>Aufteilung</TableHead>
                    {isOrganizer && <TableHead className="w-[100px]">Aktionen</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">{item.amount.toFixed(2)} €</TableCell>
                      <TableCell>
                        {item.paid_by ? getParticipantName(item.paid_by) : "Nicht angegeben"}
                      </TableCell>
                      <TableCell>
                        <Badge>
                          {item.split_type === "equal" && "Gleichmäßig"}
                          {item.split_type === "custom" && "Individuell"}
                          {item.split_type === "individual" && "Einzeln"}
                        </Badge>
                      </TableCell>
                      {isOrganizer && (
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFormForEditing(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteBudgetItem(item.id!)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
          
          <TabsContent value="balances" className="pt-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Deine Zahlungen</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ausgabe</TableHead>
                      <TableHead>Betrag</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(budgetSplits).flatMap(([itemId, splits]) => {
                      const item = budgetItems.find(i => i.id === itemId);
                      const participantSplit = splits.find(s => s.participant_id === currentParticipantId);
                      
                      if (!item || !participantSplit) return null;
                      
                      return (
                        <TableRow key={participantSplit.id}>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>{participantSplit.amount.toFixed(2)} €</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id={`payment-${participantSplit.id}`}
                                checked={participantSplit.is_paid}
                                onCheckedChange={() => handleTogglePayment(
                                  participantSplit.id!, 
                                  itemId, 
                                  participantSplit.is_paid
                                )}
                              />
                              <Label htmlFor={`payment-${participantSplit.id}`}>
                                {participantSplit.is_paid ? "Bezahlt" : "Unbezahlt"}
                              </Label>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Schulden der Teilnehmer</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teilnehmer</TableHead>
                      <TableHead>Schuldet dir</TableHead>
                      <TableHead>Du schuldest</TableHead>
                      <TableHead>Netto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants
                      .filter(p => p.id !== currentParticipantId)
                      .map(participant => {
                        // What this participant owes the current user
                        let owesToCurrent = 0;
                        
                        // What the current user owes this participant
                        let currentOwes = 0;
                        
                        // Calculate what this participant owes the current user
                        budgetItems.forEach(item => {
                          if (item.paid_by === currentParticipantId) {
                            const itemSplits = budgetSplits[item.id!] || [];
                            const participantSplit = itemSplits.find(s => s.participant_id === participant.id);
                            
                            if (participantSplit && !participantSplit.is_paid) {
                              owesToCurrent += participantSplit.amount;
                            }
                          }
                        });
                        
                        // Calculate what the current user owes this participant
                        budgetItems.forEach(item => {
                          if (item.paid_by === participant.id) {
                            const itemSplits = budgetSplits[item.id!] || [];
                            const currentUserSplit = itemSplits.find(s => s.participant_id === currentParticipantId);
                            
                            if (currentUserSplit && !currentUserSplit.is_paid) {
                              currentOwes += currentUserSplit.amount;
                            }
                          }
                        });
                        
                        const netAmount = owesToCurrent - currentOwes;
                        
                        return (
                          <TableRow key={participant.id}>
                            <TableCell>{participant.name}</TableCell>
                            <TableCell className="text-green-500">
                              {owesToCurrent > 0 ? `${owesToCurrent.toFixed(2)} €` : "-"}
                            </TableCell>
                            <TableCell className="text-red-500">
                              {currentOwes > 0 ? `${currentOwes.toFixed(2)} €` : "-"}
                            </TableCell>
                            <TableCell className={netAmount > 0 ? "text-green-500" : netAmount < 0 ? "text-red-500" : ""}>
                              {netAmount !== 0 ? `${netAmount.toFixed(2)} €` : "-"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      {isOrganizer && (
        <CardFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Neue Ausgabe hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingItemId ? "Ausgabe bearbeiten" : "Neue Ausgabe hinzufügen"}
                </DialogTitle>
                <DialogDescription>
                  Füge eine neue Ausgabe zum Budget hinzu und teile die Kosten auf.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Titel</Label>
                  <Input
                    id="title"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    placeholder="z.B. Hotelübernachtung"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Beschreibung (optional)</Label>
                  <Textarea
                    id="description"
                    value={newItemDescription}
                    onChange={(e) => setNewItemDescription(e.target.value)}
                    placeholder="Weitere Details zur Ausgabe"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="amount">Betrag (€)</Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newItemAmount}
                      onChange={(e) => setNewItemAmount(e.target.value)}
                      placeholder="0.00"
                      className="pl-8"
                    />
                    <Euro className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="paidBy">Bezahlt von</Label>
                  <Select 
                    value={newItemPaidBy} 
                    onValueChange={setNewItemPaidBy}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wähle eine Person" />
                    </SelectTrigger>
                    <SelectContent>
                      {participants.map(participant => (
                        <SelectItem key={participant.id} value={participant.id!}>
                          {participant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="splitType">Aufteilung</Label>
                  <Select 
                    value={newItemSplitType} 
                    onValueChange={(value) => setNewItemSplitType(value as "equal" | "custom" | "individual")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equal">Gleichmäßig auf alle aufteilen</SelectItem>
                      <SelectItem value="custom">Individuell aufteilen</SelectItem>
                      <SelectItem value="individual">Einzeln (keine Aufteilung)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {newItemSplitType === "custom" && (
                  <div className="grid gap-2 mt-2">
                    <Label>Individuelle Aufteilung</Label>
                    <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                      {participants.map(participant => (
                        <div key={participant.id} className="grid grid-cols-2 gap-2 items-center">
                          <Label htmlFor={`split-${participant.id}`}>{participant.name}</Label>
                          <div className="relative">
                            <Input
                              id={`split-${participant.id}`}
                              type="number"
                              step="0.01"
                              min="0"
                              value={customSplits[participant.id!] || ""}
                              onChange={(e) => {
                                const value = e.target.value ? parseFloat(e.target.value) : 0;
                                setCustomSplits({
                                  ...customSplits,
                                  [participant.id!]: value
                                });
                              }}
                              placeholder="0.00"
                              className="pl-8"
                            />
                            <Euro className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Summe: {Object.values(customSplits).reduce((sum, amount) => sum + amount, 0).toFixed(2)} €
                      {newItemAmount && (
                        <span className="ml-2">
                          (Differenz: {(parseFloat(newItemAmount) - Object.values(customSplits).reduce((sum, amount) => sum + amount, 0)).toFixed(2)} €)
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleSaveBudgetItem} 
                  disabled={!newItemTitle || !newItemAmount || addingItem}
                >
                  {addingItem ? "Wird gespeichert..." : (editingItemId ? "Aktualisieren" : "Hinzufügen")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      )}
    </Card>
  );
};

export default JGABudgetManager;
