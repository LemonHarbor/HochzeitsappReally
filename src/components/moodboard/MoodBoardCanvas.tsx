import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../src/components/ui/button";
import { Input } from "../../../../src/components/ui/input";
import { Badge } from "../../../../src/components/ui/badge";
import { Separator } from "../../../../src/components/ui/separator";
import { useToast } from "../../../../src/components/ui/use-toast";
import { useAuth } from "../../../../src/context/AuthContext";
import { useRealtimeMoodBoard } from "../../../../src/hooks/useRealtimeMoodBoard";
import { MoodBoardItem } from "../../../../src/types/moodboard";
import {
  updateMoodBoard,
  addMoodBoardItem,
  updateMoodBoardItem,
  deleteMoodBoardItem,
  uploadMoodBoardImage,
  addMoodBoardComment,
} from "../../../../src/services/moodboardService";
import {
  ArrowLeft,
  Plus,
  Image,
  Move,
  Trash2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Save,
  Share2,
  MessageSquare,
  X,
  Send,
  Download,
  Crop,
  Filter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../src/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../../src/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../src/components/ui/tooltip";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "../../../../src/components/ui/drawer";
import { Textarea } from "../../../../src/components/ui/textarea";
import { ScrollArea } from "../../../../src/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "../../../../src/components/ui/avatar";
import { format } from "date-fns";

interface MoodBoardCanvasProps {
  boardId: string;
  onBack: () => void;
}

const MoodBoardCanvas: React.FC<MoodBoardCanvasProps> = ({
  boardId,
  onBack,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { board, items, comments, loading } = useRealtimeMoodBoard(boardId);
  const [selectedItem, setSelectedItem] = useState<MoodBoardItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string>("");
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [editingImage, setEditingImage] = useState<MoodBoardItem | null>(null);
  const [imageFilter, setImageFilter] = useState("");
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user has edit permission
  const canEdit =
    !board?.shared ||
    board?.permission === "edit" ||
    board?.permission === "admin" ||
    board?.user_id === user?.id;

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setShowUploadDialog(true);
    }
  };

  // Handle image upload
  const handleUploadImage = async () => {
    if (!uploadedFile || !user) return;

    try {
      // Upload the image to storage
      const imageUrl = await uploadMoodBoardImage(uploadedFile, user.id);

      // Add the image to the mood board
      await addMoodBoardItem({
        board_id: boardId,
        user_id: user.id,
        image_url: imageUrl,
        position: { x: 100, y: 100 },
        size: { width: 300, height: 200 },
        rotation: 0,
      });

      setShowUploadDialog(false);
      setUploadedFile(null);
      setUploadedPreview("");

      toast({
        title: "Image Uploaded",
        description: "The image has been added to your mood board.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: `Failed to upload image: ${error.message}`,
      });
    }
  };

  // Handle item selection
  const handleSelectItem = (item: MoodBoardItem, e: React.MouseEvent) => {
    if (!canEdit) return;

    e.stopPropagation();
    setSelectedItem(item);
  };

  // Handle item deselection
  const handleDeselectItem = () => {
    setSelectedItem(null);
  };

  // Handle item drag start
  const handleDragStart = (e: React.MouseEvent, item: MoodBoardItem) => {
    if (!canEdit) return;

    e.stopPropagation();
    setIsDragging(true);
    setSelectedItem(item);

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Handle item drag
  const handleDrag = (e: React.MouseEvent) => {
    if (!isDragging || !selectedItem || !canvasRef.current || !canEdit) return;

    e.preventDefault();

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = (e.clientX - canvasRect.left - dragOffset.x) / zoom;
    const newY = (e.clientY - canvasRect.top - dragOffset.y) / zoom;

    // Update the item position locally
    setSelectedItem({
      ...selectedItem,
      position: { x: newX, y: newY },
    });
  };

  // Handle item drag end
  const handleDragEnd = async () => {
    if (!isDragging || !selectedItem || !canEdit) return;

    setIsDragging(false);

    // Update the item position in the database
    try {
      await updateMoodBoardItem(selectedItem.id, {
        position: selectedItem.position,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update item position: ${error.message}`,
      });
    }
  };

  // Handle item resize
  const handleResize = async (width: number, height: number) => {
    if (!selectedItem || !canEdit) return;

    // Update the item size locally
    setSelectedItem({
      ...selectedItem,
      size: { width, height },
    });

    // Update the item size in the database
    try {
      await updateMoodBoardItem(selectedItem.id, {
        size: { width, height },
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update item size: ${error.message}`,
      });
    }
  };

  // Handle item rotation
  const handleRotate = async () => {
    if (!selectedItem || !canEdit) return;

    const newRotation = (selectedItem.rotation || 0) + 90;

    // Update the item rotation locally
    setSelectedItem({
      ...selectedItem,
      rotation: newRotation,
    });

    // Update the item rotation in the database
    try {
      await updateMoodBoardItem(selectedItem.id, {
        rotation: newRotation,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update item rotation: ${error.message}`,
      });
    }
  };

  // Handle item deletion
  const handleDeleteItem = async () => {
    if (!selectedItem || !canEdit) return;

    try {
      await deleteMoodBoardItem(selectedItem.id);
      setSelectedItem(null);

      toast({
        title: "Item Deleted",
        description: "The item has been removed from your mood board.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete item: ${error.message}`,
      });
    }
  };

  // Handle zoom in
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 2));
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.5));
  };

  // Handle adding a comment
  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    try {
      await addMoodBoardComment({
        board_id: boardId,
        user_id: user.id,
        content: newComment.trim(),
      });

      setNewComment("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add comment: ${error.message}`,
      });
    }
  };

  // Handle opening image editor
  const handleOpenImageEditor = (item: MoodBoardItem) => {
    if (!canEdit) return;

    setEditingImage(item);
    setImageFilter(item.filter || "");
    setShowImageEditor(true);
  };

  // Handle applying image filter
  const handleApplyFilter = async () => {
    if (!editingImage || !canEdit) return;

    try {
      await updateMoodBoardItem(editingImage.id, {
        filter: imageFilter,
      });

      setShowImageEditor(false);
      setEditingImage(null);

      toast({
        title: "Filter Applied",
        description: "The image filter has been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to apply filter: ${error.message}`,
      });
    }
  };

  // Get user initials for avatar
  const getUserInitials = (userId: string) => {
    // In a real app, you would fetch the user's name
    // For now, just use the first two characters of the user ID
    return userId.substring(0, 2).toUpperCase();
  };

  // Format date for comments
  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };

  // Apply CSS filter based on filter name
  const getFilterStyle = (filterName: string) => {
    switch (filterName) {
      case "grayscale":
        return "grayscale(100%)";
      case "sepia":
        return "sepia(100%)";
      case "blur":
        return "blur(2px)";
      case "brightness":
        return "brightness(150%)";
      case "contrast":
        return "contrast(150%)";
      case "hue-rotate":
        return "hue-rotate(90deg)";
      case "invert":
        return "invert(80%)";
      case "saturate":
        return "saturate(200%)";
      default:
        return "";
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">
              {board?.title || "Loading..."}
            </h1>
            {board && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {board.category.charAt(0).toUpperCase() +
                    board.category.slice(1)}
                </Badge>
                {board.shared && <Badge variant="secondary">Shared</Badge>}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Plus className="h-4 w-4" />
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add Image</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleZoomIn}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Zoom In</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleZoomOut}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Zoom Out</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowCommentsDrawer(true)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Comments</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/mood-board/${boardId}/share`)}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share Board</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 relative"
        onClick={handleDeselectItem}
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        ref={canvasRef}
      >
        <div
          className="min-h-full min-w-full relative"
          style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <Image className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">This mood board is empty</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                {canEdit
                  ? "Click the + button in the toolbar to add your first image"
                  : "The owner of this board hasn't added any images yet"}
              </p>
              {canEdit && (
                <Button
                  className="mt-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Image
                </Button>
              )}
            </div>
          ) : (
            items.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  className={`absolute cursor-move ${isSelected ? "ring-2 ring-primary" : ""}`}
                  style={{
                    left: `${item.position.x}px`,
                    top: `${item.position.y}px`,
                    width: `${item.size.width}px`,
                    height: `${item.size.height}px`,
                    transform: `rotate(${item.rotation || 0}deg)`,
                    zIndex: isSelected ? 10 : 1,
                  }}
                  onClick={(e) => handleSelectItem(item, e)}
                  onMouseDown={(e) => handleDragStart(e, item)}
                >
                  <img
                    src={item.image_url}
                    alt="Mood board item"
                    className="w-full h-full object-cover"
                    style={{
                      filter: item.filter
                        ? getFilterStyle(item.filter)
                        : undefined,
                    }}
                  />
                  {isSelected && canEdit && (
                    <div className="absolute -top-10 left-0 flex items-center gap-1">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenImageEditor(item);
                        }}
                      >
                        <Filter className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRotate();
                        }}
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem();
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Image to Mood Board</DialogTitle>
            <DialogDescription>
              Upload this image to your mood board. You can resize and position
              it after adding.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            {uploadedPreview && (
              <img
                src={uploadedPreview}
                alt="Preview"
                className="max-h-[300px] max-w-full object-contain"
              />
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowUploadDialog(false);
                setUploadedFile(null);
                setUploadedPreview("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUploadImage}>Add to Board</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comments Drawer */}
      <Drawer open={showCommentsDrawer} onOpenChange={setShowCommentsDrawer}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle>Comments</DrawerTitle>
              <DrawerDescription>
                Discuss ideas and share feedback about this mood board.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <ScrollArea className="h-[300px] pr-4">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {getUserInitials(comment.user_id)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">
                              {comment.user_name ||
                                `User ${comment.user_id.substring(0, 8)}`}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatCommentDate(comment.created_at)}
                            </div>
                          </div>
                          <p className="mt-1">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              <div className="mt-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Image Editor Dialog */}
      <Dialog open={showImageEditor} onOpenChange={setShowImageEditor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
            <DialogDescription>
              Apply filters and effects to your image.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              {editingImage && (
                <img
                  src={editingImage.image_url}
                  alt="Editing"
                  className="max-h-[200px] max-w-full object-contain"
                  style={{
                    filter: imageFilter
                      ? getFilterStyle(imageFilter)
                      : undefined,
                  }}
                />
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="filter"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Filter
              </label>
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant={imageFilter === "" ? "default" : "outline"}
                  className="h-10"
                  onClick={() => setImageFilter("")}
                >
                  None
                </Button>
                <Button
                  variant={imageFilter === "grayscale" ? "default" : "outline"}
                  className="h-10"
                  onClick={() => setImageFilter("grayscale")}
                >
                  Grayscale
                </Button>
                <Button
                  variant={imageFilter === "sepia" ? "default" : "outline"}
                  className="h-10"
                  onClick={() => setImageFilter("sepia")}
                >
                  Sepia
                </Button>
                <Button
                  variant={imageFilter === "brightness" ? "default" : "outline"}
                  className="h-10"
                  onClick={() => setImageFilter("brightness")}
                >
                  Bright
                </Button>
                <Button
                  variant={imageFilter === "contrast" ? "default" : "outline"}
                  className="h-10"
                  onClick={() => setImageFilter("contrast")}
                >
                  Contrast
                </Button>
                <Button
                  variant={imageFilter === "hue-rotate" ? "default" : "outline"}
                  className="h-10"
                  onClick={() => setImageFilter("hue-rotate")}
                >
                  Hue
                </Button>
                <Button
                  variant={imageFilter === "saturate" ? "default" : "outline"}
                  className="h-10"
                  onClick={() => setImageFilter("saturate")}
                >
                  Saturate
                </Button>
                <Button
                  variant={imageFilter === "invert" ? "default" : "outline"}
                  className="h-10"
                  onClick={() => setImageFilter("invert")}
                >
                  Invert
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowImageEditor(false);
                setEditingImage(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleApplyFilter}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MoodBoardCanvas;
