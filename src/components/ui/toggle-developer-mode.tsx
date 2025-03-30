import React from "react";
import { Button } from "./button";
import { useDeveloperMode } from "../../lib/developer";
import { Wrench } from "lucide-react";

export function ToggleDeveloperMode() {
  const { toggleDeveloperMode } = useDeveloperMode();

  return (
    <Button
      variant="outline"
      size="sm"
      className="fixed bottom-4 right-4 z-50 bg-background shadow-md"
      onClick={toggleDeveloperMode}
    >
      <Wrench className="h-4 w-4 mr-2" />
      Toggle Developer Mode
    </Button>
  );
}
