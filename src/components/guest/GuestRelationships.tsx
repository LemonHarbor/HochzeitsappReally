import React, { useState, useEffect } from "react";
import { useToast } from "../../../../src/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../src/components/ui/tabs";
import { useRealtimeGuests } from "../../../../src/hooks/useRealtimeUpdates";
import { useRealtimeRelationships } from "../../../../src/hooks/useRealtimeRelationships";
import RelationshipList from "./RelationshipList";
import {
  createRelationship,
  updateRelationship,
  deleteRelationship,
} from "../../../../src/services/relationshipService";

interface GuestRelationshipsProps {
  guestId?: string; // Optional: to filter relationships for a specific guest
}

const GuestRelationships: React.FC<GuestRelationshipsProps> = ({ guestId }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");

  // Get guests and relationships with real-time updates
  const { guests, loading: guestsLoading } = useRealtimeGuests();
  const { relationships, loading: relationshipsLoading } =
    useRealtimeRelationships(guestId);

  // Filter relationships based on active tab
  const filteredRelationships = relationships.filter((rel) => {
    if (activeTab === "all") return true;
    return rel.relationship_type === activeTab;
  });

  // Handle adding a new relationship
  const handleAddRelationship = () => {
    // This is handled in the RelationshipList component
  };

  // Handle editing a relationship
  const handleEditRelationship = (relationship: any) => {
    // This is handled in the RelationshipList component
  };

  // Handle deleting a relationship
  const handleDeleteRelationship = async (id: string) => {
    try {
      await deleteRelationship(id);
      toast({
        title: "Relationship Deleted",
        description: "The relationship has been deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete relationship: ${error.message}`,
      });
    }
  };

  // Handle form submission
  const handleSubmitRelationship = async (data: any) => {
    try {
      if (data.id) {
        // Update existing relationship
        await updateRelationship(data.id, {
          relationship_type: data.relationship_type,
          strength: data.strength,
        });
        toast({
          title: "Relationship Updated",
          description: "The relationship has been updated successfully.",
        });
      } else {
        // Create new relationship
        await createRelationship({
          guest_id: data.guest_id,
          related_guest_id: data.related_guest_id,
          relationship_type: data.relationship_type,
          strength: data.strength,
        });
        toast({
          title: "Relationship Created",
          description: "The relationship has been created successfully.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${data.id ? "update" : "create"} relationship: ${error.message}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
          <TabsTrigger value="couple">Couples</TabsTrigger>
          <TabsTrigger value="friend">Friends</TabsTrigger>
          <TabsTrigger value="conflict">Conflicts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <RelationshipList
            relationships={filteredRelationships}
            guests={guests}
            onAddRelationship={handleAddRelationship}
            onEditRelationship={handleEditRelationship}
            onDeleteRelationship={handleDeleteRelationship}
            onSubmitRelationship={handleSubmitRelationship}
            isLoading={guestsLoading || relationshipsLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GuestRelationships;
