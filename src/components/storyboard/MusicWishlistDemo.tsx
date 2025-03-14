import React from "react";
import MusicWishlistSection from "@/components/guest-area/MusicWishlistSection";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";

const MusicWishlistDemo = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="p-8 bg-background">
          <h1 className="text-2xl font-bold mb-6">Music Wishlist Demo</h1>
          <p className="text-muted-foreground mb-6">
            This demo shows the music wishlist functionality for wedding guests.
            Guests can suggest songs they'd like to hear at the wedding and see
            what others have suggested.
          </p>
          <MusicWishlistSection isEditable={true} />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default MusicWishlistDemo;
