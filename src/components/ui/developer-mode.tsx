import React, { useState } from "react";
import { Button } from "../../../../src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../src/components/ui/select";
import { Input } from "../../../../src/components/ui/input";
import { Label } from "../../../../src/components/ui/label";
import { useToast } from "../../../../src/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../src/context/AuthContext";
import { supabase } from "../../../../src/lib/supabase";
import { Code, UserCog, Users, User } from "lucide-react";

export function DeveloperMode() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user?.role || "couple");
  const [selectedGuest, setSelectedGuest] = useState("");
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch guests when dialog opens
  const handleOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("guests")
          .select("id, name, email")
          .order("name");

        if (error) throw error;
        setGuests(data || []);
      } catch (error) {
        console.error("Error fetching guests:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load guests. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Switch to developer role
  const switchToDeveloperRole = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      role: "developer",
      permissions: [
        "canViewGuests",
        "canEditGuests",
        "canDeleteGuests",
        "canViewTables",
        "canEditTables",
        "canDeleteTables",
        "canSendInvites",
        "canExportData",
        "canManagePermissions",
        "canAccessAllAreas",
        "canSwitchRoles",
        "canViewAllData",
      ],
    };

    setUser(updatedUser);
    localStorage.setItem("userRole", "developer");
    localStorage.setItem(
      "userPermissions",
      JSON.stringify(updatedUser.permissions),
    );

    toast({
      title: "Developer Mode Activated",
      description: "You now have access to all areas of the application.",
    });

    navigate("/");
    setOpen(false);
  };

  // Switch to couple role
  const switchToCoupleRole = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      role: "couple",
      permissions: [
        "canViewGuests",
        "canEditGuests",
        "canViewTables",
        "canEditTables",
        "canSendInvites",
        "canExportData",
      ],
    };

    setUser(updatedUser);
    localStorage.setItem("userRole", "couple");
    localStorage.setItem(
      "userPermissions",
      JSON.stringify(updatedUser.permissions),
    );

    toast({
      title: "Couple Mode Activated",
      description: "You now have the couple's view of the application.",
    });

    navigate("/");
    setOpen(false);
  };

  // Switch to guest role
  const switchToGuestRole = () => {
    if (!user || !selectedGuest) return;

    const guest = guests.find((g) => g.id === selectedGuest);
    if (!guest) return;

    const updatedUser = {
      ...user,
      role: "guest",
      guestId: selectedGuest,
      guestName: guest.name,
      guestEmail: guest.email,
      permissions: ["canViewGuestArea"],
    };

    setUser(updatedUser);
    localStorage.setItem("userRole", "guest");
    localStorage.setItem("guestId", selectedGuest);
    localStorage.setItem(
      "userPermissions",
      JSON.stringify(updatedUser.permissions),
    );

    toast({
      title: "Guest Mode Activated",
      description: `You are now viewing as guest: ${guest.name}`,
    });

    navigate("/guest-area");
    setOpen(false);
  };

  // Handle role switch
  const handleRoleSwitch = () => {
    if (selectedRole === "developer") {
      switchToDeveloperRole();
    } else if (selectedRole === "couple") {
      switchToCoupleRole();
    } else if (selectedRole === "guest" && selectedGuest) {
      switchToGuestRole();
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a valid role and guest (if applicable).",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Code className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Developer Mode</span>
          {user?.role === "developer" && (
            <span className="absolute h-2 w-2 top-1 right-1 rounded-full bg-green-500" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Developer Mode</DialogTitle>
          <DialogDescription>
            Switch between different user roles to access all areas of the
            application.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="role">Select Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="developer">
                  <div className="flex items-center">
                    <UserCog className="mr-2 h-4 w-4" />
                    Developer (All Access)
                  </div>
                </SelectItem>
                <SelectItem value="couple">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Couple
                  </div>
                </SelectItem>
                <SelectItem value="guest">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Guest
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedRole === "guest" && (
            <div className="grid gap-2">
              <Label htmlFor="guest">Select Guest</Label>
              {loading ? (
                <div className="flex items-center justify-center h-10">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Select value={selectedGuest} onValueChange={setSelectedGuest}>
                  <SelectTrigger id="guest">
                    <SelectValue placeholder="Select guest" />
                  </SelectTrigger>
                  <SelectContent>
                    {guests.map((guest) => (
                      <SelectItem key={guest.id} value={guest.id}>
                        {guest.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-muted-foreground">
              Current role:{" "}
              <span className="font-medium">
                {user?.role || "Not logged in"}
              </span>
            </div>
            <Button onClick={handleRoleSwitch}>Switch Role</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
