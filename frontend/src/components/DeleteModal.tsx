import React from "react";
import type { Todo } from "../types/todo";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  todo: Todo | null;
  loading: boolean;
}

export const DeleteModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  todo,
  loading,
}) => {
  if (!isOpen || !todo) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "460px" }}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--status-overdue)" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-md)",
                background: "var(--status-overdue-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AlertTriangle size={22} />
            </div>
            <h3>Hapus Todo?</h3>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Tutup">
            <X size={18} />
          </button>
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "1.25rem" }}>
          Apakah Anda yakin ingin menghapus tugas{" "}
          <strong style={{ color: "var(--text-primary)" }}>"{todo.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Batal
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            <Trash2 size={16} />
            <span>{loading ? "Menghapus..." : "Ya, Hapus"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
