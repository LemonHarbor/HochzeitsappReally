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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import WeddingHomepageCreator from "@/components/wedding-homepage/WeddingHomepageCreator";
import WeddingEventManager from "@/components/wedding-homepage/WeddingEventManager";
import WeddingPhotoGalleryManager from "@/components/wedding-homepage/WeddingPhotoGalleryManager";
import WeddingFAQManager from "@/components/wedding-homepage/WeddingFAQManager";
import WeddingGiftRegistryManager from "@/components/wedding-homepage/WeddingGiftRegistryManager";
import WeddingRSVPManager from "@/components/wedding-homepage/WeddingRSVPManager";
import WeddingAccommodationManager from "@/components/wedding-homepage/WeddingAccommodationManager";
import WeddingGuestbookManager from "@/components/wedding-homepage/WeddingGuestbookManager";
import WeddingMapManager from "@/components/wedding-homepage/WeddingMapManager";
import WeddingCountdown from "@/components/wedding-homepage/WeddingCountdown";
import { WeddingHomepage } from "@/types/wedding-homepage";
import { 
  getWeddingHomepageByUserId,
  updateWeddingHomepage
} from "@/services/weddingHomepageService";
import { useAuth } from "@/hooks/useAuth";
import { 
  Palette, 
  Calendar, 
  Image, 
  HelpCircle, 
  Gift, 
  Users, 
  Building, 
  MessageSquare, 
  Map, 
  Clock, 
  Globe, 
  Settings 
} from "lucide-react";

const WeddingHomepageDashboard: React.FC = () => {
  const { user } = useAuth();
  const [homepage, setHomepage] = useState<WeddingHomepage | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("design");
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const data = await getWeddingHomepageByUserId(user.id);
        setHomepage(data);
        setIsPublished(data?.is_published || false);
      } catch (error) {
        console.error("Error loading wedding homepage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleHomepageCreated = (homepageId: string) => {
    // Reload the homepage data
    if (user) {
      getWeddingHomepageByUserId(user.id)
        .then(data => {
          setHomepage(data);
          setIsPublished(data?.is_published || false);
        })
        .catch(error => {
          console.error("Error reloading wedding homepage:", error);
        });
    }
  };

  const handleTogglePublish = async () => {
    if (!homepage) return;
    
    try {
      const updatedHomepage = await updateWeddingHomepage(homepage.id!, {
        is_published: !isPublished
      });
      
      setIsPublished(updatedHomepage.is_published);
    } catch (error) {
      console.error("Error toggling publish status:", error);
      alert("Fehler beim Ändern des Veröffentlichungsstatus. Bitte versuche es erneut.");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Lade Hochzeitshomepage-Dashboard...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Hochzeitshomepage</h1>
          <p className="text-muted-foreground">
            Gestalte und verwalte deine persönliche Hochzeitshomepage
          </p>
        </div>
        
        {homepage && (
          <div className="flex items-center gap-2">
            <Button
              variant={isPublished ? "destructive" : "default"}
              onClick={handleTogglePublish}
            >
              {isPublished ? "Deaktivieren" : "Veröffentlichen"}
            </Button>
            
            {isPublished && (
              <Button variant="outline" asChild>
                <a 
                  href={`/wedding/${homepage.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Öffentliche Seite
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
      
      {!homepage ? (
        <Card>
          <CardHeader>
            <CardTitle>Erstelle deine Hochzeitshomepage</CardTitle>
            <CardDescription>
              Beginne mit der Erstellung deiner persönlichen Hochzeitshomepage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WeddingHomepageCreator 
              userId={user?.id || ""} 
              onHomepageCreated={handleHomepageCreated}
            />
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-11">
            <TabsTrigger value="design" className="flex items-center">
              <Palette className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Design</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center">
              <Image className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Galerie</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="gifts" className="flex items-center">
              <Gift className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Geschenke</span>
            </TabsTrigger>
            <TabsTrigger value="rsvp" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">RSVP</span>
            </TabsTrigger>
            <TabsTrigger value="accommodation" className="flex items-center">
              <Building className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Unterkünfte</span>
            </TabsTrigger>
            <TabsTrigger value="guestbook" className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Gästebuch</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center">
              <Map className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Karte</span>
            </TabsTrigger>
            <TabsTrigger value="countdown" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Countdown</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Einstellungen</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="mt-6">
            <WeddingHomepageCreator 
              userId={user?.id || ""} 
              existingHomepage={homepage}
              onHomepageCreated={handleHomepageCreated}
            />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <WeddingEventManager homepageId={homepage.id!} />
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <WeddingPhotoGalleryManager homepageId={homepage.id!} />
          </TabsContent>

          <TabsContent value="faq" className="mt-6">
            <WeddingFAQManager homepageId={homepage.id!} />
          </TabsContent>

          <TabsContent value="gifts" className="mt-6">
            <WeddingGiftRegistryManager homepageId={homepage.id!} />
          </TabsContent>

          <TabsContent value="rsvp" className="mt-6">
            <WeddingRSVPManager homepageId={homepage.id!} />
          </TabsContent>

          <TabsContent value="accommodation" className="mt-6">
            <WeddingAccommodationManager homepageId={homepage.id!} />
          </TabsContent>

          <TabsContent value="guestbook" className="mt-6">
            <WeddingGuestbookManager homepageId={homepage.id!} />
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            <WeddingMapManager homepageId={homepage.id!} />
          </TabsContent>

          <TabsContent value="countdown" className="mt-6">
            <WeddingCountdown homepageId={homepage.id!} />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Einstellungen</CardTitle>
                <CardDescription>
                  Verwalte die Einstellungen deiner Hochzeitshomepage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Veröffentlichungsstatus</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${isPublished ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span>{isPublished ? 'Veröffentlicht' : 'Nicht veröffentlicht'}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isPublished 
                        ? 'Deine Hochzeitshomepage ist öffentlich zugänglich.' 
                        : 'Deine Hochzeitshomepage ist derzeit nicht öffentlich zugänglich.'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Öffentliche URL</h3>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted p-2 rounded-md text-sm">
                        {`${window.location.origin}/wedding/${homepage.id}`}
                      </code>
                      <Button variant="outline" size="sm" onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/wedding/${homepage.id}`);
                        alert('URL in die Zwischenablage kopiert!');
                      }}>
                        Kopieren
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={isPublished ? "destructive" : "default"}
                  onClick={handleTogglePublish}
                >
                  {isPublished ? "Homepage deaktivieren" : "Homepage veröffentlichen"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default WeddingHomepageDashboard;
