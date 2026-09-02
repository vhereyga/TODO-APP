import type { Todo, DashboardStats, ApiResponse, TodoFormData, TodoFilters } from "../types/todo";

// Base API URL sesuai Bab VI SRS: http://localhost:3000/api
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:3000/api";

class ApiError extends Error {
  constructor(public message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      throw new ApiError(data.message || `Request failed with status ${response.status}`, response.status);
    }

    return data.data as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || "Gagal menghubungi server API backend");
  }
}

export const todoApi = {
  /**
   * Mengambil semua Todo dengan filter opsional (Bab 6.1 SRS)
   */
  async getTodos(filters?: Partial<TodoFilters>): Promise<Todo[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.status && filters.status !== "ALL") params.append("status", filters.status);
    if (filters?.priority && filters.priority !== "ALL") params.append("priority", filters.priority);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.order) params.append("order", filters.order);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    return request<Todo[]>(`/todos${queryString}`);
  },

  /**
   * Mengambil Todo berdasarkan ID (Bab 6.2 SRS)
   */
  async getTodoById(id: number): Promise<Todo> {
    return request<Todo>(`/todos/${id}`);
  },

  /**
   * Membuat Todo baru (Bab 6.3 SRS)
   */
  async createTodo(data: TodoFormData): Promise<Todo> {
    return request<Todo>("/todos", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Memperbarui Todo (Bab 6.4 SRS)
   */
  async updateTodo(id: number, data: TodoFormData): Promise<Todo> {
    return request<Todo>(`/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Mengubah status Todo (Bab 6.6 SRS)
   */
  async updateStatus(id: number, status: string): Promise<Todo> {
    return request<Todo>(`/todos/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Menghapus Todo (Bab 6.5 SRS)
   */
  async deleteTodo(id: number): Promise<{ success: boolean; message: string }> {
    const url = `${API_BASE_URL}/todos/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new ApiError(data.message || "Gagal menghapus Todo", response.status);
    }
    return data;
  },

  /**
   * Mengambil statistik dashboard (Bab 6.7 SRS)
   */
  async getDashboardStats(): Promise<DashboardStats> {
    return request<DashboardStats>("/dashboard");
  },
};
