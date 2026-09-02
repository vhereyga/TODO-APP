import React from "react";
import { LayoutDashboard, CheckSquare, Kanban, Plus, Sun, Moon, Sparkles } from "lucide-react";

interface Props {
  activeTab: "dashboard" | "todos" | "kanban";
  setActiveTab: (tab: "dashboard" | "todos" | "kanban") => void;
  onOpenAddModal: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  theme,
  toggleTheme,
}) => {
  return (
    <header className="navbar">
      <div className="nav-brand" style={{ cursor: "pointer" }} onClick={() => setActiveTab("dashboard")}>
        <div className="brand-icon">
          <Sparkles size={22} />
        </div>
        <span>TaskMaster Pro</span>
      </div>

      <nav className="nav-links">
        <button
          className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>
        <button
          className={`nav-btn ${activeTab === "todos" ? "active" : ""}`}
          onClick={() => setActiveTab("todos")}
        >
          <CheckSquare size={18} />
          <span>All Tasks</span>
        </button>
        <button
          className={`nav-btn ${activeTab === "kanban" ? "active" : ""}`}
          onClick={() => setActiveTab("kanban")}
        >
          <Kanban size={18} />
          <span>Kanban Board</span>
        </button>
      </nav>

      <div className="nav-actions">
        <button
          className="btn-icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
          aria-label="Toggle Theme"
        >
          {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
        </button>

        <button className="btn btn-primary" onClick={onOpenAddModal}>
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};
