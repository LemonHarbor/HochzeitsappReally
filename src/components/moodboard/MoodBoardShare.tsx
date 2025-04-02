import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeMoodBoard } from "@/hooks/useRealtimeMoodBoard";
import {
  shareMoodBoard,
  updateMoodBoard,
  generateShareableLink,
  deleteMoodBoardShare as removeMoodBoardShare,
} from "@/services/moodboardService";
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
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";

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
  const { board, moodBoard } = useRealtimeMoodBoard(boardId);
  const [shareEmail, setShareEmail] = useState("");
  const [sharePermission, setSharePermission] = useState<"view" | "edit" | "admin">("view");
  const [sharedUsers, setSharedUsers] = useState<ShareUser[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [shareableLink, setShareableLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [userToRemove, setUserToRemove] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Use moodBoard if board is not available
  const currentBoard = board || moodBoard;

  // Fetch shared users when component mounts
  useEffect(() => {
    const fetchSharedUsers = async () => {
      if (!boardId) return;

      try {
        setLoading(true);
        
        // Get shares for this board
        const { data: sharesData, error: sharesError } = await supabase
          .from("moodboard_shares")
          .select("id, user_id, shared_with_email, permission_level")
          .eq("board_id", boardId);

        if (sharesError) throw sharesError;

        // Convert to ShareUser format
        const sharedUserDetails: ShareUser[] = sharesData.map(share => ({
          id: share.user_id,
          email: share.shared_with_email,
          name: share.shared_with_email.split('@')[0], // Simple name extraction
          permission: share.permission_level as "view" | "edit" | "admin",
          shareId: share.id,
        }));

        setSharedUsers(sharedUserDetails);
        
        // Set public status based on board data
        if (currentBoard) {
          setIsPublic(currentBoard.is_public);
          
          // Generate shareable link if board is public
          if (currentBoard.is_public) {
            setShareableLink(`${window.location.origin}/mood-board/${boardId}`);
          }
        }
      } catch (error: any) {
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
  }, [boardId, currentBoard, toast]);

  // Handle sharing with a user
  const handleShareWithUser = async () => {
    if (!shareEmail.trim() || !user) return;

    try {
      // Share the board
      const shareData = {
        board_id: boardId,
        user_id: user.id,
        shared_with_email: shareEmail.trim(),
        permission_level: sharePermission,
      };
      
      const shareResult = await shareMoodBoard(shareData);

      // Add to shared users list
      setSharedUsers([
        ...sharedUsers,
        {
          id: shareResult.user_id,
          email: shareEmail.trim(),
          name: shareEmail.trim().split('@')[0],
          permission: sharePermission,
          shareId: shareResult.id,
        },
      ]);

      setShareEmail("");
      
      toast({
        title: "Board Shared",
        description: `The board has been shared with ${shareEmail.trim()}.`
      });
    } catch (error: any) {
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
    } catch (error: any) {
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
        const link = generateShareableLink(boardId);
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
    } catch (error: any) {
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
            {currentBoard?.name || "Loading..."}
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
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sharedUsers.map((sharedUser) => (
                      <TableRow key={sharedUser.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{sharedUser.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {sharedUser.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              sharedUser.permission === "admin"
                                ? "default"
                                : sharedUser.permission === "edit"
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {sharedUser.permission === "admin"
                              ? "Admin"
                              : sharedUser.permission === "edit"
                              ? "Can edit"
                              : "Can view"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setUserToRemove(sharedUser.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Users className="mx-auto h-8 w-8 mb-2" />
                  <p>This board is not shared with anyone yet</p>
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
              Control who can access this mood board with a link
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
                      : "Only you and people you share with can access"}
                  </p>
                </div>
                <Switch
                  id="public-access"
                  checked={isPublic}
                  onCheckedChange={handleTogglePublic}
                />
              </div>

              {isPublic && (
                <div className="pt-4">
                  <Label htmlFor="share-link">Shareable link</Label>
                  <div className="flex mt-1.5">
                    <Input
                      id="share-link"
                      value={shareableLink}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      className="ml-2"
                      variant="outline"
                      onClick={handleCopyLink}
                    >
                      {linkCopied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Access summary</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    {isPublic ? (
                      <>
                        <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Public - Anyone with the link can view</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Private - Only invited people can access</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      Shared with {sharedUsers.length}{" "}
                      {sharedUsers.length === 1 ? "person" : "people"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Remove User Confirmation Dialog */}
      <AlertDialog
        open={!!userToRemove}
        onOpenChange={(open) => !open && setUserToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Access?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the user's access to this mood board. They will
              no longer be able to view or edit it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveUser}>
              Remove Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MoodBoardShare;
