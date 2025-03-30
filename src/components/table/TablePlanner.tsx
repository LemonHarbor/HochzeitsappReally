import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { PlusCircle, Save, Trash2, Wand2, Users } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import TableCanvas from "./TableCanvas";
import TableControls from "./TableControls";
import GuestPool from "./GuestPool";
import TableForm from "./TableForm";
import GroupManagement, { Group } from "./GroupManagement";
import AIOptimizationDialog from "./AIOptimizationDialog";
import {
  useRealtimeTables,
  useRealtimeGuests,
  useRealtimeSeats,
} from "@/hooks/useRealtimeUpdates";
import {
  createTable,
  updateTable,
  deleteTable,
  assignGuestToSeat,
  removeGuestFromSeat,
  assignTableToGroup,
} from "@/services/tableService";

interface TablePlannerProps {
  onSaveArrangement?: () => void;
}

const TablePlanner: React.FC<TablePlannerProps> = ({
  onSaveArrangement = () => {},
}) => {
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [showTableForm, setShowTableForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showAIOptimizationDialog, setShowAIOptimizationDialog] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Use realtime hooks to get tables, seats, and guests with live updates
  const {
    tables,
    loading: tablesLoading,
    error: tablesError,
  } = useRealtimeTables();
  const {
    seats,
    loading: seatsLoading,
    error: seatsError,
  } = useRealtimeSeats();
  const {
    guests,
    loading: guestsLoading,
    error: guestsError,
  } = useRealtimeGuests();

  // Combine tables with their seats and group info
  const tablesWithSeats = tables.map((table) => {
    const tableSeats = seats
      .filter((seat) => seat.table_id === table.id)
      .map((seat) => ({
        id: seat.id,
        guestId: seat.guest_id,
        position: seat.position,
      }));

    // Find group info if table has a group_id
    const groupInfo =
      selectedGroup && table.group_id === selectedGroup.id
        ? selectedGroup
        : null;

    return {
      ...table,
      seats: tableSeats,
      group: table.group_id,
      group_name: groupInfo?.name,
    };
  });

  // Filter tables by selected group if a group is selected
  const filteredTables = selectedGroup
    ? tablesWithSeats.filter((table) => table.group_id === selectedGroup.id)
    : tablesWithSeats;

  // Count tables per group for the UI
  const tableCountByGroup = tablesWithSeats.reduce(
    (acc, table) => {
      if (table.group_id) {
        acc[table.group_id] = (acc[table.group_id] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  // Get the selected table data if a table is selected
  const selectedTable = selectedTableId
    ? tablesWithSeats.find((table) => table.id === selectedTableId)
    : null;

  // Show error toast if there's an error fetching data
  useEffect(() => {
    if (tablesError) {
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: `${t("tables.title")} ${tablesError.message}`,
      });
    }
    if (seatsError) {
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: `Seats: ${seatsError.message}`,
      });
    }
    if (guestsError) {
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: `${t("guests.title")}: ${guestsError.message}`,
      });
    }
  }, [tablesError, seatsError, guestsError, toast, t]);

  // Handle adding a new table
  const handleAddTable = async (shape: string) => {
    try {
      await createTable({
        name: `${t("tables.title")} ${tables.length + 1}`,
        shape: shape as "round" | "rectangle" | "custom",
        capacity: 8,
      });

      toast({
        title: t("misc.success"),
        description:
          t("tables.addTable") + " " + t("misc.success").toLowerCase(),
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: `${t("tables.addTable")} ${err.message}`,
      });
    }
  };

  // Handle table selection
  const handleTableSelect = (tableId: string | null) => {
    setSelectedTableId(tableId);
    if (tableId) {
      setIsEditing(true);
      setShowTableForm(true);
    } else {
      setShowTableForm(false);
    }
  };

  // Handle assigning a table to a group
  const handleAssignTableToGroup = async (
    tableId: string,
    groupId: string | null,
  ) => {
    try {
      await assignTableToGroup(tableId, groupId);
      toast({
        title: t("misc.success"),
        description: groupId
          ? `Table assigned to group successfully.`
          : `Table removed from group successfully.`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: `Failed to assign table to group: ${err.message}`,
      });
    }
  };

  // Handle form submission for adding/editing tables
  const handleTableFormSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);

      if (isEditing && selectedTableId) {
        await updateTable(selectedTableId, values);

        // If a group is assigned, update the table's group
        if (values.groupId !== undefined) {
          await assignTableToGroup(
            selectedTableId,
            values.groupId === "none" ? null : values.groupId,
          );
        }

        toast({
          title: t("misc.success"),
          description:
            t("tables.editTable") + " " + t("misc.success").toLowerCase(),
        });
      } else {
        const result = await createTable(values);

        // If a group is assigned, update the table's group
        if (values.groupId && values.groupId !== "none") {
          await assignTableToGroup(result.table.id, values.groupId);
        }

        toast({
          title: t("misc.success"),
          description:
            t("tables.addTable") + " " + t("misc.success").toLowerCase(),
        });
      }

      setShowTableForm(false);
    } catch (err) {
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: `${isEditing ? t("tables.editTable") : t("tables.addTable")} ${err.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle group selection
  const handleGroupSelect = (group: Group | null) => {
    setSelectedGroup(group);
    // If a table is selected and a group is selected, offer to assign the table to this group
    if (selectedTableId && group) {
      toast({
        title: "Assign to Group?",
        description: `Would you like to assign the selected table to the "${group.name}" group?`,
        action: (
          <Button
            onClick={() => handleAssignTableToGroup(selectedTableId, group.id)}
            variant="outline"
            size="sm"
          >
            Assign
          </Button>
        ),
      });
    }
  };

  // Handle guest drag start
  const handleGuestDragStart = (guest: any) => {
    // This would be used to track the guest being dragged
    console.log("Guest drag started:", guest);
  };

  // Handle assigning a guest to a seat
  const handleAssignGuest = async (seatId: string, guestId: string) => {
    try {
      await assignGuestToSeat(seatId, guestId);
      return true;
    } catch (error) {
      console.error("Error assigning guest to seat:", error);
      throw error;
    }
  };

  // Handle removing a guest from a seat
  const handleRemoveGuest = async (seatId: string) => {
    try {
      await removeGuestFromSeat(seatId);
      return true;
    } catch (error) {
      console.error("Error removing guest from seat:", error);
      throw error;
    }
  };

  // Handle AI optimization of seating
  const handleOptimizeSeating = () => {
    setShowAIOptimizationDialog(true);
  };

  // Handle optimization completion
  const handleOptimizationComplete = () => {
    // Refresh data if needed (though realtime updates should handle this)
    toast({
      title: t("misc.success"),
      description:
        t("tables.aiOptimize") + " " + t("misc.success").toLowerCase(),
    });
  };

  // Handle saving the arrangement
  const handleSaveArrangement = () => {
    // In a real implementation, this would save to a database
    // But since we're using Supabase realtime, changes are saved automatically
    toast({
      title: t("misc.success"),
      description:
        t("tables.saveArrangement") + " " + t("misc.success").toLowerCase(),
    });

    // Call the provided callback if any
    onSaveArrangement();
  };

  // Handle clearing all tables
  const handleClearAll = () => {
    setShowClearConfirm(true);
  };

  const confirmClearAll = async () => {
    try {
      // Delete all tables (will cascade delete seats)
      for (const table of tables) {
        await deleteTable(table.id);
      }

      setSelectedTableId(null);
      setShowClearConfirm(false);

      toast({
        title: t("misc.success"),
        description:
          t("tables.clearAll") + " " + t("misc.success").toLowerCase(),
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: `${t("tables.clearAll")} ${err.message}`,
      });
    }
  };

  // Format guests for the GuestPool component
  const formatGuestsForPool = () => {
    return guests.map((guest) => ({
      id: guest.id,
      name: guest.name,
      email: guest.email,
      rsvpStatus: guest.rsvp_status as "confirmed" | "pending" | "declined",
      category: guest.category,
      dietaryRestrictions: guest.dietary_restrictions,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${guest.name.replace(/\s+/g, "")}`,
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto py-6 px-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t("tables.title")}</h1>
          <div className="flex space-x-2">
            <Button
              onClick={() => {
                setIsEditing(false);
                setShowTableForm(true);
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("tables.addTable")}
            </Button>
            <Button variant="outline" onClick={handleSaveArrangement}>
              <Save className="mr-2 h-4 w-4" />
              {t("tables.saveArrangement")}
            </Button>
          </div>
        </div>

        {/* Group Management Section */}
        <div className="bg-muted/20 p-4 rounded-lg border">
          <GroupManagement
            onGroupSelect={handleGroupSelect}
            selectedGroup={selectedGroup}
            tableCountByGroup={tableCountByGroup}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main canvas area */}
          <div className="lg:col-span-3 h-[600px]">
            <TableCanvas
              tables={filteredTables}
              loading={tablesLoading || seatsLoading}
              onTableSelect={handleTableSelect}
              selectedTableId={selectedTableId}
              onAssignGuest={handleAssignGuest}
              selectedGroup={selectedGroup}
            />
          </div>

          {/* Controls sidebar */}
          <div className="lg:col-span-1 h-[600px]">
            <TableControls
              onAddTable={handleAddTable}
              onOptimizeSeating={handleOptimizeSeating}
              onSaveArrangement={handleSaveArrangement}
              onClearAll={handleClearAll}
            />
          </div>
        </div>

        {/* Guest pool section */}
        <div className="mt-6">
          {guestsLoading ? (
            <div className="flex justify-center items-center h-32 bg-muted/20 rounded-lg border">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <GuestPool
              guests={formatGuestsForPool()}
              onDragStart={handleGuestDragStart}
            />
          )}
        </div>
      </div>

      {/* Table form dialog */}
      <Dialog open={showTableForm} onOpenChange={setShowTableForm}>
        <DialogContent className="sm:max-w-md">
          <TableForm
            onSubmit={handleTableFormSubmit}
            initialData={
              selectedTable
                ? {
                    name: selectedTable.name,
                    shape: selectedTable.shape,
                    capacity: selectedTable.seats.length,
                    location: "Main Hall", // This would come from the table data in a real app
                    notes: "",
                  }
                : undefined
            }
            isEditing={isEditing}
          />
        </DialogContent>
      </Dialog>

      {/* Clear all confirmation dialog */}
      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("actions.confirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("tables.clearAll")} {t("misc.warning").toLowerCase()}.{" "}
              {t("actions.confirm")}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("actions.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmClearAll}
              className="bg-destructive text-destructive-foreground"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("tables.clearAll")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AI Optimization Dialog */}
      <AIOptimizationDialog
        open={showAIOptimizationDialog}
        onOpenChange={setShowAIOptimizationDialog}
        onOptimizationComplete={handleOptimizationComplete}
      />
    </DndProvider>
  );
};

export default TablePlanner;
