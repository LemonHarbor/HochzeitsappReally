import React from "react";
import PhotoItem from "@/components/guest-area/PhotoItem";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";

const PhotoItemDemo = () => {
  // Sample photo data for demonstration
  const samplePhoto = {
    id: "sample-photo-1",
    user_id: "user-123",
    guest_id: "guest-123",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    caption: "Beautiful wedding ceremony at sunset",
    created_at: new Date().toISOString(),
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="p-8 bg-background">
          <h1 className="text-2xl font-bold mb-6">Photo Item Demo</h1>
          <p className="text-muted-foreground mb-6">
            This demo shows an individual photo card with commenting
            functionality.
          </p>
          <div className="max-w-md mx-auto">
            <PhotoItem
              photo={samplePhoto}
              onDelete={(id) => console.log(`Delete photo ${id}`)}
            />
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default PhotoItemDemo;
