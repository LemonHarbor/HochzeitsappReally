import React, { useState, useEffect, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Trash2, 
  Edit, 
  Image, 
  Download, 
  MoreVertical, 
  Eye, 
  EyeOff, 
  Lock 
} from "lucide-react";
import { JGAPhoto, JGAParticipant } from "@/types/jga";
import { 
  createJGAPhoto, 
  getJGAPhotosByEvent, 
  updateJGAPhoto,
  deleteJGAPhoto
} from "@/services/jgaService";

interface JGAPhotoGalleryProps {
  eventId: string;
  currentParticipantId: string;
  participants: JGAParticipant[];
  isOrganizer: boolean;
}

const JGAPhotoGallery: React.FC<JGAPhotoGalleryProps> = ({ 
  eventId, 
  currentParticipantId, 
  participants, 
  isOrganizer 
}) => {
  const [photos, setPhotos] = useState<JGAPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<JGAPhoto | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  
  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newIsPublic, setNewIsPublic] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  
  // File upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Load photos
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getJGAPhotosByEvent(eventId);
        setPhotos(data);
      } catch (error) {
        console.error("Error loading photos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [eventId]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setNewTitle("");
    setNewDescription("");
    setNewIsPublic(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditingPhotoId(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Set form for editing
  const setFormForEditing = (photo: JGAPhoto) => {
    setNewTitle(photo.title || "");
    setNewDescription(photo.description || "");
    setNewIsPublic(photo.is_public);
    setEditingPhotoId(photo.id!);
    setPreviewUrl(photo.url);
  };

  // Upload a new photo
  const handleUploadPhoto = async () => {
    if (!selectedFile && !editingPhotoId) return;
    
    try {
      setUploadingPhoto(true);
      
      if (editingPhotoId) {
        // Update existing photo metadata
        const photoData = {
          title: newTitle || undefined,
          description: newDescription || undefined,
          is_public: newIsPublic
        };
        
        const updatedPhoto = await updateJGAPhoto(editingPhotoId, photoData);
        setPhotos(photos.map(photo => 
          photo.id === editingPhotoId ? updatedPhoto : photo
        ));
      } else if (selectedFile) {
        // Upload new photo
        const photoData = {
          title: newTitle || undefined,
          description: newDescription || undefined,
          is_public: newIsPublic,
          event_id: eventId,
          uploaded_by: currentParticipantId
        };
        
        const newPhoto = await createJGAPhoto(photoData, selectedFile);
        setPhotos([...photos, newPhoto]);
      }
      
      resetForm();
    } catch (error) {
      console.error("Error uploading/updating photo:", error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Delete a photo
  const handleDeletePhoto = async (photoId: string) => {
    try {
      await deleteJGAPhoto(photoId);
      setPhotos(photos.filter(photo => photo.id !== photoId));
      
      // Close viewer if the deleted photo was being viewed
      if (selectedPhoto && selectedPhoto.id === photoId) {
        setIsViewerOpen(false);
        setSelectedPhoto(null);
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  // Toggle photo visibility
  const handleToggleVisibility = async (photoId: string, isPublic: boolean) => {
    try {
      const updatedPhoto = await updateJGAPhoto(photoId, { is_public: !isPublic });
      setPhotos(photos.map(photo => 
        photo.id === photoId ? updatedPhoto : photo
      ));
      
      // Update selected photo if it's the one being toggled
      if (selectedPhoto && selectedPhoto.id === photoId) {
        setSelectedPhoto(updatedPhoto);
      }
    } catch (error) {
      console.error("Error toggling photo visibility:", error);
    }
  };

  // Open photo viewer
  const handleOpenViewer = (photo: JGAPhoto) => {
    setSelectedPhoto(photo);
    setIsViewerOpen(true);
  };

  // Get participant name by ID
  const getParticipantName = (participantId: string): string => {
    const participant = participants.find(p => p.id === participantId);
    return participant ? participant.name : "Unbekannt";
  };

  // Filter photos based on active tab
  const filteredPhotos = photos.filter(photo => {
    if (activeTab === "all") return true;
    if (activeTab === "mine") return photo.uploaded_by === currentParticipantId;
    if (activeTab === "public") return photo.is_public;
    if (activeTab === "private") return !photo.is_public;
    return true;
  });

  if (loading) {
    return <div className="flex justify-center p-8">Lade Fotos...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fotogalerie</CardTitle>
        <CardDescription>
          Teile und verwalte Fotos vom JGA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Alle</TabsTrigger>
            <TabsTrigger value="mine">Meine</TabsTrigger>
            <TabsTrigger value="public">Öffentlich</TabsTrigger>
            <TabsTrigger value="private">Privat</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="pt-4">
            {filteredPhotos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Keine Fotos in dieser Kategorie vorhanden.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPhotos.map(photo => (
                  <div key={photo.id} className="relative group">
                    <div 
                      className="aspect-square rounded-md overflow-hidden cursor-pointer"
                      onClick={() => handleOpenViewer(photo)}
                    >
                      <img 
                        src={photo.thumbnail_url || photo.url} 
                        alt={photo.title || "JGA Foto"} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    
                    {/* Photo info overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                      <div className="flex justify-between items-start">
                        <Badge variant={photo.is_public ? "default" : "outline"} className="text-xs">
                          {photo.is_public ? "Öffentlich" : "Privat"}
                        </Badge>
                        
                        {(isOrganizer || photo.uploaded_by === currentParticipantId) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setFormForEditing(photo)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Bearbeiten
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleVisibility(photo.id!, photo.is_public)}>
                                {photo.is_public ? (
                                  <>
                                    <EyeOff className="mr-2 h-4 w-4" />
                                    Privat machen
                                  </>
                                ) : (
                                  <>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Öffentlich machen
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeletePhoto(photo.id!)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Löschen
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                      
                      <div className="text-white">
                        {photo.title && (
                          <p className="font-medium text-sm">{photo.title}</p>
                        )}
                        <p className="text-xs opacity-80">
                          Von: {getParticipantName(photo.uploaded_by)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Foto hochladen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPhotoId ? "Foto bearbeiten" : "Foto hochladen"}
              </DialogTitle>
              <DialogDescription>
                {editingPhotoId 
                  ? "Bearbeite die Details des Fotos."
                  : "Lade ein neues Foto vom JGA hoch."
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {!editingPhotoId && (
                <div className="grid gap-2">
                  <Label htmlFor="photo">Foto auswählen</Label>
                  <div 
                    className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {previewUrl ? (
                      <div className="relative aspect-video mx-auto overflow-hidden rounded-md">
                        <img 
                          src={previewUrl} 
                          alt="Vorschau" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="py-4 flex flex-col items-center text-muted-foreground">
                        <Image className="h-8 w-8 mb-2" />
                        <p>Klicke, um ein Foto auszuwählen</p>
                        <p className="text-xs mt-1">JPG, PNG oder GIF, max. 10MB</p>
                      </div>
                    )}
                    <Input 
                      id="photo" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="title">Titel (optional)</Label>
                <Input
                  id="title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="z.B. Gruppenfoto am Strand"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Beschreibung (optional)</Label>
                <Textarea
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Beschreibe das Foto..."
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublic"
                  checked={newIsPublic}
                  onCheckedChange={setNewIsPublic}
                />
                <Label htmlFor="isPublic">Öffentlich für alle Teilnehmer</Label>
              </div>
              
              {!newIsPublic && (
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  <p className="flex items-center">
                    <Lock className="mr-2 h-4 w-4" />
                    Private Fotos sind nur für dich und die Organisatoren sichtbar.
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                onClick={handleUploadPhoto} 
                disabled={((!selectedFile && !editingPhotoId) || uploadingPhoto)}
              >
                {uploadingPhoto 
                  ? "Wird gespeichert..." 
                  : (editingPhotoId ? "Aktualisieren" : "Hochladen")
                }
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>

      {/* Photo Viewer Dialog */}
      {selectedPhoto && (
        <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {selectedPhoto.title || "JGA Foto"}
              </DialogTitle>
              <DialogDescription>
                Hochgeladen von {getParticipantName(selectedPhoto.uploaded_by)}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center">
              <div className="max-h-[60vh] overflow-hidden rounded-md">
                <img 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.title || "JGA Foto"} 
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </div>
              
              {selectedPhoto.description && (
                <p className="mt-4 text-sm text-muted-foreground">
                  {selectedPhoto.description}
                </p>
              )}
            </div>
            <DialogFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={selectedPhoto.is_public ? "default" : "outline"}>
                  {selectedPhoto.is_public ? "Öffentlich" : "Privat"}
                </Badge>
              </div>
              <div className="flex gap-2">
                {(isOrganizer || selectedPhoto.uploaded_by === currentParticipantId) && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleToggleVisibility(selectedPhoto.id!, selectedPhoto.is_public)}
                    >
                      {selectedPhoto.is_public ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Privat machen
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Öffentlich machen
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setIsViewerOpen(false);
                        setFormForEditing(selectedPhoto);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Bearbeiten
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeletePhoto(selectedPhoto.id!)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Löschen
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" asChild>
                  <a href={selectedPhoto.url} download target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Herunterladen
                  </a>
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default JGAPhotoGallery;
