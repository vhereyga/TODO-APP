import React from "react";

interface Props {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  subtitle?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<Props> = ({ title, value, icon, gradient, subtitle, onClick }) => {
  return (
    <div
      className="stat-card"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="stat-info">
        <h4>{title}</h4>
        <div className="stat-value">{value}</div>
        {subtitle && (
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.4rem", display: "block" }}>
            {subtitle}
          </span>
        )}
      </div>
      <div className="stat-icon-wrapper" style={{ background: gradient }}>
        {icon}
      </div>
    </div>
  );
};
