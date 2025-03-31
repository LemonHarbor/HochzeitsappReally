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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { WeddingPhoto } from "@/types/wedding-homepage";
import { 
  createWeddingPhoto, 
  getWeddingPhotosByHomepageId, 
  updateWeddingPhoto,
  deleteWeddingPhoto
} from "@/services/weddingHomepageService";

interface WeddingPhotoGalleryManagerProps {
  homepageId: string;
}

const WeddingPhotoGalleryManager: React.FC<WeddingPhotoGalleryManagerProps> = ({ homepageId }) => {
  const [photos, setPhotos] = useState<WeddingPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<WeddingPhoto | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
        const data = await getWeddingPhotosByHomepageId(homepageId);
        setPhotos(data);
      } catch (error) {
        console.error("Error loading wedding photos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [homepageId]);

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
    setTitle("");
    setDescription("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditingPhotoId(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Set form for editing
  const setFormForEditing = (photo: WeddingPhoto) => {
    setTitle(photo.title || "");
    setDescription(photo.description || "");
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
          title: title || undefined,
          description: description || undefined
        };
        
        const updatedPhoto = await updateWeddingPhoto(editingPhotoId, photoData);
        setPhotos(photos.map(photo => 
          photo.id === editingPhotoId ? updatedPhoto : photo
        ));
      } else if (selectedFile) {
        // Upload new photo
        const photoData = {
          homepage_id: homepageId,
          title: title || undefined,
          description: description || undefined,
          order: photos.length // Add to the end
        };
        
        const newPhoto = await createWeddingPhoto(photoData, selectedFile);
        setPhotos([...photos, newPhoto]);
      }
      
      resetForm();
    } catch (error) {
      console.error("Error uploading/updating photo:", error);
      alert("Fehler beim Hochladen/Aktualisieren des Fotos. Bitte versuche es erneut.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Delete a photo
  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("Bist du sicher, dass du dieses Foto löschen möchtest?")) {
      return;
    }
    
    try {
      await deleteWeddingPhoto(photoId);
      setPhotos(photos.filter(photo => photo.id !== photoId));
      
      // Close viewer if the deleted photo was being viewed
      if (selectedPhoto && selectedPhoto.id === photoId) {
        setIsViewerOpen(false);
        setSelectedPhoto(null);
      }
    } catch (error) {
      console.error("Error deleting wedding photo:", error);
      alert("Fehler beim Löschen des Fotos. Bitte versuche es erneut.");
    }
  };

  // Open photo viewer
  const handleOpenViewer = (photo: WeddingPhoto) => {
    setSelectedPhoto(photo);
    setIsViewerOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Lade Fotos...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fotogalerie</CardTitle>
        <CardDescription>
          Verwalte die Fotos für deine Hochzeitshomepage
        </CardDescription>
      </CardHeader>
      <CardContent>
        {photos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Noch keine Fotos vorhanden. Füge Fotos hinzu, um deine Galerie zu gestalten.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="relative group">
                <div 
                  className="aspect-square rounded-md overflow-hidden cursor-pointer"
                  onClick={() => handleOpenViewer(photo)}
                >
                  <img 
                    src={photo.thumbnail_url || photo.url} 
                    alt={photo.title || "Hochzeitsfoto"} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                
                {/* Photo info overlay on hover */}
                <div className="absolute inset-0 bg-black/60 flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                  <div className="flex justify-end">
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
                        <DropdownMenuItem 
                          onClick={() => handleDeletePhoto(photo.id!)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="text-white">
                    {photo.title && (
                      <p className="font-medium text-sm">{photo.title}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
                  : "Lade ein neues Foto für deine Hochzeitshomepage hoch."
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="z.B. Verlobungsfotos"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Beschreibung (optional)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschreibe das Foto..."
                />
              </div>
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
                {selectedPhoto.title || "Hochzeitsfoto"}
              </DialogTitle>
              {selectedPhoto.description && (
                <DialogDescription>
                  {selectedPhoto.description}
                </DialogDescription>
              )}
            </DialogHeader>
            <div className="flex flex-col items-center">
              <div className="max-h-[60vh] overflow-hidden rounded-md">
                <img 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.title || "Hochzeitsfoto"} 
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <div></div>
              <div className="flex gap-2">
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

export default WeddingPhotoGalleryManager;
