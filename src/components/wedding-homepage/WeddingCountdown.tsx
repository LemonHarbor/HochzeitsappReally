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
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Heart 
} from "lucide-react";
import { WeddingHomepage } from "@/types/wedding-homepage";
import { getWeddingHomepageById } from "@/services/weddingHomepageService";

interface WeddingCountdownProps {
  homepageId: string;
}

const WeddingCountdown: React.FC<WeddingCountdownProps> = ({ homepageId }) => {
  const [homepage, setHomepage] = useState<WeddingHomepage | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [countdownFinished, setCountdownFinished] = useState(false);
  
  // Load homepage data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getWeddingHomepageById(homepageId);
        setHomepage(data);
      } catch (error) {
        console.error("Error loading wedding homepage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [homepageId]);

  // Update countdown timer
  useEffect(() => {
    if (!homepage || !homepage.wedding_date) return;

    const weddingDate = new Date(homepage.wedding_date);
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setCountdownFinished(true);
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds
      });
    };
    
    // Initial update
    updateCountdown();
    
    // Update every second
    const intervalId = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(intervalId);
  }, [homepage]);

  if (loading) {
    return <div className="flex justify-center p-8">Lade Countdown...</div>;
  }

  if (!homepage) {
    return <div className="text-center p-8">Hochzeitshomepage nicht gefunden.</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Countdown bis zur Hochzeit</CardTitle>
        <CardDescription>
          Zeigt die verbleibende Zeit bis zu deinem großen Tag
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-medium mb-2">
              {countdownFinished 
                ? "Der große Tag ist da!" 
                : "Bis zur Hochzeit von " + homepage.couple_names
              }
            </h3>
            <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{new Date(homepage.wedding_date).toLocaleDateString('de-DE')}</span>
            </div>
          </div>
          
          {countdownFinished ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Heart className="h-16 w-16 text-primary mb-4" />
              <h2 className="text-2xl font-bold">Herzlichen Glückwunsch!</h2>
              <p className="text-muted-foreground mt-2">Wir wünschen euch alles Gute für eure gemeinsame Zukunft.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-3xl md:text-4xl font-bold">{timeRemaining.days}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">Tage</div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-3xl md:text-4xl font-bold">{timeRemaining.hours}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">Stunden</div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-3xl md:text-4xl font-bold">{timeRemaining.minutes}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">Minuten</div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-3xl md:text-4xl font-bold">{timeRemaining.seconds}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">Sekunden</div>
              </div>
            </div>
          )}
          
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
            <p className="text-sm">
              Dieser Countdown wird auf deiner Hochzeitshomepage angezeigt und zählt automatisch herunter bis zu deinem großen Tag.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeddingCountdown;
