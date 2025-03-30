import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Check, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../../../../src/components/ui/button";
import { Input } from "../../../../src/components/ui/input";
import { Badge } from "../../../../src/components/ui/badge";
import { useLanguage } from "../../../../src/lib/language";
import { TimelineMilestone } from "../../../../src/services/timelineService";
import TimelineTask from "./TimelineTask";

interface TimelineViewProps {
  milestones: TimelineMilestone[];
  onTaskToggle: (milestoneId: string, taskId: string) => void;
  onTaskSkip: (milestoneId: string, taskId: string) => void;
  onAddTask: (milestoneId: string, taskName: string) => void;
  isLoading?: boolean;
}

const TimelineView: React.FC<TimelineViewProps> = ({
  milestones,
  onTaskToggle,
  onTaskSkip,
  onAddTask,
  isLoading = false,
}) => {
  const { language } = useLanguage();
  const [expandedMilestones, setExpandedMilestones] = useState<string[]>([]);
  const [newTaskInputs, setNewTaskInputs] = useState<Record<string, string>>(
    {},
  );
  const [showAddTask, setShowAddTask] = useState<Record<string, boolean>>({});

  // Auto-expand current milestones on first load
  useEffect(() => {
    if (milestones.length > 0 && expandedMilestones.length === 0) {
      const now = new Date();
      const currentMilestones = milestones
        .filter((milestone) => {
          const dueDate = new Date(milestone.dueDate);
          return (
            dueDate >= now &&
            dueDate <=
              new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
          );
        })
        .map((milestone) => milestone.id);

      if (currentMilestones.length > 0) {
        setExpandedMilestones(currentMilestones);
      } else if (milestones.length > 0) {
        // If no current milestones, expand the first one
        setExpandedMilestones([milestones[0].id]);
      }
    }
  }, [milestones]);

  const toggleMilestoneExpansion = (milestoneId: string) => {
    setExpandedMilestones((prev) =>
      prev.includes(milestoneId)
        ? prev.filter((id) => id !== milestoneId)
        : [...prev, milestoneId],
    );
  };

  const handleAddTaskClick = (milestoneId: string) => {
    setShowAddTask((prev) => ({
      ...prev,
      [milestoneId]: !prev[milestoneId],
    }));
    setNewTaskInputs((prev) => ({ ...prev, [milestoneId]: "" }));
  };

  const handleNewTaskChange = (milestoneId: string, value: string) => {
    setNewTaskInputs((prev) => ({ ...prev, [milestoneId]: value }));
  };

  const handleNewTaskSubmit = (milestoneId: string) => {
    const taskName = newTaskInputs[milestoneId]?.trim();
    if (taskName) {
      onAddTask(milestoneId, taskName);
      setNewTaskInputs((prev) => ({ ...prev, [milestoneId]: "" }));
      setShowAddTask((prev) => ({ ...prev, [milestoneId]: false }));
    }
  };

  const calculateProgress = (milestone: TimelineMilestone) => {
    if (milestone.tasks.length === 0) return 100;
    const completedCount = milestone.tasks.filter(
      (task) => task.completed || task.skipped,
    ).length;
    return Math.round((completedCount / milestone.tasks.length) * 100);
  };

  return (
    <div className="space-y-8">
      {milestones.map((milestone) => {
        const isExpanded = expandedMilestones.includes(milestone.id);
        const progress = calculateProgress(milestone);
        const isPast = new Date(milestone.dueDate) < new Date();
        const isNow =
          new Date(milestone.dueDate) >= new Date() &&
          new Date(milestone.dueDate) <=
            new Date(new Date().setMonth(new Date().getMonth() + 1));

        return (
          <div
            key={milestone.id}
            className={`relative border rounded-lg overflow-hidden ${isExpanded ? "shadow-md" : ""} ${isPast ? "border-muted" : isNow ? "border-primary" : "border-border"}`}
          >
            {/* Timeline connector */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border -z-10"></div>

            {/* Milestone header */}
            <div
              className={`flex items-center p-4 cursor-pointer ${isPast ? "bg-muted/30" : isNow ? "bg-primary/10" : "bg-background"}`}
              onClick={() => toggleMilestoneExpansion(milestone.id)}
            >
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center mr-4 ${isPast ? "bg-muted-foreground" : isNow ? "bg-primary" : "bg-accent"}`}
              >
                {progress === 100 ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <span className="text-xs font-bold text-white">
                    {progress}%
                  </span>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{milestone.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(milestone.dueDate), "MMMM yyyy", {
                    locale: language === "de" ? de : undefined,
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isPast && (
                  <Badge variant="outline" className="text-muted-foreground">
                    Past
                  </Badge>
                )}
                {isNow && (
                  <Badge variant="default" className="bg-primary">
                    Current
                  </Badge>
                )}
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </div>

            {/* Milestone content */}
            {isExpanded && (
              <div className="p-4 bg-background border-t">
                <div className="space-y-3">
                  {milestone.tasks.map((task) => (
                    <TimelineTask
                      key={task.id}
                      task={task}
                      onToggle={() => onTaskToggle(milestone.id, task.id)}
                      onSkip={() => onTaskSkip(milestone.id, task.id)}
                      disabled={isLoading}
                    />
                  ))}

                  {/* Add new task input */}
                  {showAddTask[milestone.id] ? (
                    <div className="flex items-center gap-2 mt-4">
                      <Input
                        placeholder="Enter new task..."
                        value={newTaskInputs[milestone.id] || ""}
                        onChange={(e) =>
                          handleNewTaskChange(milestone.id, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleNewTaskSubmit(milestone.id);
                          }
                        }}
                        className="flex-1"
                        autoFocus
                        disabled={isLoading}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleNewTaskSubmit(milestone.id)}
                        disabled={isLoading}
                      >
                        Add
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setShowAddTask((prev) => ({
                            ...prev,
                            [milestone.id]: false,
                          }))
                        }
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => handleAddTaskClick(milestone.id)}
                      disabled={isLoading}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Custom Task
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TimelineView;
