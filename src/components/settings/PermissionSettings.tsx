import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../src/components/ui/card";
import { Button } from "../../../../src/components/ui/button";
import { Switch } from "../../../../src/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../src/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../src/components/ui/table";
import { Input } from "../../../../src/components/ui/input";
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
import {
  UserPlus,
  UserMinus,
  Edit,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useToast } from "../../../../src/components/ui/use-toast";
import { useAuth } from "../../../../src/context/AuthContext";

interface Permission {
  id: string;
  name: string;
  description: string;
  role: "couple" | "best-man" | "maid-of-honor" | "guest";
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "couple" | "best-man" | "maid-of-honor" | "guest";
  avatar: string;
}

interface PermissionSettingsProps {
  permissions?: Permission[];
  users?: User[];
}

const PermissionSettings = ({
  permissions = [
    {
      id: "1",
      name: "Guest Management",
      description: "Add, edit, and remove guests from the wedding",
      role: "couple" as const,
      canView: true,
      canEdit: true,
      canDelete: true,
    },
    {
      id: "2",
      name: "Table Planning",
      description: "Create and modify table arrangements",
      role: "best-man" as const,
      canView: true,
      canEdit: true,
      canDelete: false,
    },
    {
      id: "3",
      name: "RSVP Management",
      description: "Track and update guest RSVP status",
      role: "maid-of-honor" as const,
      canView: true,
      canEdit: true,
      canDelete: false,
    },
    {
      id: "4",
      name: "Wedding Details",
      description: "View wedding date, location, and other details",
      role: "guest" as const,
      canView: true,
      canEdit: false,
      canDelete: false,
    },
  ],
  users = [
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      role: "couple" as const,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "couple" as const,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "best-man" as const,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah@example.com",
      role: "maid-of-honor" as const,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
  ],
}: PermissionSettingsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditPermissionDialogOpen, setIsEditPermissionDialogOpen] =
    useState(false);
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);
  const { toast } = useToast();
  const auth = useAuth();

  // Filter users based on search term and selected role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleEditPermission = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsEditPermissionDialogOpen(true);
  };

  const handleAddUser = () => {
    setIsAddUserDialogOpen(true);
  };

  const handleSavePermission = () => {
    if (!selectedPermission) return;

    toast({
      title: "Permissions updated",
      description: `Permissions for ${selectedPermission.name} have been updated.`,
    });

    setIsEditPermissionDialogOpen(false);
  };

  const handleSaveUser = () => {
    toast({
      title: "User added",
      description: "The new user has been added successfully.",
    });

    setIsAddUserDialogOpen(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "couple":
        return <ShieldCheck className="h-4 w-4 text-green-500" />;
      case "best-man":
      case "maid-of-honor":
        return <Shield className="h-4 w-4 text-blue-500" />;
      case "guest":
        return <Users className="h-4 w-4 text-gray-500" />;
      default:
        return <ShieldAlert className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Role-Based Permissions</h2>
        <Button onClick={handleAddUser}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* User Management Section */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage users and their roles for your wedding planning app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="couple">Couple</SelectItem>
                <SelectItem value="best-man">Best Man</SelectItem>
                <SelectItem value="maid-of-honor">Maid of Honor</SelectItem>
                <SelectItem value="guest">Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-8 w-8 rounded-full"
                        />
                        <span>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {getRoleIcon(user.role)}
                        <span className="capitalize">
                          {user.role.replace("-", " ")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <UserMinus className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Settings</CardTitle>
          <CardDescription>
            Configure what each role can view, edit, and delete in your wedding
            planning app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>View</TableHead>
                  <TableHead>Edit</TableHead>
                  <TableHead>Delete</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{permission.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {permission.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {getRoleIcon(permission.role)}
                        <span className="capitalize">
                          {permission.role.replace("-", " ")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch checked={permission.canView} disabled />
                    </TableCell>
                    <TableCell>
                      <Switch checked={permission.canEdit} disabled />
                    </TableCell>
                    <TableCell>
                      <Switch checked={permission.canDelete} disabled />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPermission(permission)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <AlertDialog
        open={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add New User</AlertDialogTitle>
            <AlertDialogDescription>
              Add a new user and assign them a role for your wedding planning
              app.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input id="name" placeholder="Full name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="role" className="text-right">
                Role
              </label>
              <Select defaultValue="guest">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="couple">Couple</SelectItem>
                  <SelectItem value="best-man">Best Man</SelectItem>
                  <SelectItem value="maid-of-honor">Maid of Honor</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveUser}>
              Add User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Permission Dialog */}
      <AlertDialog
        open={isEditPermissionDialogOpen && !!selectedPermission}
        onOpenChange={setIsEditPermissionDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Permission</AlertDialogTitle>
            <AlertDialogDescription>
              Modify permissions for {selectedPermission?.name} for the{" "}
              {selectedPermission?.role.replace("-", " ")} role.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedPermission && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="view-permission"
                  className="text-sm font-medium"
                >
                  Can View
                </label>
                <Switch
                  id="view-permission"
                  checked={selectedPermission.canView}
                />
              </div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="edit-permission"
                  className="text-sm font-medium"
                >
                  Can Edit
                </label>
                <Switch
                  id="edit-permission"
                  checked={selectedPermission.canEdit}
                />
              </div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="delete-permission"
                  className="text-sm font-medium"
                >
                  Can Delete
                </label>
                <Switch
                  id="delete-permission"
                  checked={selectedPermission.canDelete}
                />
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSavePermission}>
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PermissionSettings;
