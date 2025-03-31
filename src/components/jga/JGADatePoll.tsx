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
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { JGADateOption, JGADateVote, JGAParticipant } from "@/types/jga";
import { 
  createJGADateOption, 
  getJGADateOptionsByEvent, 
  deleteJGADateOption,
  getJGADateVotesByOption,
  createJGADateVote
} from "@/services/jgaService";

interface JGADatePollProps {
  eventId: string;
  currentParticipantId: string;
  participants: JGAParticipant[];
  isOrganizer: boolean;
}

const JGADatePoll: React.FC<JGADatePollProps> = ({ 
  eventId, 
  currentParticipantId, 
  participants, 
  isOrganizer 
}) => {
  const [dateOptions, setDateOptions] = useState<JGADateOption[]>([]);
  const [votes, setVotes] = useState<Record<string, JGADateVote[]>>({});
  const [loading, setLoading] = useState(true);
  const [newDate, setNewDate] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [addingDate, setAddingDate] = useState(false);

  // Load date options and votes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load date options
        const options = await getJGADateOptionsByEvent(eventId);
        setDateOptions(options);

        // Load votes for each option
        const votesData: Record<string, JGADateVote[]> = {};
        for (const option of options) {
          const optionVotes = await getJGADateVotesByOption(option.id!);
          votesData[option.id!] = optionVotes;
        }
        setVotes(votesData);
      } catch (error) {
        console.error("Error loading date poll data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [eventId]);

  // Add a new date option
  const handleAddDateOption = async () => {
    if (!newDate) return;

    try {
      setAddingDate(true);
      const newOption = await createJGADateOption({
        event_id: eventId,
        date: newDate,
        start_time: newStartTime || undefined,
        end_time: newEndTime || undefined
      });

      setDateOptions([...dateOptions, newOption]);
      setVotes({
        ...votes,
        [newOption.id!]: []
      });

      // Reset form
      setNewDate("");
      setNewStartTime("");
      setNewEndTime("");
    } catch (error) {
      console.error("Error adding date option:", error);
    } finally {
      setAddingDate(false);
    }
  };

  // Delete a date option
  const handleDeleteDateOption = async (optionId: string) => {
    try {
      await deleteJGADateOption(optionId);
      setDateOptions(dateOptions.filter(option => option.id !== optionId));
      
      // Remove votes for this option
      const newVotes = { ...votes };
      delete newVotes[optionId];
      setVotes(newVotes);
    } catch (error) {
      console.error("Error deleting date option:", error);
    }
  };

  // Vote for a date option
  const handleVote = async (optionId: string, vote: 'yes' | 'maybe' | 'no') => {
    try {
      const newVote = await createJGADateVote({
        date_option_id: optionId,
        participant_id: currentParticipantId,
        vote
      });

      // Update votes state
      const optionVotes = votes[optionId] || [];
      const existingVoteIndex = optionVotes.findIndex(
        v => v.participant_id === currentParticipantId
      );

      if (existingVoteIndex >= 0) {
        // Replace existing vote
        const updatedVotes = [...optionVotes];
        updatedVotes[existingVoteIndex] = newVote;
        setVotes({
          ...votes,
          [optionId]: updatedVotes
        });
      } else {
        // Add new vote
        setVotes({
          ...votes,
          [optionId]: [...optionVotes, newVote]
        });
      }
    } catch (error) {
      console.error("Error voting for date option:", error);
    }
  };

  // Get participant's vote for a date option
  const getParticipantVote = (optionId: string, participantId: string): 'yes' | 'maybe' | 'no' | null => {
    const optionVotes = votes[optionId] || [];
    const vote = optionVotes.find(v => v.participant_id === participantId);
    return vote ? vote.vote as 'yes' | 'maybe' | 'no' : null;
  };

  // Count votes for a date option
  const countVotes = (optionId: string, voteType: 'yes' | 'maybe' | 'no'): number => {
    const optionVotes = votes[optionId] || [];
    return optionVotes.filter(v => v.vote === voteType).length;
  };

  // Format date for display
  const formatDate = (dateStr: string, startTime?: string, endTime?: string): string => {
    try {
      const date = new Date(dateStr);
      const formattedDate = format(date, 'EEEE, d. MMMM yyyy', { locale: de });
      
      if (startTime && endTime) {
        return `${formattedDate}, ${startTime} - ${endTime} Uhr`;
      } else if (startTime) {
        return `${formattedDate}, ab ${startTime} Uhr`;
      } else {
        return formattedDate;
      }
    } catch (error) {
      return dateStr;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Lade Terminumfrage...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Terminumfrage</CardTitle>
        <CardDescription>
          Stimme über mögliche Termine für den JGA ab
        </CardDescription>
      </CardHeader>
      <CardContent>
        {dateOptions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Noch keine Terminvorschläge vorhanden.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Datum</TableHead>
                {participants.map(participant => (
                  <TableHead key={participant.id} className="text-center">
                    {participant.name}
                  </TableHead>
                ))}
                <TableHead className="text-center">Ja</TableHead>
                <TableHead className="text-center">Vielleicht</TableHead>
                <TableHead className="text-center">Nein</TableHead>
                {isOrganizer && <TableHead className="w-[50px]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {dateOptions.map(option => (
                <TableRow key={option.id}>
                  <TableCell>
                    {formatDate(option.date, option.start_time, option.end_time)}
                  </TableCell>
                  {participants.map(participant => {
                    const vote = getParticipantVote(option.id!, participant.id!);
                    const isCurrentUser = participant.id === currentParticipantId;
                    
                    return (
                      <TableCell key={participant.id} className="text-center">
                        {isCurrentUser ? (
                          <div className="flex justify-center space-x-1">
                            <Button
                              variant={vote === 'yes' ? "default" : "outline"}
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => handleVote(option.id!, 'yes')}
                            >
                              👍
                            </Button>
                            <Button
                              variant={vote === 'maybe' ? "default" : "outline"}
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => handleVote(option.id!, 'maybe')}
                            >
                              🤔
                            </Button>
                            <Button
                              variant={vote === 'no' ? "default" : "outline"}
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => handleVote(option.id!, 'no')}
                            >
                              👎
                            </Button>
                          </div>
                        ) : (
                          <div>
                            {vote === 'yes' && <span>👍</span>}
                            {vote === 'maybe' && <span>🤔</span>}
                            {vote === 'no' && <span>👎</span>}
                            {!vote && <span>-</span>}
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-center">{countVotes(option.id!, 'yes')}</TableCell>
                  <TableCell className="text-center">{countVotes(option.id!, 'maybe')}</TableCell>
                  <TableCell className="text-center">{countVotes(option.id!, 'no')}</TableCell>
                  {isOrganizer && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDateOption(option.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      {isOrganizer && (
        <CardFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Neuen Termin vorschlagen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neuen Termin vorschlagen</DialogTitle>
                <DialogDescription>
                  Füge einen neuen Terminvorschlag für die Umfrage hinzu.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Datum
                  </Label>
                  <div className="col-span-3">
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                      <Input
                        id="date"
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startTime" className="text-right">
                    Startzeit
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endTime" className="text-right">
                    Endzeit
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleAddDateOption} 
                  disabled={!newDate || addingDate}
                >
                  {addingDate ? "Wird hinzugefügt..." : "Termin hinzufügen"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      )}
    </Card>
  );
};

export default JGADatePoll;
