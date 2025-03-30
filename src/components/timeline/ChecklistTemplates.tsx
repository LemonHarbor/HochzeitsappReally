import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { checklistTemplates } from "@/data/checklistTemplates";
import { ChecklistTemplate, TemplateTask } from "@/types/timeline";

interface ChecklistTemplatesProps {
  onSelectTemplate: (template: ChecklistTemplate) => void;
  onSelectTasks: (tasks: TemplateTask[]) => void;
}

const ChecklistTemplates: React.FC<ChecklistTemplatesProps> = ({
  onSelectTemplate,
  onSelectTasks,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<ChecklistTemplate | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<{
    [key: string]: boolean;
  }>({});

  // Filter templates based on search term
  const filteredTemplates = checklistTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle template selection
  const handleTemplateSelect = (template: ChecklistTemplate) => {
    setSelectedTemplate(template);
    // Initialize all tasks as selected
    const initialSelectedTasks = {};
    template.tasks.forEach((task) => {
      initialSelectedTasks[task.name] = true;
    });
    setSelectedTasks(initialSelectedTasks);
  };

  // Handle task selection toggle
  const handleTaskToggle = (taskName: string) => {
    setSelectedTasks({
      ...selectedTasks,
      [taskName]: !selectedTasks[taskName],
    });
  };

  // Handle adding all selected tasks
  const handleAddSelectedTasks = () => {
    if (!selectedTemplate) return;

    const tasksToAdd = selectedTemplate.tasks.filter(
      (task) => selectedTasks[task.name],
    );

    onSelectTasks(tasksToAdd);
  };

  // Handle adding entire template
  const handleAddTemplate = (template: ChecklistTemplate) => {
    onSelectTemplate(template);
  };

  // Get timeframe display
  const getTimeframeDisplay = (timeframe: string) => {
    switch (timeframe) {
      case "12-months":
        return "12 months before";
      case "10-months":
        return "10 months before";
      case "9-months":
        return "9 months before";
      case "8-months":
        return "8 months before";
      case "6-months":
        return "6 months before";
      case "4-months":
        return "4 months before";
      case "3-months":
        return "3 months before";
      case "2-months":
        return "2 months before";
      case "1-month":
        return "1 month before";
      case "2-weeks":
        return "2 weeks before";
      case "1-week":
        return "1 week before";
      default:
        return timeframe;
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      <Tabs defaultValue="browse">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Templates</TabsTrigger>
          <TabsTrigger value="customize" disabled={!selectedTemplate}>
            Customize Tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4 mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{template.name}</CardTitle>
                        <CardDescription>
                          {template.description}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {template.tasks.length} tasks
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.tasks.slice(0, 5).map((task) => (
                        <Badge key={task.name} variant="secondary">
                          {task.name}
                        </Badge>
                      ))}
                      {template.tasks.length > 5 && (
                        <Badge variant="outline">
                          +{template.tasks.length - 5} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTemplateSelect(template)}
                      >
                        Customize
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAddTemplate(template)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add All Tasks
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredTemplates.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No templates found matching your search.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="customize" className="space-y-4 mt-4">
          {selectedTemplate && (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">
                    {selectedTemplate.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Select the tasks you want to add
                  </p>
                </div>
                <Button onClick={handleAddSelectedTasks}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Selected Tasks
                </Button>
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {selectedTemplate.tasks.map((task) => (
                    <div
                      key={task.name}
                      className={`p-3 border rounded-md flex items-center justify-between ${selectedTasks[task.name] ? "border-primary bg-primary/5" : ""}`}
                      onClick={() => handleTaskToggle(task.name)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${selectedTasks[task.name] ? "bg-primary text-primary-foreground" : "border"}`}
                        >
                          {selectedTasks[task.name] && (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </div>
                        <span>{task.name}</span>
                      </div>
                      {task.timeframe && (
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {getTimeframeDisplay(task.timeframe)}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Back to Templates
                </Button>
                <Button onClick={handleAddSelectedTasks}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Selected Tasks
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChecklistTemplates;
