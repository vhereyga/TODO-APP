import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface Props {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<Props> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let iconColor = "var(--status-completed)";

        if (toast.type === "error") {
          Icon = AlertCircle;
          iconColor = "var(--status-overdue)";
        } else if (toast.type === "info") {
          Icon = Info;
          iconColor = "var(--status-inprogress)";
        }

        return (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <Icon size={20} style={{ color: iconColor, flexShrink: 0 }} />
            <span style={{ fontSize: "0.92rem", fontWeight: "500", flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                padding: "2px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
