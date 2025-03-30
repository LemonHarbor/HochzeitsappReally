import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../src/components/ui/button";
import { Input } from "../../../../src/components/ui/input";
import { Badge } from "../../../../src/components/ui/badge";
import { useToast } from "../../../../src/components/ui/use-toast";
import { useAuth } from "../../../../src/context/AuthContext";
import { useRealtimeMoodBoard } from "../../../../src/hooks/useRealtimeMoodBoard";
import {
  shareMoodBoard,
  updateMoodBoard,
  generateShareableLink,
  removeMoodBoardShare,
} from "../../../../src/services/moodboardService";
import {
  ArrowLeft,
  Copy,
  Link,
  Mail,
  Plus,
  Trash2,
  Check,
  Users,
  Globe,
  Lock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../src/components/ui/card";
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
import { Switch } from "../../../../src/components/ui/switch";
import { Label } from "../../../../src/components/ui/label";
import { supabase } from "../../../../src/lib/supabase";

interface MoodBoardShareProps {
  boardId: string;
  onBack: () => void;
}

interface ShareUser {
  id: string;
  email: string;
  name: string;
  permission: "view" | "edit" | "admin";
  shareId?: string;
}

const MoodBoardShare: React.FC<MoodBoardShareProps> = ({
  boardId,
  onBack,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { board } = useRealtimeMoodBoard(boardId);
  const [shareEmail, setShareEmail] = useState("");
  const [sharePermission, setSharePermission] = useState<"view" | "edit" | "admin">("view");
  const [sharedUsers, setSharedUsers] = useState<ShareUser[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [shareableLink, setShareableLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [userToRemove, setUserToRemove] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch shared users when component mounts
  useEffect(() => {
    const fetchSharedUsers = async () => {
      if (!boardId) return;

      try {
        setLoading(true);
        
        // Get shares for this board
        const { data: sharesData, error: sharesError } = await supabase
          .from("mood_board_shares")
          .select("id, shared_with_id, permission")
          .eq("board_id", boardId);

        if (sharesError) throw sharesError;

        // Get user details for each shared user
        const sharedUserDetails: ShareUser[] = [];
        
        for (const share of sharesData) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, email, name")
            .eq("id", share.shared_with_id)
            .single();

          if (userError) continue;

          sharedUserDetails.push({
            ...userData,
            permission: share.permission,
            shareId: share.id,
          });
        }

        setSharedUsers(sharedUserDetails);
        
        // Set public status based on board data
        if (board) {
          setIsPublic(board.is_public);
          
          // Generate shareable link if board is public
          if (board.is_public) {
            setShareableLink(`${window.location.origin}/mood-board/${boardId}`);
          }
        }
      } catch (error) {
        console.error("Error fetching shared users:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load sharing information.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSharedUsers();
  }, [boardId, board, toast]);

  // Handle sharing with a user
  const handleShareWithUser = async () => {
    if (!shareEmail.trim() || !user) return;

    try {
      // Check if user exists
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, email, name")
        .eq("email", shareEmail.trim())
        .single();

      if (userError) {
        toast({
          variant: "destructive",
          title: "User Not Found",
          description: "No user with that email address was found.",
        });
        return;
      }

      // Check if user is already shared with
      if (sharedUsers.some((u) => u.id === userData.id)) {
        toast({
          variant: "destructive",
          title: "Already Shared",
          description: "This board is already shared with that user.",
        });
        return;
      }

      // Share the board
      const shareResult = await shareMoodBoard(
        boardId,
        user.id,
        userData.id,
        sharePermission
      );

      // Add to shared users list
      setSharedUsers([
        ...sharedUsers,
        {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          permission: sharePermission,
          shareId: shareResult.id,
        },
      ]);

      setShareEmail("");
      
      toast({
        title: "Board Shared",
        description: `The board has been shared with ${userData.email}.`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to share board: ${error.message}`
      });
    }
  };

  // Handle removing a user from sharing
  const handleRemoveUser = async () => {
    if (!userToRemove) return;

    try {
      const shareToRemove = sharedUsers.find((u) => u.id === userToRemove);
      
      if (shareToRemove?.shareId) {
        await removeMoodBoardShare(shareToRemove.shareId);
      }

      setSharedUsers(sharedUsers.filter((u) => u.id !== userToRemove));
      setUserToRemove(null);
      
      toast({
        title: "Sharing Removed",
        description: "The user no longer has access to this board.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to remove sharing: ${error.message}`
      });
    }
  };

  // Handle toggling public access
  const handleTogglePublic = async () => {
    try {
      await updateMoodBoard(boardId, { is_public: !isPublic });
      
      setIsPublic(!isPublic);
      
      if (!isPublic) {
        // Generate shareable link
        const link = await generateShareableLink(boardId);
        setShareableLink(link);
        
        toast({
          title: "Public Access Enabled",
          description: "Anyone with the link can now view this board.",
        });
      } else {
        setShareableLink("");
        
        toast({
          title: "Public Access Disabled",
          description: "This board is now private.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update public access: ${error.message}`
      });
    }
  };

  // Handle copying link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setLinkCopied(true);
    
    setTimeout(() => {
      setLinkCopied(false);
    }, 2000);
    
    toast({
      title: "Link Copied",
      description: "Shareable link copied to clipboard.",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Share Mood Board</h1>
          <p className="text-muted-foreground">
            {board?.title || "Loading..."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Share with specific users */}
        <Card>
          <CardHeader>
            <CardTitle>Share with People</CardTitle>
            <CardDescription>
              Invite specific people to collaborate on this mood board
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Email address"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="flex-1"
                />
                <Select
                  value={sharePermission}
                  onValueChange={(value) => setSharePermission(value as "view" | "edit" | "admin")}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Permission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">Can view</SelectItem>
                    <SelectItem value="edit">Can edit</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleShareWithUser}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : sharedUsers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Permission</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sharedUsers.map((sharedUser) => (
                      <TableRow key={sharedUser.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{sharedUser.name || "Unnamed User"}</span>
                            <span className="text-sm text-muted-foreground">{sharedUser.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {sharedUser.permission === "view" && "Can view"}
                            {sharedUser.permission === "edit" && "Can edit"}
                            {sharedUser.permission === "admin" && "Admin"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setUserToRemove(sharedUser.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No users have been shared with yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Public sharing */}
        <Card>
          <CardHeader>
            <CardTitle>Public Access</CardTitle>
            <CardDescription>
              Allow anyone with the link to view this mood board
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="public-access">Public access</Label>
                  <p className="text-sm text-muted-foreground">
                    {isPublic
                      ? "Anyone with the link can view this board"
                      : "Only invited users can access this board"}
                  </p>
                </div>
                <Switch
                  id="public-access"
                  checked={isPublic}
                  onCheckedChange={handleTogglePublic}
                />
              </div>

              {isPublic && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={shareableLink}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyLink}
                    >
                      {linkCopied ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation dialog for removing a user */}
      <AlertDialog open={!!userToRemove} onOpenChange={() => setUserToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this user's access to the mood board?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveUser}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MoodBoardShare;
