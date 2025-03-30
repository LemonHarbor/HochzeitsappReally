import React from "react";
import PhotoGallery from "../../../../src/components/guest-area/PhotoGallery";
import { ThemeProvider } from "../../../../src/lib/theme";
import { LanguageProvider } from "../../../../src/lib/language";

const PhotoGalleryDemo = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="p-8 bg-background">
          <h1 className="text-2xl font-bold mb-6">Photo Gallery Demo</h1>
          <p className="text-muted-foreground mb-6">
            This demo shows the photo sharing functionality for wedding guests.
            Guests can upload photos, add captions, and comment on photos shared
            by others.
          </p>
          <PhotoGallery isEditable={true} />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default PhotoGalleryDemo;
