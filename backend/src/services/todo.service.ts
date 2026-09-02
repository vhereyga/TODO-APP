import prisma from "../lib/prisma";
import type { TodoStatus, Priority } from "@prisma/client";
import { isOverdue } from "../utils/todo.utils";

export interface GetTodosFilter {
  search?: string;
  status?: TodoStatus | string;
  priority?: Priority | string;
  sortBy?: "createdAt" | "dueDate" | "priority" | "title";
  order?: "asc" | "desc";
}

export interface CreateTodoData {
  title: string;
  description?: string | null;
  status?: TodoStatus;
  priority?: Priority;
  dueDate?: Date | string | null;
}

export interface UpdateTodoData {
  title?: string;
  description?: string | null;
  status?: TodoStatus;
  priority?: Priority;
  dueDate?: Date | string | null;
}

export class TodoService {
  /**
   * Mengambil semua Todos dengan filter opsional (search, status, priority, sort)
   */
  static async getAllTodos(filters: GetTodosFilter = {}) {
    const where: Record<string, unknown> = {};

    if (filters.search && filters.search.trim() !== "") {
      where.OR = [
        { title: { contains: filters.search.trim(), mode: "insensitive" } },
        { description: { contains: filters.search.trim(), mode: "insensitive" } },
      ];
    }

    if (filters.status && filters.status !== "ALL") {
      where.status = filters.status.toUpperCase() as TodoStatus;
    }

    if (filters.priority && filters.priority !== "ALL") {
      where.priority = filters.priority.toUpperCase() as Priority;
    }

    let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
    if (filters.sortBy) {
      const order = filters.order === "asc" ? "asc" : "desc";
      orderBy = { [filters.sortBy]: order };
    }

    const todos = await prisma.todo.findMany({
      where,
      orderBy,
    });

    return todos;
  }

  /**
   * Mengambil Todo berdasarkan ID
   */
  static async getTodoById(id: number) {
    const todo = await prisma.todo.findUnique({
      where: { id },
    });
    return todo;
  }

  /**
   * Membuat Todo baru
   */
  static async createTodo(data: CreateTodoData) {
    const dueDateParsed = data.dueDate ? new Date(data.dueDate) : null;

    const todo = await prisma.todo.create({
      data: {
        title: data.title.trim(),
        description: data.description ? data.description.trim() : null,
        status: (data.status?.toUpperCase() as TodoStatus) || "PENDING",
        priority: (data.priority?.toUpperCase() as Priority) || "MEDIUM",
        dueDate: dueDateParsed,
      },
    });

    return todo;
  }

  /**
   * Memperbarui Todo secara keseluruhan (PUT)
   */
  static async updateTodo(id: number, data: UpdateTodoData) {
    const updatePayload: Record<string, unknown> = {};

    if (data.title !== undefined) updatePayload.title = data.title.trim();
    if (data.description !== undefined) updatePayload.description = data.description ? data.description.trim() : null;
    if (data.status !== undefined) updatePayload.status = data.status.toUpperCase() as TodoStatus;
    if (data.priority !== undefined) updatePayload.priority = data.priority.toUpperCase() as Priority;
    if (data.dueDate !== undefined) {
      updatePayload.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: updatePayload,
    });

    return todo;
  }

  /**
   * Memperbarui status Todo (PATCH)
   */
  static async updateTodoStatus(id: number, status: TodoStatus) {
    const todo = await prisma.todo.update({
      where: { id },
      data: {
        status: status.toUpperCase() as TodoStatus,
      },
    });

    return todo;
  }

  /**
   * Menghapus Todo berdasarkan ID
   */
  static async deleteTodo(id: number) {
    const deleted = await prisma.todo.delete({
      where: { id },
    });

    return deleted;
  }

  /**
   * Menghitung statistik untuk Dashboard (Bab 3.1 & Bab 6.7 SRS)
   */
  static async getDashboardStats() {
    const [total, pending, inProgress, completed, allTodos, recentTodos] = await Promise.all([
      prisma.todo.count(),
      prisma.todo.count({ where: { status: "PENDING" } }),
      prisma.todo.count({ where: { status: "IN_PROGRESS" } }),
      prisma.todo.count({ where: { status: "COMPLETED" } }),
      prisma.todo.findMany({ select: { id: true, status: true, dueDate: true } }),
      prisma.todo.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const now = new Date();
    let overdue = 0;
    for (const t of allTodos) {
      if (isOverdue(t.dueDate, t.status, now)) {
        overdue++;
      }
    }

    return {
      total,
      pending,
      inProgress,
      completed,
      overdue,
      recent: recentTodos,
    };
  }
}
