import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ChecklistTemplates from "./ChecklistTemplates";
import { ChecklistTemplate, TemplateTask } from "@/types/timeline";

interface TemplateSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: ChecklistTemplate) => void;
  onSelectTasks: (tasks: TemplateTask[]) => void;
  milestoneId?: string;
}

const TemplateSelectionDialog: React.FC<TemplateSelectionDialogProps> = ({
  open,
  onOpenChange,
  onSelectTemplate,
  onSelectTasks,
  milestoneId,
}) => {
  const handleSelectTemplate = (template: ChecklistTemplate) => {
    onSelectTemplate(template);
    onOpenChange(false);
  };

  const handleSelectTasks = (tasks: TemplateTask[]) => {
    onSelectTasks(tasks);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Checklist Templates</DialogTitle>
          <DialogDescription>
            Choose a template or select specific tasks to add to your timeline.
          </DialogDescription>
        </DialogHeader>
        <ChecklistTemplates
          onSelectTemplate={handleSelectTemplate}
          onSelectTasks={handleSelectTasks}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelectionDialog;
