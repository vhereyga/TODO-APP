export type TodoStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  status: TodoStatus;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  recent: Todo[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: unknown;
}

export interface TodoFormData {
  title: string;
  description?: string;
  status?: TodoStatus;
  priority?: Priority;
  dueDate?: string;
}

export interface TodoFilters {
  search: string;
  status: "ALL" | TodoStatus;
  priority: "ALL" | Priority;
  sortBy: "createdAt" | "dueDate" | "priority" | "title";
  order: "asc" | "desc";
}
