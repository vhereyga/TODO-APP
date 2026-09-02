import React, { useState } from "react";
import type { Todo, TodoStatus } from "../types/todo";
import { PriorityBadge } from "../components/PriorityBadge";
import {
  Clock,
  CircleDot,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  GripVertical,
} from "lucide-react";
import confetti from "canvas-confetti";

interface Props {
  todos: Todo[];
  loading: boolean;
  onOpenAddModal: () => void;
  onEditTodo: (todo: Todo) => void;
  onDeleteTodo: (todo: Todo) => void;
  onUpdateStatus: (id: number, nextStatus: TodoStatus) => Promise<void>;
}

export const KanbanPage: React.FC<Props> = ({
  todos,
  loading,
  onOpenAddModal,
  onEditTodo,
  onDeleteTodo,
  onUpdateStatus,
}) => {
  const [draggedTodoId, setDraggedTodoId] = useState<number | null>(null);

  const pendingTodos = todos.filter((t) => t.status === "PENDING");
  const inProgressTodos = todos.filter((t) => t.status === "IN_PROGRESS");
  const completedTodos = todos.filter((t) => t.status === "COMPLETED");

  const isOverdue = (dueDate: string | null, status: TodoStatus) => {
    if (!dueDate || status === "COMPLETED") return false;
    return new Date(dueDate).getTime() < Date.now();
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedTodoId(id);
    e.dataTransfer.setData("text/plain", String(id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: TodoStatus) => {
    e.preventDefault();
    const idStr = e.dataTransfer.getData("text/plain") || String(draggedTodoId);
    const id = Number(idStr);
    if (!id) return;

    const todo = todos.find((t) => t.id === id);
    if (todo && todo.status !== targetStatus) {
      if (targetStatus === "COMPLETED") {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
      await onUpdateStatus(id, targetStatus);
    }
    setDraggedTodoId(null);
  };

  const renderCard = (todo: Todo) => {
    const overdue = isOverdue(todo.dueDate, todo.status);

    return (
      <div
        key={todo.id}
        draggable
        onDragStart={(e) => handleDragStart(e, todo.id)}
        style={{
          background: "var(--bg-subtle)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-md)",
          padding: "1rem",
          cursor: "grab",
          transition: "var(--transition)",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
        className="kanban-item"
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <PriorityBadge priority={todo.priority} />
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <button
              onClick={() => onEditTodo(todo)}
              className="btn-icon"
              style={{ width: "26px", height: "26px" }}
              title="Edit Todo"
            >
              <Edit2 size={12} />
            </button>
            <button
              onClick={() => onDeleteTodo(todo)}
              className="btn-icon"
              style={{ width: "26px", height: "26px", color: "var(--status-overdue)" }}
              title="Hapus Todo"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-primary)" }}>{todo.title}</h4>
        {todo.description && (
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
            {todo.description}
          </p>
        )}

        {todo.dueDate && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              fontSize: "0.78rem",
              color: overdue ? "var(--status-overdue)" : "var(--text-muted)",
              marginTop: "0.2rem",
            }}
          >
            {overdue ? <AlertTriangle size={12} /> : <Calendar size={12} />}
            <span>
              {new Date(todo.dueDate).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              })}
            </span>
            {overdue && <span className="badge badge-overdue" style={{ fontSize: "0.65rem", padding: "0.1rem 0.35rem" }}>Overdue</span>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.85rem", marginBottom: "0.25rem" }}>Kanban Task Board</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>
            Tarik dan lepas (Drag & Drop) kartu untuk memperbarui status pekerjaan.
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenAddModal}>
          <Plus size={18} />
          <span>Tambah Todo</span>
        </button>
      </div>

      <div className="kanban-board">
        {/* Column Pending */}
        <div
          className="kanban-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "PENDING")}
          style={{ borderTop: "4px solid var(--status-pending)" }}
        >
          <div className="kanban-header">
            <div className="kanban-title">
              <Clock size={18} style={{ color: "var(--status-pending)" }} />
              <span>Pending</span>
            </div>
            <span className="kanban-count">{pendingTodos.length}</span>
          </div>

          <div className="kanban-list">
            {pendingTodos.map((todo) => renderCard(todo))}
            {pendingTodos.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Tidak ada tugas pending
              </div>
            )}
          </div>
        </div>

        {/* Column In Progress */}
        <div
          className="kanban-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "IN_PROGRESS")}
          style={{ borderTop: "4px solid var(--status-inprogress)" }}
        >
          <div className="kanban-header">
            <div className="kanban-title">
              <CircleDot size={18} style={{ color: "var(--status-inprogress)" }} />
              <span>In Progress</span>
            </div>
            <span className="kanban-count">{inProgressTodos.length}</span>
          </div>

          <div className="kanban-list">
            {inProgressTodos.map((todo) => renderCard(todo))}
            {inProgressTodos.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Tidak ada tugas berjalan
              </div>
            )}
          </div>
        </div>

        {/* Column Completed */}
        <div
          className="kanban-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "COMPLETED")}
          style={{ borderTop: "4px solid var(--status-completed)" }}
        >
          <div className="kanban-header">
            <div className="kanban-title">
              <CheckCircle2 size={18} style={{ color: "var(--status-completed)" }} />
              <span>Completed</span>
            </div>
            <span className="kanban-count">{completedTodos.length}</span>
          </div>

          <div className="kanban-list">
            {completedTodos.map((todo) => renderCard(todo))}
            {completedTodos.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Belum ada tugas yang selesai
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
