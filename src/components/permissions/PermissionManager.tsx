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
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Trash2, 
  Edit, 
  Mail, 
  Shield, 
  Check, 
  X, 
  Eye, 
  EyeOff 
} from "lucide-react";
import { UserPermission } from "@/types/permissions";
import { PermissionRole } from "@/types/permissionRole";
import { 
  getUserPermissions, 
  createUserPermission, 
  updateUserPermission,
  deleteUserPermission
} from "@/services/permissionService";
import { useAuth } from "@/hooks/useAuth";

interface PermissionManagerProps {
  resourceId: string;
  resourceType: 'jga' | 'wedding_homepage';
}

const PermissionManager: React.FC<PermissionManagerProps> = ({ resourceId, resourceType }) => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<PermissionRole>("viewer");
  const [savingPermission, setSavingPermission] = useState(false);
  const [editingPermissionId, setEditingPermissionId] = useState<string | null>(null);

  // Load permissions
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getUserPermissions(resourceId, resourceType);
        setPermissions(data);
      } catch (error) {
        console.error("Error loading permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [resourceId, resourceType]);

  // Reset form
  const resetForm = () => {
    setEmail("");
    setRole("viewer");
    setEditingPermissionId(null);
  };

  // Set form for editing
  const setFormForEditing = (permission: UserPermission) => {
    setEmail(permission.user_email);
    setRole(permission.role);
    setEditingPermissionId(permission.id!);
  };

  // Save permission
  const handleSavePermission = async () => {
    if (!email) {
      alert("Bitte gib eine E-Mail-Adresse ein.");
      return;
    }
    
    try {
      setSavingPermission(true);
      
      const permissionData = {
        resource_id: resourceId,
        resource_type: resourceType,
        user_email: email,
        role
      };
      
      let savedPermission: UserPermission;
      
      if (editingPermissionId) {
        // Update existing permission
        savedPermission = await updateUserPermission(editingPermissionId, permissionData);
        setPermissions(permissions.map(permission => 
          permission.id === editingPermissionId ? savedPermission : permission
        ));
      } else {
        // Create new permission
        savedPermission = await createUserPermission(permissionData);
        setPermissions([...permissions, savedPermission]);
      }
      
      resetForm();
    } catch (error) {
      console.error("Error saving permission:", error);
      alert("Fehler beim Speichern der Berechtigung. Bitte versuche es erneut.");
    } finally {
      setSavingPermission(false);
    }
  };

  // Delete permission
  const handleDeletePermission = async (permissionId: string) => {
    if (!confirm("Bist du sicher, dass du diese Berechtigung löschen möchtest?")) {
      return;
    }
    
    try {
      await deleteUserPermission(permissionId);
      setPermissions(permissions.filter(permission => permission.id !== permissionId));
    } catch (error) {
      console.error("Error deleting permission:", error);
      alert("Fehler beim Löschen der Berechtigung. Bitte versuche es erneut.");
    }
  };

  // Get role badge
  const getRoleBadge = (role: PermissionRole) => {
    switch (role) {
      case "owner":
        return <Badge className="bg-purple-500">Besitzer</Badge>;
      case "admin":
        return <Badge className="bg-red-500">Administrator</Badge>;
      case "editor":
        return <Badge className="bg-blue-500">Bearbeiter</Badge>;
      case "viewer":
        return <Badge className="bg-green-500">Betrachter</Badge>;
      default:
        return <Badge>Unbekannt</Badge>;
    }
  };

  // Get resource type name
  const getResourceTypeName = () => {
    switch (resourceType) {
      case "jga":
        return "JGA-Planung";
      case "wedding_homepage":
        return "Hochzeitshomepage";
      default:
        return "Ressource";
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Lade Berechtigungen...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Berechtigungen verwalten</CardTitle>
        <CardDescription>
          Lege fest, wer Zugriff auf deine {getResourceTypeName()} hat
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Permissions */}
          <div>
            <h3 className="text-lg font-medium mb-2">Aktuelle Berechtigungen</h3>
            {permissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded-lg">
                Noch keine Berechtigungen vergeben. Du bist der einzige mit Zugriff.
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>E-Mail</TableHead>
                      <TableHead>Rolle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map(permission => (
                      <TableRow key={permission.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                            {permission.user_email}
                            {permission.user_email === user?.email && (
                              <Badge variant="outline" className="ml-2">Du</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(permission.role)}</TableCell>
                        <TableCell>
                          {permission.is_accepted ? (
                            <Badge variant="outline" className="flex items-center gap-1 bg-green-50">
                              <Check className="h-3 w-3" />
                              Akzeptiert
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="flex items-center gap-1 bg-yellow-50">
                              <Clock className="h-3 w-3" />
                              Ausstehend
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            {/* Only allow editing/deleting if current user is owner or admin */}
                            {(user?.email === permission.user_email || 
                              permissions.some(p => p.user_email === user?.email && (p.role === "owner" || p.role === "admin"))) && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setFormForEditing(permission)}
                                  disabled={permission.role === "owner" && permission.user_email !== user?.email}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeletePermission(permission.id!)}
                                  disabled={permission.role === "owner" && permission.user_email !== user?.email}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Permission Explanation */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Berechtigungsstufen
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Badge className="bg-purple-500 mt-0.5 mr-2">Besitzer</Badge>
                <span>Vollständiger Zugriff, kann Berechtigungen verwalten und die Ressource löschen</span>
              </li>
              <li className="flex items-start">
                <Badge className="bg-red-500 mt-0.5 mr-2">Administrator</Badge>
                <span>Kann alle Inhalte bearbeiten und Berechtigungen verwalten</span>
              </li>
              <li className="flex items-start">
                <Badge className="bg-blue-500 mt-0.5 mr-2">Bearbeiter</Badge>
                <span>Kann Inhalte hinzufügen und bearbeiten, aber keine Berechtigungen verwalten</span>
              </li>
              <li className="flex items-start">
                <Badge className="bg-green-500 mt-0.5 mr-2">Betrachter</Badge>
                <span>Kann Inhalte nur ansehen, aber nicht bearbeiten</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Berechtigung hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPermissionId ? "Berechtigung bearbeiten" : "Neue Berechtigung hinzufügen"}
              </DialogTitle>
              <DialogDescription>
                Gib einer Person Zugriff auf deine {getResourceTypeName()}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">E-Mail-Adresse*</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="z.B. freund@example.com"
                  disabled={!!editingPermissionId}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="role">Rolle*</Label>
                <Select value={role} onValueChange={(value) => setRole(value as PermissionRole)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Wähle eine Rolle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="editor">Bearbeiter</SelectItem>
                    <SelectItem value="viewer">Betrachter</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Die Rolle bestimmt, welche Aktionen die Person ausführen kann.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleSavePermission} 
                disabled={!email || savingPermission}
              >
                {savingPermission ? "Wird gespeichert..." : (editingPermissionId ? "Aktualisieren" : "Hinzufügen")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default PermissionManager;
