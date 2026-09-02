import React from "react";
import type { DashboardStats, Todo, TodoStatus } from "../types/todo";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";
import {
  ListTodo,
  Clock,
  CircleDot,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Calendar,
  Sparkles,
} from "lucide-react";

interface Props {
  stats: DashboardStats | null;
  loading: boolean;
  onOpenAddModal: () => void;
  onNavigateToTodos: (filterStatus?: string) => void;
  onEditTodo: (todo: Todo) => void;
  onQuickUpdateStatus: (todoId: number, nextStatus: TodoStatus) => void;
}

export const DashboardPage: React.FC<Props> = ({
  stats,
  loading,
  onOpenAddModal,
  onNavigateToTodos,
  onEditTodo,
  onQuickUpdateStatus,
}) => {
  const total = stats?.total || 0;
  const pending = stats?.pending || 0;
  const inProgress = stats?.inProgress || 0;
  const completed = stats?.completed || 0;
  const overdue = stats?.overdue || 0;
  const recent = stats?.recent || [];

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      {/* Hero Welcome Banner */}
      <div
        className="glass-card"
        style={{
          marginBottom: "2rem",
          background: "linear-gradient(135deg, rgba(79, 70, 229, 0.12) 0%, rgba(6, 182, 212, 0.1) 100%)",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                fontSize: "0.8rem",
                fontWeight: "700",
                color: "var(--primary)",
                background: "var(--primary-light)",
                padding: "0.2rem 0.6rem",
                borderRadius: "var(--radius-full)",
              }}
            >
              <Sparkles size={12} />
              Full-Stack Todo Dashboard
            </span>
          </div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>Selamat Datang di TaskMaster!</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "600px" }}>
            Kelola tugas Anda secara efisien, pantau progress harian, dan selesaikan target tepat waktu.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn btn-secondary" onClick={() => onNavigateToTodos()}>
            <span>Lihat Semua Tugas</span>
            <ArrowRight size={16} />
          </button>
          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <Plus size={18} />
            <span>Tambah Todo</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Row (Bab 3.1 & 8.1 SRS) */}
      <div className="stats-grid">
        <StatCard
          title="Total Todo"
          value={total}
          icon={<ListTodo size={24} />}
          gradient="linear-gradient(135deg, #6366f1, #4f46e5)"
          subtitle="Semua tugas terdaftar"
          onClick={() => onNavigateToTodos("ALL")}
        />
        <StatCard
          title="Pending"
          value={pending}
          icon={<Clock size={24} />}
          gradient="linear-gradient(135deg, #f59e0b, #d97706)"
          subtitle="Menunggu dikerjakan"
          onClick={() => onNavigateToTodos("PENDING")}
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={<CircleDot size={24} />}
          gradient="linear-gradient(135deg, #3b82f6, #2563eb)"
          subtitle="Sedang berjalan"
          onClick={() => onNavigateToTodos("IN_PROGRESS")}
        />
        <StatCard
          title="Done (Completed)"
          value={completed}
          icon={<CheckCircle2 size={24} />}
          gradient="linear-gradient(135deg, #10b981, #059669)"
          subtitle="Berhasil diselesaikan"
          onClick={() => onNavigateToTodos("COMPLETED")}
        />
        {overdue > 0 && (
          <StatCard
            title="Overdue"
            value={overdue}
            icon={<AlertTriangle size={24} />}
            gradient="linear-gradient(135deg, #ef4444, #dc2626)"
            subtitle="Melewati batas deadline"
          />
        )}
      </div>

      {/* Progress Metric & Recent Todos Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {/* Progress Card */}
        <div className="glass-card">
          <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Progress Penyelesaian</h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Tingkat Selesai</span>
            <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--primary)" }}>{completionRate}%</span>
          </div>

          <div
            style={{
              height: "12px",
              background: "var(--bg-subtle)",
              borderRadius: "var(--radius-full)",
              overflow: "hidden",
              marginBottom: "1.5rem",
              border: "1px solid var(--border-color)",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${completionRate}%`,
                background: "linear-gradient(90deg, var(--primary), var(--secondary))",
                borderRadius: "var(--radius-full)",
                transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div
              style={{
                padding: "0.75rem",
                background: "var(--bg-subtle)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Selesai / Total</div>
              <div style={{ fontSize: "1.1rem", fontWeight: "700" }}>{completed} / {total}</div>
            </div>
            <div
              style={{
                padding: "0.75rem",
                background: "var(--bg-subtle)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Belum Selesai</div>
              <div style={{ fontSize: "1.1rem", fontWeight: "700" }}>{pending + inProgress}</div>
            </div>
          </div>
        </div>

        {/* Recent Todos (Bab 8.1 SRS: Recent Todos) */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.2rem" }}>Recent Todos (Tugas Terbaru)</h3>
            <button
              onClick={() => onNavigateToTodos()}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                fontSize: "0.88rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <span>Semua</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {loading ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Memuat statistik data...</p>
          ) : recent.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
              <ListTodo size={36} style={{ margin: "0 auto 0.5rem", opacity: 0.4 }} />
              <p>Belum ada Todo yang dibuat.</p>
              <button
                className="btn btn-primary"
                style={{ marginTop: "1rem", fontSize: "0.85rem" }}
                onClick={onOpenAddModal}
              >
                Buat Todo Pertama
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
              {recent.map((todo) => (
                <div
                  key={todo.id}
                  style={{
                    padding: "0.85rem 1rem",
                    background: "var(--bg-subtle)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    transition: "var(--transition)",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h5
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "var(--text-primary)",
                      }}
                    >
                      {todo.title}
                    </h5>
                    {todo.dueDate && (
                      <span
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--text-muted)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          marginTop: "0.2rem",
                        }}
                      >
                        <Calendar size={12} />
                        {new Date(todo.dueDate).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                    <PriorityBadge priority={todo.priority} />
                    <StatusBadge status={todo.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
