import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../src/components/ui/card";
import { Button } from "../../../../src/components/ui/button";
import { Badge } from "../../../../src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../src/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../src/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../src/components/ui/alert-dialog";
import { Dialog, DialogContent } from "../../../../src/components/ui/dialog";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Heart,
  UserPlus,
  AlertTriangle,
} from "lucide-react";
import { useLanguage } from "../../../../src/lib/language";
import { GuestRelationship } from "../../../../src/types/relationship";
import RelationshipForm from "./RelationshipForm";

interface Guest {
  id: string;
  name: string;
}

interface RelationshipListProps {
  relationships: GuestRelationship[];
  guests: Guest[];
  onAddRelationship?: () => void;
  onEditRelationship?: (relationship: GuestRelationship) => void;
  onDeleteRelationship?: (id: string) => void;
  onSubmitRelationship?: (data: any) => void;
  isLoading?: boolean;
}

const RelationshipList: React.FC<RelationshipListProps> = ({
  relationships = [],
  guests = [],
  onAddRelationship = () => {},
  onEditRelationship = () => {},
  onDeleteRelationship = () => {},
  onSubmitRelationship = () => {},
  isLoading = false,
}) => {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRelationship, setCurrentRelationship] =
    useState<GuestRelationship | null>(null);
  const [relationshipToDelete, setRelationshipToDelete] = useState<
    string | null
  >(null);

  // Get guest name by ID
  const getGuestName = (id: string) => {
    const guest = guests.find((g) => g.id === id);
    return guest ? guest.name : "Unknown Guest";
  };

  // Get relationship icon based on type
  const getRelationshipIcon = (type: string) => {
    switch (type) {
      case "family":
        return <Users className="h-4 w-4" />;
      case "couple":
        return <Heart className="h-4 w-4 text-rose-500" />;
      case "friend":
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case "conflict":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  // Get relationship badge variant based on type
  const getRelationshipBadge = (type: string) => {
    switch (type) {
      case "family":
        return "default";
      case "couple":
        return "secondary";
      case "friend":
        return "outline";
      case "conflict":
        return "destructive";
      default:
        return "default";
    }
  };

  // Get strength label based on value
  const getStrengthLabel = (value: number) => {
    if (value <= 2) return "Weak";
    if (value <= 5) return "Moderate";
    if (value <= 8) return "Strong";
    return "Very Strong";
  };

  // Handle adding a new relationship
  const handleAddRelationship = () => {
    setIsEditing(false);
    setCurrentRelationship(null);
    setShowForm(true);
    onAddRelationship();
  };

  // Handle editing a relationship
  const handleEditRelationship = (relationship: GuestRelationship) => {
    setIsEditing(true);
    setCurrentRelationship(relationship);
    setShowForm(true);
    onEditRelationship(relationship);
  };

  // Handle form submission
  const handleFormSubmit = (data: any) => {
    onSubmitRelationship(data);
    setShowForm(false);
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (relationshipToDelete) {
      onDeleteRelationship(relationshipToDelete);
      setRelationshipToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Guest Relationships</h2>
        <Button onClick={handleAddRelationship}>
          <Plus className="mr-2 h-4 w-4" />
          Add Relationship
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Relationships</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : relationships.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>First Guest</TableHead>
                    <TableHead>Second Guest</TableHead>
                    <TableHead>Relationship</TableHead>
                    <TableHead>Strength</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relationships.map((relationship) => (
                    <TableRow key={relationship.id}>
                      <TableCell>
                        {getGuestName(relationship.guest_id)}
                      </TableCell>
                      <TableCell>
                        {getGuestName(relationship.related_guest_id)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getRelationshipBadge(
                            relationship.relationship_type,
                          )}
                          className="flex items-center w-fit gap-1"
                        >
                          {getRelationshipIcon(relationship.relationship_type)}
                          <span className="capitalize">
                            {relationship.relationship_type}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-full max-w-24 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${(relationship.strength / 10) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs">
                            {getStrengthLabel(relationship.strength)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleEditRelationship(relationship)
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() =>
                                setRelationshipToDelete(relationship.id)
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="mx-auto h-12 w-12 opacity-20 mb-2" />
              <p>No relationships defined yet.</p>
              <p className="text-sm">
                Create relationships between guests to improve seating
                arrangements.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleAddRelationship}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add First Relationship
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Relationship Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <RelationshipForm
            initialData={currentRelationship || {}}
            guests={guests}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
            isEditing={isEditing}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!relationshipToDelete}
        onOpenChange={(open) => !open && setRelationshipToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              relationship between these guests.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RelationshipList;
