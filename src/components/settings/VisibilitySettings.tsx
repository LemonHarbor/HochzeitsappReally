import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Save } from "lucide-react";

interface FeatureVisibility {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

const VisibilitySettings = () => {
  const { toast } = useToast();
  const [features, setFeatures] = useState<FeatureVisibility[]>([
    {
      id: "rsvp",
      name: "RSVP Form",
      description: "Allow guests to RSVP through the guest portal",
      enabled: true,
    },
    {
      id: "photos",
      name: "Photo Upload",
      description: "Allow guests to upload photos to your wedding gallery",
      enabled: true,
    },
    {
      id: "music",
      name: "Music Wishlist",
      description: "Allow guests to suggest songs for your playlist",
      enabled: true,
    },
    {
      id: "timeline",
      name: "Event Timeline",
      description: "Show the wedding day schedule to your guests",
      enabled: true,
    },
    {
      id: "guestList",
      name: "Guest List",
      description: "Allow guests to see who else is attending",
      enabled: false,
    },
    {
      id: "registry",
      name: "Gift Registry",
      description: "Show your gift registry to guests",
      enabled: false,
    },
  ]);

  const toggleFeature = (id: string) => {
    setFeatures(
      features.map((feature) =>
        feature.id === id ? { ...feature, enabled: !feature.enabled } : feature,
      ),
    );
  };

  const saveSettings = () => {
    // In a real app, this would save to the database
    toast({
      title: "Settings saved",
      description: "Your visibility settings have been updated.",
    });
  };

  return (
    <Card className="w-full bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Visibility Settings
        </CardTitle>
        <CardDescription>
          Control which features are visible to your guests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex items-center justify-between space-y-0 rounded-md border p-4"
            >
              <div className="space-y-0.5">
                <div className="flex items-center">
                  {feature.enabled ? (
                    <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">{feature.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </div>
              <Switch
                checked={feature.enabled}
                onCheckedChange={() => toggleFeature(feature.id)}
              />
            </div>
          ))}
        </div>

        <Button onClick={saveSettings} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Visibility Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default VisibilitySettings;
