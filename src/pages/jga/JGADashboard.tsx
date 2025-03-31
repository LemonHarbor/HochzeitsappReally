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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JGADatePoll from "@/components/jga/JGADatePoll";
import JGABudgetManager from "@/components/jga/JGABudgetManager";
import JGAActivityPlanner from "@/components/jga/JGAActivityPlanner";
import JGATaskManager from "@/components/jga/JGATaskManager";
import JGASurpriseIdeaCollection from "@/components/jga/JGASurpriseIdeaCollection";
import JGAInvitationManager from "@/components/jga/JGAInvitationManager";
import JGAPhotoGallery from "@/components/jga/JGAPhotoGallery";
import { JGAEvent, JGAParticipant } from "@/types/jga";
import { 
  getJGAEventById, 
  getJGAParticipantsByEvent 
} from "@/services/jgaService";
import { useAuth } from "@/hooks/useAuth";
import { CalendarDays, Users, Euro, ListTodo, Gift, Mail, Image } from "lucide-react";

interface JGADashboardProps {
  eventId: string;
}

const JGADashboard: React.FC<JGADashboardProps> = ({ eventId }) => {
  const { user } = useAuth();
  const [event, setEvent] = useState<JGAEvent | null>(null);
  const [participants, setParticipants] = useState<JGAParticipant[]>([]);
  const [currentParticipant, setCurrentParticipant] = useState<JGAParticipant | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dates");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load event details
        const eventData = await getJGAEventById(eventId);
        setEvent(eventData);

        // Load participants
        const participantsData = await getJGAParticipantsByEvent(eventId);
        setParticipants(participantsData);

        // Find current user's participant record
        const userParticipant = participantsData.find(p => p.user_id === user?.id);
        setCurrentParticipant(userParticipant || null);
      } catch (error) {
        console.error("Error loading JGA dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      loadData();
    }
  }, [eventId, user?.id]);

  if (loading) {
    return <div className="flex justify-center p-8">Lade JGA-Daten...</div>;
  }

  if (!event) {
    return <div className="text-center p-8">JGA-Event nicht gefunden.</div>;
  }

  if (!currentParticipant) {
    return <div className="text-center p-8">Du bist kein Teilnehmer dieses JGA-Events.</div>;
  }

  const isOrganizer = currentParticipant.is_organizer;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{event.title}</CardTitle>
          <CardDescription>
            {event.description || "JGA-Planung für die bevorstehende Hochzeit"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Datum</p>
              <p>{event.date}</p>
            </div>
            {event.location && (
              <div>
                <p className="text-sm font-medium">Ort</p>
                <p>{event.location}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-7">
          <TabsTrigger value="dates" className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Termine</span>
          </TabsTrigger>
          <TabsTrigger value="budget" className="flex items-center">
            <Euro className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Budget</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Aktivitäten</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center">
            <ListTodo className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Aufgaben</span>
          </TabsTrigger>
          <TabsTrigger value="surprises" className="flex items-center">
            <Gift className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Überraschungen</span>
          </TabsTrigger>
          <TabsTrigger value="invitations" className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Einladungen</span>
          </TabsTrigger>
          <TabsTrigger value="photos" className="flex items-center">
            <Image className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Fotos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dates" className="mt-6">
          <JGADatePoll 
            eventId={eventId} 
            currentParticipantId={currentParticipant.id!} 
            participants={participants}
            isOrganizer={isOrganizer}
          />
        </TabsContent>

        <TabsContent value="budget" className="mt-6">
          <JGABudgetManager 
            eventId={eventId} 
            currentParticipantId={currentParticipant.id!} 
            participants={participants}
            isOrganizer={isOrganizer}
          />
        </TabsContent>

        <TabsContent value="activities" className="mt-6">
          <JGAActivityPlanner 
            eventId={eventId} 
            currentParticipantId={currentParticipant.id!} 
            participants={participants}
            isOrganizer={isOrganizer}
          />
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <JGATaskManager 
            eventId={eventId} 
            currentParticipantId={currentParticipant.id!} 
            participants={participants}
            isOrganizer={isOrganizer}
          />
        </TabsContent>

        <TabsContent value="surprises" className="mt-6">
          <JGASurpriseIdeaCollection 
            eventId={eventId} 
            currentParticipantId={currentParticipant.id!} 
            participants={participants}
            isOrganizer={isOrganizer}
          />
        </TabsContent>

        <TabsContent value="invitations" className="mt-6">
          <JGAInvitationManager 
            eventId={eventId} 
            currentParticipantId={currentParticipant.id!} 
            isOrganizer={isOrganizer}
          />
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <JGAPhotoGallery 
            eventId={eventId} 
            currentParticipantId={currentParticipant.id!} 
            participants={participants}
            isOrganizer={isOrganizer}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JGADashboard;
