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
import { PlusCircle, Trash2, Edit, MapPin, Clock } from "lucide-react";
import { JGAActivity, JGAParticipant } from "@/types/jga";
import { 
  createJGAActivity, 
  getJGAActivitiesByEvent, 
  updateJGAActivity,
  deleteJGAActivity
} from "@/services/jgaService";

interface JGAActivityPlannerProps {
  eventId: string;
  currentParticipantId: string;
  participants: JGAParticipant[];
  isOrganizer: boolean;
}

const JGAActivityPlanner: React.FC<JGAActivityPlannerProps> = ({ 
  eventId, 
  currentParticipantId, 
  participants, 
  isOrganizer 
}) => {
  const [activities, setActivities] = useState<JGAActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("list");
  
  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [newCostPerPerson, setNewCostPerPerson] = useState("");
  const [addingActivity, setAddingActivity] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);

  // Load activities
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getJGAActivitiesByEvent(eventId);
        setActivities(data);
      } catch (error) {
        console.error("Error loading activities:", error);
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
    setNewLocation("");
    setNewStartTime("");
    setNewEndTime("");
    setNewCostPerPerson("");
    setEditingActivityId(null);
  };

  // Set form for editing
  const setFormForEditing = (activity: JGAActivity) => {
    setNewTitle(activity.title);
    setNewDescription(activity.description || "");
    setNewLocation(activity.location || "");
    setNewStartTime(activity.start_time || "");
    setNewEndTime(activity.end_time || "");
    setNewCostPerPerson(activity.cost_per_person ? activity.cost_per_person.toString() : "");
    setEditingActivityId(activity.id!);
  };

  // Add or update an activity
  const handleSaveActivity = async () => {
    if (!newTitle) return;
    
    try {
      setAddingActivity(true);
      
      const costPerPerson = newCostPerPerson ? parseFloat(newCostPerPerson) : undefined;
      
      const activityData = {
        title: newTitle,
        description: newDescription || undefined,
        location: newLocation || undefined,
        start_time: newStartTime || undefined,
        end_time: newEndTime || undefined,
        cost_per_person: costPerPerson,
        event_id: eventId
      };
      
      let savedActivity: JGAActivity;
      
      if (editingActivityId) {
        // Update existing activity
        savedActivity = await updateJGAActivity(editingActivityId, activityData);
        setActivities(activities.map(activity => 
          activity.id === editingActivityId ? savedActivity : activity
        ));
      } else {
        // Create new activity
        savedActivity = await createJGAActivity(activityData);
        setActivities([...activities, savedActivity]);
      }
      
      resetForm();
    } catch (error) {
      console.error("Error saving activity:", error);
    } finally {
      setAddingActivity(false);
    }
  };

  // Delete an activity
  const handleDeleteActivity = async (activityId: string) => {
    try {
      await deleteJGAActivity(activityId);
      setActivities(activities.filter(activity => activity.id !== activityId));
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  // Sort activities by start time
  const sortedActivities = [...activities].sort((a, b) => {
    if (!a.start_time && !b.start_time) return 0;
    if (!a.start_time) return 1;
    if (!b.start_time) return -1;
    return a.start_time.localeCompare(b.start_time);
  });

  // Group activities by time (for timeline view)
  const groupedActivities = sortedActivities.reduce<Record<string, JGAActivity[]>>((groups, activity) => {
    const timeKey = activity.start_time || "Ohne Zeitangabe";
    if (!groups[timeKey]) {
      groups[timeKey] = [];
    }
    groups[timeKey].push(activity);
    return groups;
  }, {});

  if (loading) {
    return <div className="flex justify-center p-8">Lade Aktivitäten...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Aktivitätenplanung</CardTitle>
        <CardDescription>
          Plane die Aktivitäten für den JGA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Liste</TabsTrigger>
            <TabsTrigger value="timeline">Zeitplan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="pt-4">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Noch keine Aktivitäten geplant.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aktivität</TableHead>
                    <TableHead>Zeit</TableHead>
                    <TableHead>Ort</TableHead>
                    <TableHead>Kosten pro Person</TableHead>
                    {isOrganizer && <TableHead className="w-[100px]">Aktionen</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedActivities.map(activity => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          {activity.description && (
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {activity.start_time && (
                          <div className="flex items-center">
                            <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span>{activity.start_time}</span>
                            {activity.end_time && <span> - {activity.end_time}</span>}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {activity.location && (
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span>{activity.location}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {activity.cost_per_person !== undefined && activity.cost_per_person !== null
                          ? `${activity.cost_per_person.toFixed(2)} €`
                          : "-"
                        }
                      </TableCell>
                      {isOrganizer && (
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFormForEditing(activity)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteActivity(activity.id!)}
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
          
          <TabsContent value="timeline" className="pt-4">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Noch keine Aktivitäten geplant.
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted"></div>
                
                <div className="space-y-8 ml-12 relative">
                  {Object.entries(groupedActivities).map(([timeKey, timeActivities]) => (
                    <div key={timeKey} className="relative">
                      {/* Time marker */}
                      <div className="absolute -left-12 -top-1 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                        <Clock className="h-4 w-4" />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">{timeKey}</h3>
                        <div className="space-y-4">
                          {timeActivities.map(activity => (
                            <div key={activity.id} className="bg-card border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-bold">{activity.title}</h4>
                                  {activity.description && (
                                    <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                                  )}
                                </div>
                                {isOrganizer && (
                                  <div className="flex space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setFormForEditing(activity)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteActivity(activity.id!)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap gap-2 mt-2">
                                {activity.location && (
                                  <Badge variant="outline" className="flex items-center">
                                    <MapPin className="mr-1 h-3 w-3" />
                                    {activity.location}
                                  </Badge>
                                )}
                                {activity.cost_per_person !== undefined && activity.cost_per_person !== null && (
                                  <Badge variant="outline">
                                    {activity.cost_per_person.toFixed(2)} € pro Person
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      {isOrganizer && (
        <CardFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Neue Aktivität hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingActivityId ? "Aktivität bearbeiten" : "Neue Aktivität hinzufügen"}
                </DialogTitle>
                <DialogDescription>
                  Füge eine neue Aktivität zum JGA-Programm hinzu.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Titel</Label>
                  <Input
                    id="title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="z.B. Kletterpark"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Beschreibung (optional)</Label>
                  <Textarea
                    id="description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Weitere Details zur Aktivität"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="location">Ort (optional)</Label>
                  <Input
                    id="location"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="z.B. Waldpark Hochseilgarten"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startTime">Startzeit (optional)</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newStartTime}
                      onChange={(e) => setNewStartTime(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="endTime">Endzeit (optional)</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newEndTime}
                      onChange={(e) => setNewEndTime(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="costPerPerson">Kosten pro Person (€, optional)</Label>
                  <Input
                    id="costPerPerson"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newCostPerPerson}
                    onChange={(e) => setNewCostPerPerson(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleSaveActivity} 
                  disabled={!newTitle || addingActivity}
                >
                  {addingActivity ? "Wird gespeichert..." : (editingActivityId ? "Aktualisieren" : "Hinzufügen")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      )}
    </Card>
  );
};

export default JGAActivityPlanner;
