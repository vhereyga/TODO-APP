export interface BaseTodo {
  id?: number;
  title: string;
  description?: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | string;
  priority: "LOW" | "MEDIUM" | "HIGH" | string;
  dueDate?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Mengecek apakah Todo sudah melewati batas waktu (overdue)
 * Jika dueDate < waktu sekarang dan status BUKAN COMPLETED -> overdue (true)
 */
export function isOverdue(
  dueDate: Date | string | null | undefined,
  status: string | undefined,
  referenceDate: Date = new Date()
): boolean {
  if (!dueDate) return false;
  if (status && status.toUpperCase() === "COMPLETED") return false;

  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return false;

  return due.getTime() < referenceDate.getTime();
}

/**
 * Menghitung ringkasan statistik dari daftar Todo
 */
export function calculateDashboardStats(todos: BaseTodo[], referenceDate: Date = new Date()) {
  const total = todos.length;
  let pending = 0;
  let inProgress = 0;
  let completed = 0;
  let overdue = 0;

  for (const todo of todos) {
    const st = (todo.status || "").toUpperCase();
    if (st === "PENDING") pending++;
    else if (st === "IN_PROGRESS") inProgress++;
    else if (st === "COMPLETED") completed++;

    if (isOverdue(todo.dueDate, todo.status, referenceDate)) {
      overdue++;
    }
  }

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    pending,
    inProgress,
    completed,
    overdue,
    completionRate,
  };
}

/**
 * Memformat response standar API
 */
export function formatApiResponse<T>(data: T, success = true) {
  return {
    success,
    data,
  };
}

/**
 * Memformat response error standar API
 */
export function formatApiError(message: string, errors?: unknown) {
  return {
    success: false,
    message,
    ...(errors ? { errors } : {}),
  };
}
