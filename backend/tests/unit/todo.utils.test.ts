import { describe, expect, test } from "bun:test";
import { isOverdue, calculateDashboardStats, formatApiResponse, formatApiError } from "../../src/utils/todo.utils";

describe("Todo Utilities & Business Logic (Bab 10.4 SRS)", () => {
  describe("isOverdue() logic", () => {
    const now = new Date("2026-09-02T12:00:00.000Z");

    test("Todo dengan dueDate kemarin dan status PENDING -> overdue (true)", () => {
      const yesterday = new Date("2026-09-01T12:00:00.000Z");
      expect(isOverdue(yesterday, "PENDING", now)).toBe(true);
    });

    test("Todo dengan dueDate kemarin dan status IN_PROGRESS -> overdue (true)", () => {
      const yesterday = new Date("2026-09-01T12:00:00.000Z");
      expect(isOverdue(yesterday, "IN_PROGRESS", now)).toBe(true);
    });

    test("Todo dengan dueDate kemarin tapi status COMPLETED -> tidak overdue (false)", () => {
      const yesterday = new Date("2026-09-01T12:00:00.000Z");
      expect(isOverdue(yesterday, "COMPLETED", now)).toBe(false);
    });

    test("Todo dengan dueDate besok dan status PENDING -> tidak overdue (false)", () => {
      const tomorrow = new Date("2026-09-03T12:00:00.000Z");
      expect(isOverdue(tomorrow, "PENDING", now)).toBe(false);
    });

    test("Todo tanpa dueDate -> tidak overdue (false)", () => {
      expect(isOverdue(null, "PENDING", now)).toBe(false);
      expect(isOverdue(undefined, "PENDING", now)).toBe(false);
    });
  });

  describe("calculateDashboardStats()", () => {
    const refDate = new Date("2026-09-02T12:00:00.000Z");
    const mockTodos = [
      { id: 1, title: "T1", status: "PENDING", priority: "HIGH", dueDate: "2026-09-01T00:00:00Z" }, // Overdue
      { id: 2, title: "T2", status: "PENDING", priority: "MEDIUM", dueDate: "2026-09-10T00:00:00Z" },
      { id: 3, title: "T3", status: "IN_PROGRESS", priority: "LOW", dueDate: null },
      { id: 4, title: "T4", status: "COMPLETED", priority: "HIGH", dueDate: "2026-09-01T00:00:00Z" }, // Completed, not counted as overdue
    ];

    test("menghitung total, pending, inProgress, completed, overdue, completionRate dengan tepat", () => {
      const stats = calculateDashboardStats(mockTodos, refDate);
      expect(stats.total).toBe(4);
      expect(stats.pending).toBe(2);
      expect(stats.inProgress).toBe(1);
      expect(stats.completed).toBe(1);
      expect(stats.overdue).toBe(1);
      expect(stats.completionRate).toBe(25);
    });
  });

  describe("API Response Formatting", () => {
    test("formatApiResponse menghasilkan response format standar", () => {
      const res = formatApiResponse({ id: 1, title: "Test" });
      expect(res).toEqual({
        success: true,
        data: { id: 1, title: "Test" },
      });
    });

    test("formatApiError menghasilkan error format standar", () => {
      const res = formatApiError("Terjadi kesalahan");
      expect(res).toEqual({
        success: false,
        message: "Terjadi kesalahan",
      });
    });
  });
});
