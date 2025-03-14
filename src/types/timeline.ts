export interface TimelineMilestone {
  id: string;
  title: string;
  due_date: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface TimelineTask {
  id: string;
  name: string;
  milestone_id: string;
  completed?: boolean;
  skipped?: boolean;
  is_custom?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  description: string;
  tasks: TemplateTask[];
}

export interface TemplateTask {
  name: string;
  category?: string;
  timeframe?: string; // e.g., "12-months", "6-months", "1-month", "1-week"
}
