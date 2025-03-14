import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Wand2,
  Save,
  Trash2,
  HelpCircle,
} from "lucide-react";
import { useLanguage } from "@/lib/language";

interface TableControlsProps {
  onAddTable?: (shape: string) => void;
  onOptimizeSeating?: () => void;
  onSaveArrangement?: () => void;
  onClearAll?: () => void;
}

const TableControls = ({
  onAddTable = () => {},
  onOptimizeSeating = () => {},
  onSaveArrangement = () => {},
  onClearAll = () => {},
}: TableControlsProps) => {
  const [selectedShape, setSelectedShape] = useState("round");
  const [tableSize, setTableSize] = useState([8]);
  const [autoAssign, setAutoAssign] = useState(false);
  const { t } = useLanguage();

  const handleAddTable = () => {
    onAddTable(selectedShape);
  };

  return (
    <div className="w-full h-full bg-background border-l p-4 flex flex-col gap-6 overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("tables.addTable")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("tables.shape")}</label>
            <div className="flex flex-wrap gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        selectedShape === "round" ? "default" : "outline"
                      }
                      size="icon"
                      onClick={() => setSelectedShape("round")}
                    >
                      <Circle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("tables.round")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        selectedShape === "rectangle" ? "default" : "outline"
                      }
                      size="icon"
                      onClick={() => setSelectedShape("rectangle")}
                    >
                      <Square className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("tables.rectangle")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        selectedShape === "triangle" ? "default" : "outline"
                      }
                      size="icon"
                      onClick={() => setSelectedShape("triangle")}
                    >
                      <Triangle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Triangle Table</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        selectedShape === "hexagon" ? "default" : "outline"
                      }
                      size="icon"
                      onClick={() => setSelectedShape("hexagon")}
                    >
                      <Hexagon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Hexagon Table</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {t("tables.capacity")}
              </label>
              <span className="text-sm">
                {tableSize[0]} {t("tables.seats")}
              </span>
            </div>
            <Slider
              value={tableSize}
              min={2}
              max={12}
              step={1}
              onValueChange={setTableSize}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <label className="text-sm font-medium">Auto-assign guests</label>
            <Switch checked={autoAssign} onCheckedChange={setAutoAssign} />
          </div>

          <Button className="w-full" onClick={handleAddTable}>
            <Plus className="mr-2 h-4 w-4" /> {t("tables.addTable")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("tables.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={onOptimizeSeating}
          >
            <Wand2 className="mr-2 h-4 w-4" /> {t("tables.aiOptimize")}
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={onSaveArrangement}
            >
              <Save className="mr-2 h-4 w-4" /> {t("actions.save")}
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={onClearAll}
            >
              <Trash2 className="mr-2 h-4 w-4" /> {t("tables.clearAll")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Drag tables to position</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Drag tables on the canvas to position them. Drag guests from
                  the pool to assign them to tables.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default TableControls;
