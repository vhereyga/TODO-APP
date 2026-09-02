import React, { useState, useEffect, useCallback } from "react";
import type { Todo, DashboardStats, TodoFilters, TodoFormData, TodoStatus } from "./types/todo";
import { todoApi } from "./services/todoApi";
import { Navbar } from "./components/Navbar";
import { DashboardPage } from "./pages/DashboardPage";
import { TodosPage } from "./pages/TodosPage";
import { KanbanPage } from "./pages/KanbanPage";
import { TodoModal } from "./components/TodoModal";
import { DeleteModal } from "./components/DeleteModal";
import { ToastContainer, type ToastMessage } from "./components/Toast";

export function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "todos" | "kanban">("dashboard");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("taskmaster_theme") as "light" | "dark") || "dark";
  });

  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters State
  const [filters, setFilters] = useState<TodoFilters>({
    search: "",
    status: "ALL",
    priority: "ALL",
    sortBy: "createdAt",
    order: "desc",
  });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error" | "info", message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Set HTML theme attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("taskmaster_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Fetch Stats and Todos
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, todosData] = await Promise.all([
        todoApi.getDashboardStats(),
        todoApi.getTodos(filters),
      ]);
      setStats(statsData);
      setTodos(todosData);
    } catch (err: any) {
      console.error("Failed to fetch data:", err);
      addToast("error", err.message || "Gagal memuat data dari backend");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Create Todo
  const handleCreateTodo = async (data: TodoFormData) => {
    try {
      await todoApi.createTodo(data);
      addToast("success", "Todo berhasil dibuat!");
      loadData();
    } catch (err: any) {
      addToast("error", err.message || "Gagal membuat Todo");
      throw err;
    }
  };

  // Handle Edit Todo
  const handleUpdateTodo = async (data: TodoFormData) => {
    if (!editingTodo) return;
    try {
      await todoApi.updateTodo(editingTodo.id, data);
      addToast("success", "Todo berhasil diperbarui!");
      setEditingTodo(null);
      loadData();
    } catch (err: any) {
      addToast("error", err.message || "Gagal memperbarui Todo");
      throw err;
    }
  };

  // Handle Quick Status Switcher (Bab 3.6 SRS)
  const handleUpdateStatus = async (id: number, nextStatus: TodoStatus) => {
    try {
      // Optimistic UI update
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: nextStatus, updatedAt: new Date().toISOString() } : t))
      );

      await todoApi.updateStatus(id, nextStatus);
      addToast("info", `Status diubah menjadi ${nextStatus.replace("_", " ")}`);
      
      // Refresh stats
      const newStats = await todoApi.getDashboardStats();
      setStats(newStats);
    } catch (err: any) {
      addToast("error", err.message || "Gagal mengubah status");
      loadData();
    }
  };

  // Handle Delete Todo (Bab 3.5 SRS)
  const handleConfirmDelete = async () => {
    if (!deletingTodo) return;
    setDeleteLoading(true);
    try {
      await todoApi.deleteTodo(deletingTodo.id);
      addToast("success", `Todo "${deletingTodo.title}" berhasil dihapus`);
      setDeletingTodo(null);
      loadData();
    } catch (err: any) {
      addToast("error", err.message || "Gagal menghapus Todo");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Navigation Helper
  const navigateToTodosWithFilter = (statusFilter?: string) => {
    if (statusFilter) {
      setFilters((prev) => ({ ...prev, status: statusFilter as any }));
    }
    setActiveTab("todos");
  };

  return (
    <div>
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      <div className="app-container">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <main>
          {activeTab === "dashboard" && (
            <DashboardPage
              stats={stats}
              loading={loading}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onNavigateToTodos={navigateToTodosWithFilter}
              onEditTodo={(todo) => setEditingTodo(todo)}
              onQuickUpdateStatus={handleUpdateStatus}
            />
          )}

          {activeTab === "todos" && (
            <TodosPage
              todos={todos}
              loading={loading}
              filters={filters}
              setFilters={setFilters}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onEditTodo={(todo) => setEditingTodo(todo)}
              onDeleteTodo={(todo) => setDeletingTodo(todo)}
              onUpdateStatus={handleUpdateStatus}
            />
          )}

          {activeTab === "kanban" && (
            <KanbanPage
              todos={todos}
              loading={loading}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onEditTodo={(todo) => setEditingTodo(todo)}
              onDeleteTodo={(todo) => setDeletingTodo(todo)}
              onUpdateStatus={handleUpdateStatus}
            />
          )}
        </main>
      </div>

      {/* Add Todo Modal */}
      <TodoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateTodo}
        mode="create"
      />

      {/* Edit Todo Modal */}
      <TodoModal
        isOpen={!!editingTodo}
        onClose={() => setEditingTodo(null)}
        onSubmit={handleUpdateTodo}
        initialData={editingTodo}
        mode="edit"
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deletingTodo}
        onClose={() => setDeletingTodo(null)}
        onConfirm={handleConfirmDelete}
        todo={deletingTodo}
        loading={deleteLoading}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
