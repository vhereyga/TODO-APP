import React, { useState, useMemo } from "react";
import type { Todo, TodoFilters, TodoStatus, Priority } from "../types/todo";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";
import {
  Search,
  Plus,
  Calendar,
  AlertTriangle,
  Edit2,
  Trash2,
  CheckCircle2,
  CircleDot,
  Clock,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import confetti from "canvas-confetti";

interface Props {
  todos: Todo[];
  loading: boolean;
  filters: TodoFilters;
  setFilters: React.Dispatch<React.SetStateAction<TodoFilters>>;
  onOpenAddModal: () => void;
  onEditTodo: (todo: Todo) => void;
  onDeleteTodo: (todo: Todo) => void;
  onUpdateStatus: (id: number, nextStatus: TodoStatus) => Promise<void>;
}

export const TodosPage: React.FC<Props> = ({
  todos,
  loading,
  filters,
  setFilters,
  onOpenAddModal,
  onEditTodo,
  onDeleteTodo,
  onUpdateStatus,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const isOverdue = (dueDate: string | null, status: TodoStatus) => {
    if (!dueDate || status === "COMPLETED") return false;
    return new Date(dueDate).getTime() < Date.now();
  };

  const handleStatusClick = async (todo: Todo) => {
    let nextStatus: TodoStatus = "IN_PROGRESS";
    if (todo.status === "PENDING") nextStatus = "IN_PROGRESS";
    else if (todo.status === "IN_PROGRESS") nextStatus = "COMPLETED";
    else if (todo.status === "COMPLETED") nextStatus = "PENDING";

    if (nextStatus === "COMPLETED") {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }

    await onUpdateStatus(todo.id, nextStatus);
  };

  return (
    <div>
      {/* Header Page Title */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Daftar Tugas & Todo</h1>
          <p className="page-subtitle">
            Cari, filter, kelola prioritas, dan ubah status tugas Anda.
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenAddModal}>
          <Plus size={18} />
          <span>Tambah Todo Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar (Bab 3.7 & 3.8 SRS) */}
      <div className="controls-bar">
        {/* Search Input */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Cari tugas berdasarkan judul atau deskripsi..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          />
        </div>

        {/* Filters Group */}
        <div className="filters-group">
          {/* Status Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Filter size={15} style={{ color: "var(--text-muted)" }} />
            <select
              className="select-control"
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as any }))}
              aria-label="Filter Status"
            >
              <option value="ALL">Semua Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <select
            className="select-control"
            value={filters.priority}
            onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value as any }))}
            aria-label="Filter Priority"
          >
            <option value="ALL">Semua Prioritas</option>
            <option value="LOW">Priority: Low</option>
            <option value="MEDIUM">Priority: Medium</option>
            <option value="HIGH">Priority: High</option>
          </select>

          {/* Sort By Dropdown (Bab XXV: Sorting Bonus Feature) */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <ArrowUpDown size={15} style={{ color: "var(--text-muted)" }} />
            <select
              className="select-control"
              value={`${filters.sortBy}-${filters.order}`}
              onChange={(e) => {
                const [sortBy, order] = e.target.value.split("-") as [any, any];
                setFilters((prev) => ({ ...prev, sortBy, order }));
              }}
              aria-label="Sort By"
            >
              <option value="createdAt-desc">Terbaru (Newest)</option>
              <option value="createdAt-asc">Terlama (Oldest)</option>
              <option value="dueDate-asc">Deadline Terdekat</option>
              <option value="title-asc">Judul (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Todo List / Grid View */}
      {loading ? (
        <div className="glass-card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
          <p>Memuat daftar Todo...</p>
        </div>
      ) : todos.length === 0 ? (
        <div className="glass-card" style={{ textAlign: "center", padding: "3.5rem 1.5rem" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "var(--bg-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              color: "var(--text-muted)",
            }}
          >
            <Search size={28} />
          </div>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "0.4rem" }}>Tidak ada Todo yang ditemukan</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "1.5rem" }}>
            {filters.search || filters.status !== "ALL" || filters.priority !== "ALL"
              ? "Coba sesuaikan kata kunci pencarian atau filter Anda."
              : "Mulai hari Anda dengan menambahkan tugas baru."}
          </p>
          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <Plus size={18} />
            <span>Tambah Todo Baru</span>
          </button>
        </div>
      ) : (
        <div className="todo-grid">
          {todos.map((todo) => {
            const overdue = isOverdue(todo.dueDate, todo.status);

            return (
              <div
                key={todo.id}
                className={`todo-card ${todo.status === "COMPLETED" ? "completed-card" : ""}`}
              >
                <div>
                  <div className="todo-card-header">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <PriorityBadge priority={todo.priority} />
                      <StatusBadge status={todo.status} />
                    </div>
                  </div>

                  <h3 className="todo-title" style={{ marginTop: "0.6rem" }}>{todo.title}</h3>
                  {todo.description && <p className="todo-desc">{todo.description}</p>}

                  <div className="todo-meta">
                    {todo.dueDate && (
                      <span className={`todo-date ${overdue ? "overdue" : ""}`}>
                        {overdue ? <AlertTriangle size={13} /> : <Calendar size={13} />}
                        <span>
                          {new Date(todo.dueDate).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {overdue && <span className="badge badge-overdue" style={{ fontSize: "0.7rem", padding: "0.15rem 0.45rem" }}>Overdue</span>}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions Row */}
                <div className="todo-actions">
                  <button
                    className="status-dropdown-btn"
                    onClick={() => handleStatusClick(todo)}
                    title="Klik untuk mengubah status selanjutnya"
                  >
                    {todo.status === "PENDING" && (
                      <>
                        <CircleDot size={14} style={{ color: "var(--status-inprogress)" }} />
                        <span>Mulai Kerjakan</span>
                      </>
                    )}
                    {todo.status === "IN_PROGRESS" && (
                      <>
                        <CheckCircle2 size={14} style={{ color: "var(--status-completed)" }} />
                        <span>Selesaikan</span>
                      </>
                    )}
                    {todo.status === "COMPLETED" && (
                      <>
                        <Clock size={14} style={{ color: "var(--status-pending)" }} />
                        <span>Ulangi (Pending)</span>
                      </>
                    )}
                  </button>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <button
                      className="btn-icon"
                      onClick={() => onEditTodo(todo)}
                      title="Edit Todo"
                      aria-label="Edit Todo"
                      style={{ width: "32px", height: "32px" }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => onDeleteTodo(todo)}
                      title="Hapus Todo"
                      aria-label="Hapus Todo"
                      style={{ width: "32px", height: "32px", color: "var(--status-overdue)" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
