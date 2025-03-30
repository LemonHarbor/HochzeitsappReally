import React, { useState, useEffect } from "react";
import { Button } from "../../../../src/components/ui/button";
import { Input } from "../../../../src/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../src/components/ui/select";
import { Badge } from "../../../../src/components/ui/badge";
import { Plus, X, UserPlus, Users } from "lucide-react";
import { useAuth } from "../../../../src/context/AuthContext";
import { useLanguage } from "../../../../src/lib/language";
import { useToast } from "../../../../src/components/ui/use-toast";
import {
  createGroup,
  getAllGroups,
  deleteGroup,
} from "../../../../src/services/tableService";

export interface Group {
  id: string;
  name: string;
  color: string;
  type: string;
}

interface GroupManagementProps {
  onGroupSelect?: (group: Group | null) => void;
  selectedGroup?: Group | null;
  tableCountByGroup?: Record<string, number>;
}

const GroupManagement: React.FC<GroupManagementProps> = ({
  onGroupSelect = () => {},
  selectedGroup = null,
  tableCountByGroup = {},
}) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupType, setNewGroupType] = useState("standard");
  const [newGroupColor, setNewGroupColor] = useState("#4f46e5");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const isCouple = user?.role === "couple";

  // Fetch groups on component mount
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const fetchedGroups = await getAllGroups();
      setGroups(fetchedGroups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: `${t("misc.error")} ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: "Group name cannot be empty",
      });
      return;
    }

    try {
      setLoading(true);
      const newGroup = await createGroup({
        name: newGroupName,
        color: newGroupColor,
        type: newGroupType,
      });

      setGroups([...groups, newGroup]);
      setNewGroupName("");
      setNewGroupType("standard");
      setShowAddGroup(false);

      toast({
        title: t("misc.success"),
        description: `Group "${newGroupName}" created successfully`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: `${t("misc.error")} ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      setLoading(true);
      await deleteGroup(groupId);

      // Update local state
      setGroups(groups.filter((group) => group.id !== groupId));

      // If the deleted group was selected, clear selection
      if (selectedGroup?.id === groupId) {
        onGroupSelect(null);
      }

      toast({
        title: t("misc.success"),
        description: "Group deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: `${t("misc.error")} ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Guest Groups</h3>
        {isCouple && (
          <Button
            size="sm"
            onClick={() => setShowAddGroup(true)}
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Group
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {groups.map((group) => (
          <Badge
            key={group.id}
            variant={selectedGroup?.id === group.id ? "default" : "outline"}
            className="cursor-pointer flex items-center gap-1 px-3 py-1"
            style={{
              backgroundColor:
                selectedGroup?.id === group.id ? group.color : "transparent",
              borderColor: group.color,
              color: selectedGroup?.id === group.id ? "white" : undefined,
            }}
            onClick={() =>
              onGroupSelect(selectedGroup?.id === group.id ? null : group)
            }
          >
            {group.type === "bestman" && <Users className="h-3 w-3" />}
            {group.name}
            {tableCountByGroup[group.id] > 0 && (
              <span className="ml-1 text-xs bg-background text-foreground rounded-full px-1">
                {tableCountByGroup[group.id]}
              </span>
            )}
            {isCouple && (
              <X
                className="h-3 w-3 ml-1 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteGroup(group.id);
                }}
              />
            )}
          </Badge>
        ))}

        {groups.length === 0 && !loading && (
          <div className="text-sm text-muted-foreground">
            No groups defined yet.{" "}
            {isCouple ? "Add a group to organize your guests." : ""}
          </div>
        )}

        {loading && (
          <div className="text-sm text-muted-foreground">Loading groups...</div>
        )}
      </div>

      {/* Add Group Dialog */}
      <Dialog open={showAddGroup} onOpenChange={setShowAddGroup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Group</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="group-name" className="text-right">
                Name
              </label>
              <Input
                id="group-name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="col-span-3"
                placeholder="Family, Friends, etc."
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="group-type" className="text-right">
                Type
              </label>
              <Select value={newGroupType} onValueChange={setNewGroupType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select group type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="bestman">
                    Best Man/Maid of Honor
                  </SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="friends">Friends</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="group-color" className="text-right">
                Color
              </label>
              <div className="col-span-3 flex items-center gap-2">
                <input
                  type="color"
                  id="group-color"
                  value={newGroupColor}
                  onChange={(e) => setNewGroupColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <div
                  className="w-8 h-8 rounded-full border"
                  style={{ backgroundColor: newGroupColor }}
                ></div>
                <span className="text-sm">{newGroupColor}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddGroup(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGroup} disabled={loading}>
              {loading ? "Creating..." : "Create Group"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupManagement;
