import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeMoodBoards } from "@/hooks/useRealtimeMoodBoard";
import { MoodBoard, MoodBoardFormData } from "@/types/moodboard";
import { createMoodBoard, deleteMoodBoard } from "@/services/moodboardService";
import {
  Grid,
  Plus,
  Search,
  X,
  Folder,
  Share2,
  Edit,
  Trash2,
  ExternalLink,
  Users,
  Lock,
  Unlock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface MoodBoardListProps {
  onCreateBoard?: () => void;
  onEditBoard?: (board: MoodBoard) => void;
  onViewBoard?: (boardId: string) => void;
}

// Extended MoodBoard interface for the component
interface ExtendedMoodBoard extends MoodBoard {
  title: string;
  category: string;
  shared?: boolean;
  permission?: string;
}

const MoodBoardList: React.FC<MoodBoardListProps> = ({
  onCreateBoard = () => {},
  onEditBoard = () => {},
  onViewBoard = () => {},
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { moodBoards: boards, loading } = useRealtimeMoodBoards(user?.id || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");
  const [newBoardCategory, setNewBoardCategory] = useState("general");
  const [boardToDelete, setBoardToDelete] = useState<string | null>(null);

  // Filter boards based on search and category
  const filteredBoards = boards.filter((board: ExtendedMoodBoard) => {
    const matchesSearch =
      searchTerm === "" ||
      board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (board.description &&
        board.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      !categoryFilter || board.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Get unique categories from boards
  const categories = Array.from(
    new Set(boards.map((board: ExtendedMoodBoard) => board.category))
  );

  // Handle creating a new board
  const handleCreateBoard = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to create a mood board.",
      });
      return;
    }

    if (!newBoardTitle.trim()) {
      toast({
        variant: "destructive",
        title: "Title Required",
        description: "Please enter a title for your mood board.",
      });
      return;
    }

    try {
      const newBoardData: MoodBoardFormData = {
        name: newBoardTitle.trim(),
        description: newBoardDescription.trim(),
        is_public: false,
      };

      // @ts-ignore - We know this is safe because we're adding the user_id
      const newBoard = await createMoodBoard({
        ...newBoardData,
        user_id: user.id,
        category: newBoardCategory,
      });

      setShowCreateDialog(false);
      setNewBoardTitle("");
      setNewBoardDescription("");
      setNewBoardCategory("general");

      // Navigate to the new board
      onViewBoard(newBoard.id);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create mood board: ${error.message}`,
      });
    }
  };

  // Handle deleting a board
  const handleDeleteBoard = async () => {
    if (!boardToDelete) return;

    try {
      await deleteMoodBoard(boardToDelete);
      setBoardToDelete(null);

      toast({
        title: "Mood Board Deleted",
        description: "The mood board has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete mood board: ${error.message}`,
      });
    }
  };

  // Get category display name
  const getCategoryDisplay = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mood Boards</h1>
          <p className="text-muted-foreground">
            Collect and organize inspiration for your wedding
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Mood Board
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search mood boards..."
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

        <Select
          value={categoryFilter || ""}
          onValueChange={(value) =>
            setCategoryFilter(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category as string} value={category as string}>
                {getCategoryDisplay(category as string)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="h-[220px] animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/4 mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mt-4"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mt-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : filteredBoards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBoards.map((board: ExtendedMoodBoard) => (
            <Card
              key={board.id}
              className="overflow-hidden hover:border-primary cursor-pointer transition-colors"
              onClick={() => onViewBoard(board.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-1">
                      {board.title}
                    </CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {getCategoryDisplay(board.category)}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="12" cy="5" r="1" />
                          <circle cx="12" cy="19" r="1" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewBoard(board.id);
                        }}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Board
                      </DropdownMenuItem>
                      {(!board.shared || board.permission === "admin") && (
                        <>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditBoard(board);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setBoardToDelete(board.id);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Board
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {board.description || "No description provided."}
                </p>
                <div className="flex items-center mt-4 text-xs text-muted-foreground">
                  {board.is_public ? (
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      <span>Public</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Lock className="mr-1 h-3 w-3" />
                      <span>Private</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Folder className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No mood boards found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchTerm || categoryFilter
              ? "Try adjusting your search or filters"
              : "Get started by creating your first mood board"}
          </p>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="mt-4"
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Mood Board
          </Button>
        </div>
      )}

      {/* Create Mood Board Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Mood Board</DialogTitle>
            <DialogDescription>
              Create a new mood board to collect and organize your wedding
              inspiration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Title
              </label>
              <Input
                id="title"
                placeholder="Enter a title for your mood board"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Description (optional)
              </label>
              <Input
                id="description"
                placeholder="Enter a description"
                value={newBoardDescription}
                onChange={(e) => setNewBoardDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="category"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Category
              </label>
              <Select
                value={newBoardCategory}
                onValueChange={setNewBoardCategory}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="ceremony">Ceremony</SelectItem>
                  <SelectItem value="reception">Reception</SelectItem>
                  <SelectItem value="attire">Attire</SelectItem>
                  <SelectItem value="decor">Decor</SelectItem>
                  <SelectItem value="flowers">Flowers</SelectItem>
                  <SelectItem value="food">Food & Drinks</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateBoard}>Create Board</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!boardToDelete}
        onOpenChange={(open) => !open && setBoardToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this mood board and all of its
              contents. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBoard}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MoodBoardList;
