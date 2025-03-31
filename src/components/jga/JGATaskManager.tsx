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
import { PlusCircle, Trash2, Edit, Calendar, CheckCircle2 } from "lucide-react";
import { JGATask, JGAParticipant } from "@/types/jga";
import { 
  createJGATask, 
  getJGATasksByEvent, 
  updateJGATask,
  deleteJGATask
} from "@/services/jgaService";

interface JGATaskManagerProps {
  eventId: string;
  currentParticipantId: string;
  participants: JGAParticipant[];
  isOrganizer: boolean;
}

const JGATaskManager: React.FC<JGATaskManagerProps> = ({ 
  eventId, 
  currentParticipantId, 
  participants, 
  isOrganizer 
}) => {
  const [tasks, setTasks] = useState<JGATask[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAssignedTo, setNewAssignedTo] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newStatus, setNewStatus] = useState<"pending" | "in_progress" | "completed">("pending");
  const [addingTask, setAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Load tasks
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getJGATasksByEvent(eventId);
        setTasks(data);
      } catch (error) {
        console.error("Error loading tasks:", error);
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
    setNewAssignedTo("");
    setNewDueDate("");
    setNewStatus("pending");
    setEditingTaskId(null);
  };

  // Set form for editing
  const setFormForEditing = (task: JGATask) => {
    setNewTitle(task.title);
    setNewDescription(task.description || "");
    setNewAssignedTo(task.assigned_to || "");
    setNewDueDate(task.due_date || "");
    setNewStatus(task.status as "pending" | "in_progress" | "completed");
    setEditingTaskId(task.id!);
  };

  // Add or update a task
  const handleSaveTask = async () => {
    if (!newTitle) return;
    
    try {
      setAddingTask(true);
      
      const taskData = {
        title: newTitle,
        description: newDescription || undefined,
        assigned_to: newAssignedTo || undefined,
        due_date: newDueDate || undefined,
        status: newStatus,
        event_id: eventId
      };
      
      let savedTask: JGATask;
      
      if (editingTaskId) {
        // Update existing task
        savedTask = await updateJGATask(editingTaskId, taskData);
        setTasks(tasks.map(task => 
          task.id === editingTaskId ? savedTask : task
        ));
      } else {
        // Create new task
        savedTask = await createJGATask(taskData);
        setTasks([...tasks, savedTask]);
      }
      
      resetForm();
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setAddingTask(false);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteJGATask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Update task status
  const handleUpdateStatus = async (taskId: string, newStatus: "pending" | "in_progress" | "completed") => {
    try {
      const updatedTask = await updateJGATask(taskId, { status: newStatus });
      setTasks(tasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Get participant name by ID
  const getParticipantName = (participantId: string): string => {
    const participant = participants.find(p => p.id === participantId);
    return participant ? participant.name : "Nicht zugewiesen";
  };

  // Format date for display
  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('de-DE');
    } catch (error) {
      return dateStr;
    }
  };

  // Filter tasks by status
  const pendingTasks = tasks.filter(task => task.status === "pending");
  const inProgressTasks = tasks.filter(task => task.status === "in_progress");
  const completedTasks = tasks.filter(task => task.status === "completed");

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Offen</Badge>;
      case "in_progress":
        return <Badge variant="secondary">In Bearbeitung</Badge>;
      case "completed":
        return <Badge variant="success">Erledigt</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Lade Aufgaben...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Aufgabenverwaltung</CardTitle>
        <CardDescription>
          Verwalte Aufgaben für die Organisation des JGA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Pending Tasks */}
          <div>
            <h3 className="text-lg font-medium mb-2">Offene Aufgaben</h3>
            {pendingTasks.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground border rounded-lg">
                Keine offenen Aufgaben vorhanden.
              </div>
            ) : (
              <div className="space-y-2">
                {pendingTasks.map(task => (
                  <div key={task.id} className="flex justify-between items-start p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{task.title}</h4>
                        {getStatusBadge(task.status)}
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Zugewiesen an:</span>
                          {task.assigned_to ? getParticipantName(task.assigned_to) : "Nicht zugewiesen"}
                        </div>
                        {task.due_date && (
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            {formatDate(task.due_date)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {(isOrganizer || task.assigned_to === currentParticipantId) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(task.id!, "in_progress")}
                        >
                          Starten
                        </Button>
                      )}
                      {isOrganizer && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFormForEditing(task)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTask(task.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* In Progress Tasks */}
          <div>
            <h3 className="text-lg font-medium mb-2">Aufgaben in Bearbeitung</h3>
            {inProgressTasks.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground border rounded-lg">
                Keine Aufgaben in Bearbeitung.
              </div>
            ) : (
              <div className="space-y-2">
                {inProgressTasks.map(task => (
                  <div key={task.id} className="flex justify-between items-start p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{task.title}</h4>
                        {getStatusBadge(task.status)}
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Zugewiesen an:</span>
                          {task.assigned_to ? getParticipantName(task.assigned_to) : "Nicht zugewiesen"}
                        </div>
                        {task.due_date && (
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            {formatDate(task.due_date)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {(isOrganizer || task.assigned_to === currentParticipantId) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(task.id!, "completed")}
                        >
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          Abschließen
                        </Button>
                      )}
                      {isOrganizer && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFormForEditing(task)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTask(task.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Tasks */}
          <div>
            <h3 className="text-lg font-medium mb-2">Erledigte Aufgaben</h3>
            {completedTasks.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground border rounded-lg">
                Keine erledigten Aufgaben vorhanden.
              </div>
            ) : (
              <div className="space-y-2">
                {completedTasks.map(task => (
                  <div key={task.id} className="flex justify-between items-start p-4 border rounded-lg bg-muted/30">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{task.title}</h4>
                        {getStatusBadge(task.status)}
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Erledigt von:</span>
                          {task.assigned_to ? getParticipantName(task.assigned_to) : "Nicht zugewiesen"}
                        </div>
                      </div>
                    </div>
                    {isOrganizer && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateStatus(task.id!, "pending")}
                        >
                          Wiedereröffnen
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
                Neue Aufgabe hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingTaskId ? "Aufgabe bearbeiten" : "Neue Aufgabe hinzufügen"}
                </DialogTitle>
                <DialogDescription>
                  Füge eine neue Aufgabe für die Organisation des JGA hinzu.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Titel</Label>
                  <Input
                    id="title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="z.B. Hotelreservierung"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Beschreibung (optional)</Label>
                  <Textarea
                    id="description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Weitere Details zur Aufgabe"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="assignedTo">Zugewiesen an (optional)</Label>
                  <Select 
                    value={newAssignedTo} 
                    onValueChange={setNewAssignedTo}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wähle eine Person" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nicht zugewiesen</SelectItem>
                      {participants.map(participant => (
                        <SelectItem key={participant.id} value={participant.id!}>
                          {participant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Fälligkeitsdatum (optional)</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={newStatus} 
                    onValueChange={(value) => setNewStatus(value as "pending" | "in_progress" | "completed")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Offen</SelectItem>
                      <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                      <SelectItem value="completed">Erledigt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleSaveTask} 
                  disabled={!newTitle || addingTask}
                >
                  {addingTask ? "Wird gespeichert..." : (editingTaskId ? "Aktualisieren" : "Hinzufügen")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      )}
    </Card>
  );
};

export default JGATaskManager;
