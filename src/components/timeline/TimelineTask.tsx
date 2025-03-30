import React from "react";
import { Checkbox } from "../../../../src/components/ui/checkbox";
import { Badge } from "../../../../src/components/ui/badge";
import { Button } from "../../../../src/components/ui/button";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../src/components/ui/tooltip";
import { TimelineTask as TimelineTaskType } from "../../../../src/services/timelineService";

interface TimelineTaskProps {
  task: TimelineTaskType;
  onToggle: () => void;
  onSkip: () => void;
  disabled?: boolean;
}

const TimelineTask: React.FC<TimelineTaskProps> = ({
  task,
  onToggle,
  onSkip,
  disabled = false,
}) => {
  return (
    <div
      className={`flex items-center p-3 rounded-md ${task.completed ? "bg-primary/10" : task.skipped ? "bg-muted" : "bg-card"}`}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={onToggle}
        disabled={task.skipped || disabled}
        className="mr-3"
      />
      <span
        className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : task.skipped ? "text-muted-foreground" : ""}`}
      >
        {task.name}
        {task.isCustom && (
          <Badge variant="outline" className="ml-2 text-xs bg-background">
            Custom
          </Badge>
        )}
      </span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onSkip}
              disabled={task.completed || disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{task.skipped ? "Mark as relevant" : "Skip this task"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default TimelineTask;
