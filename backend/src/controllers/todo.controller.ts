import { TodoService, type GetTodosFilter } from "../services/todo.service";
import { validateTodo, validateUpdateStatus, validateId, type TodoStatus } from "../validators/todo.validator";
import { formatApiResponse, formatApiError } from "../utils/todo.utils";

export class TodoController {
  /**
   * GET /api/todos
   */
  static async getAll({ query, set }: { query: Record<string, string | undefined>; set: { status?: any } }) {
    try {
      const filters: GetTodosFilter = {
        search: query.search,
        status: query.status,
        priority: query.priority,
        sortBy: query.sortBy as GetTodosFilter["sortBy"],
        order: query.order as GetTodosFilter["order"],
      };

      const todos = await TodoService.getAllTodos(filters);
      set.status = 200;
      return formatApiResponse(todos);
    } catch (error) {
      console.error("Error in getAll:", error);
      set.status = 500;
      return formatApiError("Terjadi kesalahan pada server");
    }
  }

  /**
   * GET /api/todos/:id
   */
  static async getById({ params, set }: { params: { id: string }; set: { status?: any } }) {
    try {
      const idVal = validateId(params.id);
      if (!idVal.valid || !idVal.id) {
        set.status = 400;
        return formatApiError(idVal.message || "ID tidak valid");
      }

      const todo = await TodoService.getTodoById(idVal.id);
      if (!todo) {
        set.status = 404;
        return formatApiError("Todo tidak ditemukan");
      }

      set.status = 200;
      return formatApiResponse(todo);
    } catch (error) {
      console.error("Error in getById:", error);
      set.status = 500;
      return formatApiError("Terjadi kesalahan pada server");
    }
  }

  /**
   * POST /api/todos
   */
  static async create({ body, set }: { body: any; set: { status?: any } }) {
    try {
      const validation = validateTodo(body);
      if (!validation.valid) {
        set.status = 400;
        return formatApiError(validation.message || "Data tidak valid");
      }

      const todo = await TodoService.createTodo({
        title: body.title,
        description: body.description,
        status: body.status,
        priority: body.priority,
        dueDate: body.dueDate,
      });

      set.status = 201;
      return formatApiResponse(todo);
    } catch (error) {
      console.error("Error in create:", error);
      set.status = 500;
      return formatApiError("Terjadi kesalahan pada server");
    }
  }

  /**
   * PUT /api/todos/:id
   */
  static async update({ params, body, set }: { params: { id: string }; body: any; set: { status?: any } }) {
    try {
      const idVal = validateId(params.id);
      if (!idVal.valid || !idVal.id) {
        set.status = 400;
        return formatApiError(idVal.message || "ID tidak valid");
      }

      // Pastikan item ada
      const existing = await TodoService.getTodoById(idVal.id);
      if (!existing) {
        set.status = 404;
        return formatApiError("Todo tidak ditemukan");
      }

      const validation = validateTodo(body);
      if (!validation.valid) {
        set.status = 400;
        return formatApiError(validation.message || "Data tidak valid");
      }

      const updated = await TodoService.updateTodo(idVal.id, body);
      set.status = 200;
      return formatApiResponse(updated);
    } catch (error) {
      console.error("Error in update:", error);
      set.status = 500;
      return formatApiError("Terjadi kesalahan pada server");
    }
  }

  /**
   * PATCH /api/todos/:id/status
   */
  static async updateStatus({ params, body, set }: { params: { id: string }; body: any; set: { status?: any } }) {
    try {
      const idVal = validateId(params.id);
      if (!idVal.valid || !idVal.id) {
        set.status = 400;
        return formatApiError(idVal.message || "ID tidak valid");
      }

      const validation = validateUpdateStatus(body?.status);
      if (!validation.valid) {
        set.status = 400;
        return formatApiError(validation.message || "Status tidak valid");
      }

      const existing = await TodoService.getTodoById(idVal.id);
      if (!existing) {
        set.status = 404;
        return formatApiError("Todo tidak ditemukan");
      }

      const updated = await TodoService.updateTodoStatus(idVal.id, body.status.toUpperCase() as TodoStatus);
      set.status = 200;
      return formatApiResponse(updated);
    } catch (error) {
      console.error("Error in updateStatus:", error);
      set.status = 500;
      return formatApiError("Terjadi kesalahan pada server");
    }
  }

  /**
   * DELETE /api/todos/:id
   */
  static async delete({ params, set }: { params: { id: string }; set: { status?: any } }) {
    try {
      const idVal = validateId(params.id);
      if (!idVal.valid || !idVal.id) {
        set.status = 400;
        return formatApiError(idVal.message || "ID tidak valid");
      }

      const existing = await TodoService.getTodoById(idVal.id);
      if (!existing) {
        set.status = 404;
        return formatApiError("Todo tidak ditemukan");
      }

      await TodoService.deleteTodo(idVal.id);
      set.status = 200;
      return {
        success: true,
        message: "Todo berhasil dihapus",
      };
    } catch (error) {
      console.error("Error in delete:", error);
      set.status = 500;
      return formatApiError("Terjadi kesalahan pada server");
    }
  }

  /**
   * GET /api/dashboard
   */
  static async getDashboard({ set }: { set: { status?: any } }) {
    try {
      const stats = await TodoService.getDashboardStats();
      set.status = 200;
      return formatApiResponse(stats);
    } catch (error) {
      console.error("Error in getDashboard:", error);
      set.status = 500;
      return formatApiError("Terjadi kesalahan pada server");
    }
  }
}
