export type TodoStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

export const VALID_STATUSES: TodoStatus[] = ["PENDING", "IN_PROGRESS", "COMPLETED"];
export const VALID_PRIORITIES: Priority[] = ["LOW", "MEDIUM", "HIGH"];

export interface ValidateResult {
  valid: boolean;
  message?: string;
  field?: string;
}

export interface CreateTodoInput {
  title?: string;
  description?: string | null;
  status?: string;
  priority?: string;
  dueDate?: string | Date | null;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string | null;
  status?: string;
  priority?: string;
  dueDate?: string | Date | null;
}

/**
 * Validasi pembuatan atau update Todo sesuai spesifikasi Bab VII & Bab X SRS.
 */
export function validateTodo(data: Partial<CreateTodoInput>): ValidateResult {
  if (!data || typeof data !== "object") {
    return { valid: false, message: "Request body tidak valid" };
  }

  // Validasi Title
  if (data.title === undefined || data.title === null || String(data.title).trim() === "") {
    return { valid: false, message: "Title wajib diisi", field: "title" };
  }

  // Validasi Priority jika ada
  if (data.priority !== undefined && data.priority !== null && data.priority !== "") {
    const priorityUpper = String(data.priority).toUpperCase() as Priority;
    if (!VALID_PRIORITIES.includes(priorityUpper)) {
      return {
        valid: false,
        message: `Priority tidak valid. Pilihan yang diperbolehkan: ${VALID_PRIORITIES.join(", ")}`,
        field: "priority",
      };
    }
  }

  // Validasi Status jika ada
  if (data.status !== undefined && data.status !== null && data.status !== "") {
    const statusUpper = String(data.status).toUpperCase() as TodoStatus;
    if (!VALID_STATUSES.includes(statusUpper)) {
      return {
        valid: false,
        message: `Status tidak valid. Pilihan yang diperbolehkan: ${VALID_STATUSES.join(", ")}`,
        field: "status",
      };
    }
  }

  // Validasi DueDate jika ada
  if (data.dueDate !== undefined && data.dueDate !== null && data.dueDate !== "") {
    const d = new Date(data.dueDate);
    if (isNaN(d.getTime())) {
      return {
        valid: false,
        message: "Format due date tidak valid",
        field: "dueDate",
      };
    }
  }

  return { valid: true };
}

/**
 * Validasi update status khusus PATCH /api/todos/:id/status
 */
export function validateUpdateStatus(status: unknown): ValidateResult {
  if (!status || typeof status !== "string" || String(status).trim() === "") {
    return { valid: false, message: "Status wajib diisi", field: "status" };
  }

  const statusUpper = status.trim().toUpperCase() as TodoStatus;
  if (!VALID_STATUSES.includes(statusUpper)) {
    return {
      valid: false,
      message: `Status tidak valid. Pilihan yang diperbolehkan: ${VALID_STATUSES.join(", ")}`,
      field: "status",
    };
  }

  return { valid: true };
}

/**
 * Validasi parameter ID
 */
export function validateId(idParam: string | number): { valid: boolean; id?: number; message?: string } {
  const num = Number(idParam);
  if (!idParam || isNaN(num) || !Number.isInteger(num) || num <= 0) {
    return { valid: false, message: "ID Todo harus berupa bilangan bulat positif" };
  }
  return { valid: true, id: num };
}
