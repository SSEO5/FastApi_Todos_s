export type Todo = {
  id: number;
  title: string;
  description: string;
  due_date: string | null;
  status: "시작 전" | "진행 중" | "완료";
  priority?: Priority | null;
  attachments?: Attachment[];
};

export type TodoStats = {
  total: number;
  completed: number;
  not_completed: number;
};

export enum Priority {
  high = "높음",
  medium = "중간",
  low = "낮음",
}

export type SubTask = {
  id: number;
  title: string;
  completed: boolean;
};

export type Attachment = {
  id: string;
  filename: string;
  original_filename: string;
  file_type: string;
  upload_date: string;
};

// 대시보드 관련 타입 정의
export type DashboardSummary = {
  total: number;
  completed: number;
  in_progress: number;
  not_started: number;
  completion_rate: number;
};

export type PriorityDistribution = {
  priority: string;
  count: number;
};

export type StatusDistribution = {
  status: string;
  count: number;
};

export type DueAlert = {
  days_left?: number;
  days_overdue?: number;
};

export type DashboardData = {
  summary: DashboardSummary;
  priority_distribution: PriorityDistribution[];
  status_distribution: StatusDistribution[];
  due_soon: (Todo & { days_left: number })[];
  overdue: (Todo & { days_overdue: number })[];
  recent_activity: Todo[];
};

export type CompletionTrend = {
  date: string;
  total: number;
  completed: number;
  completion_rate: number;
};

export type PriorityCompletion = {
  priority: string;
  total: number;
  completed: number;
  completion_rate: number;
};

export type MonthlyStats = {
  month: string;
  total: number;
  completed: number;
  completion_rate: number;
  high_priority_completion_rate: number;
};

export type DueAlerts = {
  today: Todo[];
  tomorrow: Todo[];
  this_week: (Todo & { days_left: number })[];
  overdue: (Todo & { days_overdue: number })[];
};
