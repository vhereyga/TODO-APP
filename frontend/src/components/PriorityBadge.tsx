import React from "react";
import type { Priority } from "../types/todo";
import { AlertCircle, ArrowUpCircle, MinusCircle } from "lucide-react";

interface Props {
  priority: Priority | string;
}

export const PriorityBadge: React.FC<Props> = ({ priority }) => {
  const upper = (priority || "").toUpperCase();

  switch (upper) {
    case "HIGH":
      return (
        <span className="badge badge-priority-high">
          <AlertCircle size={13} />
          High
        </span>
      );
    case "MEDIUM":
      return (
        <span className="badge badge-priority-med">
          <ArrowUpCircle size={13} />
          Medium
        </span>
      );
    case "LOW":
    default:
      return (
        <span className="badge badge-priority-low">
          <MinusCircle size={13} />
          Low
        </span>
      );
  }
};
