import React, { useState, useEffect } from "react";
import type { Todo, TodoFormData, TodoStatus, Priority } from "../types/todo";
import { X, Calendar, AlignLeft, Flag, CheckCircle2, Type } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TodoFormData) => Promise<void>;
  initialData?: Todo | null;
  mode: "create" | "edit";
}

export const TodoModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TodoStatus>("PENDING");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData && mode === "edit") {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setStatus(initialData.status || "PENDING");
      setPriority(initialData.priority || "MEDIUM");
      if (initialData.dueDate) {
        // Format YYYY-MM-DD
        const d = new Date(initialData.dueDate);
        const iso = d.toISOString().split("T")[0];
        setDueDate(iso);
      } else {
        setDueDate("");
      }
    } else {
      setTitle("");
      setDescription("");
      setStatus("PENDING");
      setPriority("MEDIUM");
      setDueDate("");
    }
    setError(null);
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Judul Todo (title) wajib diisi");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan Todo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{mode === "create" ? "Tambah Todo Baru" : "Edit Todo"}</h3>
          <button className="btn-icon" onClick={onClose} aria-label="Tutup">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "var(--status-overdue-bg)",
              color: "var(--status-overdue)",
              borderRadius: "var(--radius-md)",
              marginBottom: "1.25rem",
              fontSize: "0.88rem",
              fontWeight: "600",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="todo-title" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Type size={16} />
              <span>Judul Todo <span style={{ color: "var(--status-overdue)" }}>*</span></span>
            </label>
            <input
              id="todo-title"
              type="text"
              className="form-control"
              placeholder="Contoh: Membuat Unit Testing"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="todo-desc" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <AlignLeft size={16} />
              <span>Deskripsi (Opsional)</span>
            </label>
            <textarea
              id="todo-desc"
              className="form-control"
              placeholder="Jelaskan rincian aktivitas atau catatan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label htmlFor="todo-priority" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Flag size={16} />
                <span>Prioritas</span>
              </label>
              <select
                id="todo-priority"
                className="form-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium (Default)</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="todo-status" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <CheckCircle2 size={16} />
                <span>Status</span>
              </label>
              <select
                id="todo-status"
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value as TodoStatus)}
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="todo-due" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Calendar size={16} />
              <span>Batas Waktu / Due Date (Opsional)</span>
            </label>
            <input
              id="todo-due"
              type="date"
              className="form-control"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Menyimpan..." : mode === "create" ? "Simpan Todo" : "Perbarui Todo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
