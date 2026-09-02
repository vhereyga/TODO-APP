import React from "react";
import type { TodoStatus } from "../types/todo";
import { CheckCircle2, Clock, CircleDot } from "lucide-react";

interface Props {
  status: TodoStatus | string;
}

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const upper = (status || "").toUpperCase();

  switch (upper) {
    case "COMPLETED":
      return (
        <span className="badge badge-completed">
          <CheckCircle2 size={13} />
          Completed
        </span>
      );
    case "IN_PROGRESS":
      return (
        <span className="badge badge-inprogress">
          <CircleDot size={13} />
          In Progress
        </span>
      );
    case "PENDING":
    default:
      return (
        <span className="badge badge-pending">
          <Clock size={13} />
          Pending
        </span>
      );
  }
};
