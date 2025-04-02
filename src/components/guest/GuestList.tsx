import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Filter,
  X,
  Loader2,
} from "lucide-react";
import { useRealtimeGuests } from "@/hooks/useRealtimeUpdates";
import { useToast } from "@/components/ui/use-toast";
import { PermissionGuard } from "@/components/ui/permission-guard";
import { useAuth } from "@/lib/auth";

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  rsvpStatus: string;
  dietaryRestrictions: string;
  plusOne: boolean;
}

interface GuestListProps {
  guests?: Guest[];
  onEdit?: (guest: Guest) => void;
  onDelete?: (id: string) => void;
  onInvite?: (id: string) => void;
}

const GuestList: React.FC<GuestListProps> = ({
  guests: propGuests,
  onEdit = () => {},
  onDelete = () => {},
  onInvite = () => {},
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [rsvpFilter, setRsvpFilter] = useState<string | null>(null);
  const { toast } = useToast();

  // Use the realtime hook to get guests with live updates if no guests are provided as props
  const { guests: realtimeGuests, loading, error } = useRealtimeGuests();

  // Use either the provided guests or the realtime guests
  const guests =
    propGuests ||
    realtimeGuests.map((guest) => ({
      id: guest.id,
      name: guest.name,
      email: guest.email,
      phone: guest.phone || "",
      category:
        guest.category.charAt(0).toUpperCase() + guest.category.slice(1),
      rsvpStatus:
        guest.rsvp_status.charAt(0).toUpperCase() + guest.rsvp_status.slice(1),
      dietaryRestrictions: guest.dietary_restrictions || "None",
      plusOne: guest.plus_one,
    }));

  // Show error toast if there's an error fetching guests
  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        variant: "destructive",
        title: "Error fetching guests",
        description: errorMessage,
      });
    }
  }, [error, toast]);

  // Filter guests based on search term and filters
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guest.phone &&
        guest.phone.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      !categoryFilter || guest.category === categoryFilter;

    const matchesRsvp = !rsvpFilter || guest.rsvpStatus === rsvpFilter;

    return matchesSearch && matchesCategory && matchesRsvp;
  });

  // Get unique categories and RSVP statuses for filters
  const categories = Array.from(new Set(guests.map((guest) => guest.category)));
  const rsvpStatuses = Array.from(
    new Set(guests.map((guest) => guest.rsvpStatus)),
  );

  // Helper function to determine badge color based on RSVP status
  const getRsvpBadgeVariant = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "default";
      case "Pending":
        return "secondary";
      case "Declined":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading && !propGuests) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading guests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Select
            value={categoryFilter || ""}
            onValueChange={(value) =>
              setCategoryFilter(value === "" ? null : value)
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={rsvpFilter || ""}
            onValueChange={(value) =>
              setRsvpFilter(value === "" ? null : value)
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="RSVP Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {rsvpStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setCategoryFilter(null);
              setRsvpFilter(null);
              setSearchTerm("");
            }}
            title="Clear filters"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>RSVP Status</TableHead>
              <TableHead>Dietary Needs</TableHead>
              <TableHead>Plus One</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGuests.length > 0 ? (
              filteredGuests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${guest.name.replace(
                            /\s+/g,
                            "",
                          )}`}
                          alt={guest.name}
                        />
                        <AvatarFallback>
                          {guest.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{guest.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{guest.email}</div>
                    <div className="text-xs text-muted-foreground">
                      {guest.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{guest.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRsvpBadgeVariant(guest.rsvpStatus)}>
                      {guest.rsvpStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{guest.dietaryRestrictions}</TableCell>
                  <TableCell>
                    {guest.plusOne ? (
                      <Badge variant="secondary">Yes</Badge>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
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
                        <PermissionGuard requiredPermission="canEditGuests">
                          <DropdownMenuItem onClick={() => onEdit(guest)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </PermissionGuard>

                        <PermissionGuard requiredPermission="canSendInvites">
                          <DropdownMenuItem onClick={() => onInvite(guest.id)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Invite
                          </DropdownMenuItem>
                        </PermissionGuard>

                        <DropdownMenuSeparator />

                        <PermissionGuard requiredPermission="canDeleteGuests">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDelete(guest.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </PermissionGuard>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  {error ? (
                    <div className="flex flex-col items-center justify-center">
                      <p className="mb-2">
                        Error loading guests: {error instanceof Error ? error.message : 'An unknown error occurred'}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.reload()}
                      >
                        Retry
                      </Button>
                    </div>
                  ) : (
                    "No guests found matching your criteria."
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-xs text-muted-foreground">
        Showing {filteredGuests.length} of {guests.length} guests
      </div>
    </div>
  );
};

export default GuestList;
