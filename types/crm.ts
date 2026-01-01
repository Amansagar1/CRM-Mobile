/**
 * TypeScript Type Definitions for CRM Application
 */

// Contact Types
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  avatar?: string;
  status: ContactStatus;
  tags: string[];
  notes?: string;
  address?: Address;
  socialMedia?: SocialMedia;
  dateAdded: Date;
  lastContact?: Date;
  assignedTo?: string;
  dealValue?: number;
}

export type ContactStatus = 'active' | 'inactive' | 'lead' | 'customer' | 'prospect';

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface SocialMedia {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
}

// Deal Types
export interface Deal {
  id: string;
  title: string;
  contactId: string;
  contactName: string;
  value: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate: Date;
  actualCloseDate?: Date;
  description?: string;
  notes?: string;
  createdDate: Date;
  lastUpdated: Date;
  assignedTo?: string;
  products?: string[];
  lostReason?: string;
}

export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export const DealStageLabels: Record<DealStage, string> = {
  lead: 'Lead',
  qualified: 'Qualified',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
};

// Task Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  contactId?: string;
  contactName?: string;
  dealId?: string;
  dealTitle?: string;
  assignedTo?: string;
  createdDate: Date;
  completedDate?: Date;
  reminder?: Date;
  type: TaskType;
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskType = 'call' | 'email' | 'meeting' | 'follow_up' | 'other';

export const TaskPriorityLabels: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const TaskTypeLabels: Record<TaskType, string> = {
  call: 'Call',
  email: 'Email',
  meeting: 'Meeting',
  follow_up: 'Follow Up',
  other: 'Other',
};

// Activity Types
export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  contactId?: string;
  contactName?: string;
  dealId?: string;
  dealTitle?: string;
  taskId?: string;
  date: Date;
  userId?: string;
  userName?: string;
  metadata?: Record<string, any>;
}

export type ActivityType = 
  | 'contact_created'
  | 'contact_updated'
  | 'deal_created'
  | 'deal_updated'
  | 'deal_stage_changed'
  | 'deal_won'
  | 'deal_lost'
  | 'task_created'
  | 'task_completed'
  | 'note_added'
  | 'email_sent'
  | 'call_made'
  | 'meeting_scheduled';

// Analytics Types
export interface MetricCard {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
  color: string;
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
  deals: number;
}

export interface FunnelData {
  stage: DealStage;
  count: number;
  value: number;
  conversionRate?: number;
}

// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: UserRole;
  phone?: string;
  department?: string;
  preferences?: UserPreferences;
}

export type UserRole = 'admin' | 'manager' | 'sales_rep' | 'viewer';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    taskReminders: boolean;
    dealUpdates: boolean;
  };
  language: string;
  timezone: string;
}

// Filter & Sort Types
export interface ContactFilters {
  status?: ContactStatus[];
  tags?: string[];
  dateAddedFrom?: Date;
  dateAddedTo?: Date;
  assignedTo?: string[];
  search?: string;
}

export interface DealFilters {
  stage?: DealStage[];
  valueMin?: number;
  valueMax?: number;
  expectedCloseDateFrom?: Date;
  expectedCloseDateTo?: Date;
  assignedTo?: string[];
  search?: string;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  type?: TaskType[];
  dueDateFrom?: Date;
  dueDateTo?: Date;
  assignedTo?: string[];
  search?: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  field: string;
  direction: SortDirection;
  label: string;
}
