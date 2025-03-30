import React, { useState, useEffect } from "react";
import { Calendar, Download, FileDown } from "lucide-react";
import { format, differenceInMonths, addMonths } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "../../../../src/components/ui/button";
import { Calendar as CalendarComponent } from "../../../../src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../src/components/ui/popover";
import { Checkbox } from "../../../../src/components/ui/checkbox";
import { Label } from "../../../../src/components/ui/label";
import { Progress } from "../../../../src/components/ui/progress";
import { Separator } from "../../../../src/components/ui/separator";
import { useToast } from "../../../../src/components/ui/use-toast";
import { useLanguage } from "../../../../src/lib/language";
import { useAuth } from "../../../../src/context/AuthContext";
import { cn } from "../../../../src/lib/utils";
import TimelineView from "./TimelineView";
import {
  generateTimeline,
  TimelineMilestone,
  saveTimeline,
  loadTimeline,
  getCompletedTasks,
} from "../../../../src/services/timelineService";

interface TimelineGeneratorProps {
  initialWeddingDate?: Date;
  onSave?: (weddingDate: Date, milestones: TimelineMilestone[]) => void;
}

const TimelineGenerator: React.FC<TimelineGeneratorProps> = ({
  initialWeddingDate,
  onSave = () => {},
}) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [weddingDate, setWeddingDate] = useState<Date | undefined>(
    initialWeddingDate || undefined,
  );
  const [milestones, setMilestones] = useState<TimelineMilestone[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Common tasks that might already be completed
  const commonTasks = [
    { id: "venue", label: t("timeline.tasks.venue") },
    { id: "date", label: t("timeline.tasks.dateSelected") },
    { id: "budget", label: t("timeline.tasks.budgetSet") },
    { id: "guestList", label: t("timeline.tasks.guestListStarted") },
    { id: "photographer", label: t("timeline.tasks.photographerBooked") },
    { id: "catering", label: t("timeline.tasks.cateringBooked") },
  ];

  // Load saved timeline data when component mounts
  useEffect(() => {
    if (user) {
      loadSavedTimeline();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Generate timeline when wedding date changes or completed tasks change
  useEffect(() => {
    if (weddingDate && !isLoading) {
      generateTimelineData();
    }
  }, [weddingDate, completedTasks, isLoading]);

  // Calculate progress
  useEffect(() => {
    if (milestones.length > 0) {
      const totalTasks = milestones.reduce(
        (sum, milestone) => sum + milestone.tasks.length,
        0,
      );
      const completedCount = milestones.reduce(
        (sum, milestone) =>
          sum +
          milestone.tasks.filter((task) => task.completed || task.skipped)
            .length,
        0,
      );
      setProgress(Math.round((completedCount / totalTasks) * 100));
    }
  }, [milestones]);

  // Load saved timeline from the database
  const loadSavedTimeline = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Load completed tasks first
      const savedCompletedTasks = await getCompletedTasks(user.id);
      setCompletedTasks(savedCompletedTasks);

      // Load timeline data
      const { weddingDate: savedDate, milestones: savedMilestones } =
        await loadTimeline(user.id);

      if (savedDate) {
        setWeddingDate(savedDate);
      }

      if (savedMilestones && savedMilestones.length > 0) {
        setMilestones(savedMilestones);
        toast({
          title: "Timeline Loaded",
          description: "Your saved wedding timeline has been loaded.",
        });
      }
    } catch (error) {
      console.error("Error loading timeline:", error);
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: "Failed to load your saved timeline.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateTimelineData = async () => {
    if (!weddingDate) return;

    setIsGenerating(true);
    try {
      // Calculate months until wedding
      const today = new Date();
      const monthsUntilWedding = differenceInMonths(weddingDate, today);

      // Generate timeline based on wedding date and completed tasks
      const generatedMilestones = await generateTimeline(
        weddingDate,
        completedTasks,
      );
      setMilestones(generatedMilestones);

      // Show toast with planning timeframe
      let timeframeMessage = "";
      if (monthsUntilWedding > 12) {
        timeframeMessage = t("timeline.longTermPlanning");
      } else if (monthsUntilWedding >= 6) {
        timeframeMessage = t("timeline.mediumTermPlanning");
      } else {
        timeframeMessage = t("timeline.shortTermPlanning");
      }

      toast({
        title: t("timeline.generated"),
        description: timeframeMessage,
      });
    } catch (error) {
      console.error("Error generating timeline:", error);
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: t("timeline.generationError"),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTaskToggle = (milestoneId: string, taskId: string) => {
    setMilestones((prev) =>
      prev.map((milestone) => {
        if (milestone.id === milestoneId) {
          return {
            ...milestone,
            tasks: milestone.tasks.map((task) => {
              if (task.id === taskId) {
                const newCompleted = !task.completed;

                // Update completedTasks state for future timeline generations
                if (newCompleted) {
                  setCompletedTasks((prev) => [...prev, taskId]);
                } else {
                  setCompletedTasks((prev) =>
                    prev.filter((id) => id !== taskId),
                  );
                }

                return { ...task, completed: newCompleted };
              }
              return task;
            }),
          };
        }
        return milestone;
      }),
    );
  };

  const handleTaskSkip = (milestoneId: string, taskId: string) => {
    setMilestones((prev) =>
      prev.map((milestone) => {
        if (milestone.id === milestoneId) {
          return {
            ...milestone,
            tasks: milestone.tasks.map((task) => {
              if (task.id === taskId) {
                return { ...task, skipped: !task.skipped };
              }
              return task;
            }),
          };
        }
        return milestone;
      }),
    );
  };

  const handleAddTask = (milestoneId: string, taskName: string) => {
    if (!taskName.trim()) return;

    setMilestones((prev) =>
      prev.map((milestone) => {
        if (milestone.id === milestoneId) {
          return {
            ...milestone,
            tasks: [
              ...milestone.tasks,
              {
                id: `custom-${Date.now()}`,
                name: taskName,
                completed: false,
                skipped: false,
                isCustom: true,
              },
            ],
          };
        }
        return milestone;
      }),
    );
  };

  const handleSaveTimeline = async () => {
    if (!weddingDate || !user) {
      toast({
        variant: "destructive",
        title: "Cannot Save",
        description: "Please set a wedding date and ensure you're logged in.",
      });
      return;
    }

    try {
      // Save to database
      await saveTimeline(weddingDate, milestones, user.id);

      // Call the onSave prop if provided
      onSave(weddingDate, milestones);

      toast({
        title: t("timeline.saved"),
        description: t("timeline.savedDescription"),
      });
    } catch (error) {
      console.error("Error saving timeline:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description:
          "There was a problem saving your timeline. Please try again.",
      });
    }
  };

  const handleExportTimeline = () => {
    if (!weddingDate || milestones.length === 0) {
      toast({
        variant: "destructive",
        title: "Cannot Export",
        description: "Please set a wedding date and generate a timeline first.",
      });
      return;
    }

    // Determine if user wants CSV or PDF (for now just CSV)
    exportTimelineToCSV();
  };

  const exportTimelineToCSV = () => {
    // Create CSV content
    const headers = ["Milestone", "Due Date", "Task", "Status"];

    let csvRows = [headers.join(",")];

    milestones.forEach((milestone) => {
      const milestoneDate = format(new Date(milestone.dueDate), "yyyy-MM-dd");

      if (milestone.tasks.length === 0) {
        // Add milestone with no tasks
        csvRows.push(`"${milestone.title}","${milestoneDate}","",""`);
      } else {
        // Add milestone with each task
        milestone.tasks.forEach((task) => {
          let status = "Pending";
          if (task.completed) status = "Completed";
          else if (task.skipped) status = "Skipped";

          csvRows.push(
            `"${milestone.title}","${milestoneDate}","${task.name}","${status}"`,
          );
        });
      }
    });

    // Create and download the CSV file
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `wedding_timeline_${format(new Date(), "yyyy-MM-dd")}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Timeline Exported",
      description: "Your wedding timeline has been exported as a CSV file.",
    });
  };

  const handleCompletedTaskToggle = (taskId: string, checked: boolean) => {
    if (checked) {
      setCompletedTasks((prev) => [...prev, taskId]);
    } else {
      setCompletedTasks((prev) => prev.filter((id) => id !== taskId));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 w-full max-w-4xl mx-auto bg-background p-6 rounded-lg border">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">
          Loading your wedding timeline...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto bg-background p-6 rounded-lg border">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("timeline.title")}</h1>
          <p className="text-muted-foreground">{t("timeline.description")}</p>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={weddingDate ? "outline" : "default"}
                className={cn(
                  "justify-start text-left font-normal",
                  !weddingDate && "text-muted-foreground",
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {weddingDate ? (
                  format(weddingDate, "PPP", {
                    locale: language === "de" ? de : undefined,
                  })
                ) : (
                  <span>{t("timeline.selectDate")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={weddingDate}
                onSelect={setWeddingDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>

          <Button
            onClick={handleSaveTimeline}
            disabled={!weddingDate || milestones.length === 0 || !user}
          >
            {t("actions.save")}
          </Button>

          <Button
            variant="outline"
            onClick={handleExportTimeline}
            disabled={!weddingDate || milestones.length === 0}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {weddingDate && (
        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold">
                {t("timeline.weddingDate")}:{" "}
                {format(weddingDate, "PPP", {
                  locale: language === "de" ? de : undefined,
                })}
              </h2>
              <p className="text-sm text-muted-foreground">
                {differenceInMonths(weddingDate, new Date())}{" "}
                {t("timeline.monthsUntilWedding")}
              </p>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {t("timeline.progress")}:
                </span>
                <span className="text-sm font-bold">{progress}%</span>
              </div>
              <Progress value={progress} className="w-[200px] h-2" />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {t("timeline.alreadyCompleted")}:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {commonTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center space-x-2 bg-background p-3 rounded-md border"
                >
                  <Checkbox
                    id={task.id}
                    checked={completedTasks.includes(task.id)}
                    onCheckedChange={(checked) =>
                      handleCompletedTaskToggle(task.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={task.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {task.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isGenerating ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">
            {t("timeline.generating")}
          </p>
        </div>
      ) : (
        <>
          {weddingDate && milestones.length > 0 ? (
            <TimelineView
              milestones={milestones}
              onTaskToggle={handleTaskToggle}
              onTaskSkip={handleTaskSkip}
              onAddTask={handleAddTask}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">
                {t("timeline.selectDatePrompt")}
              </h3>
              <p className="text-muted-foreground max-w-md mt-2">
                {t("timeline.selectDateDescription")}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TimelineGenerator;
