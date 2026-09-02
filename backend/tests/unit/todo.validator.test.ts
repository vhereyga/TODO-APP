import { describe, expect, test } from "bun:test";
import { validateTodo, validateUpdateStatus, validateId } from "../../src/validators/todo.validator";

describe("Todo Validation (Bab X SRS)", () => {
  describe("10.1 & 10.2 Validasi Title", () => {
    test("title kosong harus gagal", () => {
      const result = validateTodo({ title: "", priority: "MEDIUM" });
      expect(result.valid).toBe(false);
      expect(result.message).toContain("Title wajib diisi");
    });

    test("title hanya spasi harus gagal", () => {
      const result = validateTodo({ title: "   ", priority: "LOW" });
      expect(result.valid).toBe(false);
    });

    test("title undefined harus gagal", () => {
      const result = validateTodo({ priority: "MEDIUM" });
      expect(result.valid).toBe(false);
    });

    test("title valid harus berhasil", () => {
      const result = validateTodo({ title: "Belajar Bun", priority: "HIGH" });
      expect(result.valid).toBe(true);
    });
  });

  describe("10.3 Validasi Priority", () => {
    test("Priority LOW -> valid", () => {
      const result = validateTodo({ title: "Task 1", priority: "LOW" });
      expect(result.valid).toBe(true);
    });

    test("Priority MEDIUM -> valid", () => {
      const result = validateTodo({ title: "Task 2", priority: "MEDIUM" });
      expect(result.valid).toBe(true);
    });

    test("Priority HIGH -> valid", () => {
      const result = validateTodo({ title: "Task 3", priority: "HIGH" });
      expect(result.valid).toBe(true);
    });

    test("Priority URGENT -> tidak valid", () => {
      const result = validateTodo({ title: "Task 4", priority: "URGENT" });
      expect(result.valid).toBe(false);
      expect(result.message).toContain("Priority tidak valid");
    });

    test("Priority INVALID_STRING -> tidak valid", () => {
      const result = validateTodo({ title: "Task 5", priority: "SUPER_HIGH" });
      expect(result.valid).toBe(false);
    });
  });

  describe("Validasi Status", () => {
    test("Status PENDING, IN_PROGRESS, COMPLETED -> valid", () => {
      expect(validateTodo({ title: "T1", status: "PENDING" }).valid).toBe(true);
      expect(validateTodo({ title: "T2", status: "IN_PROGRESS" }).valid).toBe(true);
      expect(validateTodo({ title: "T3", status: "COMPLETED" }).valid).toBe(true);
    });

    test("Status INVALID -> tidak valid", () => {
      const result = validateTodo({ title: "T4", status: "DONE_ALREADY" });
      expect(result.valid).toBe(false);
      expect(result.message).toContain("Status tidak valid");
    });

    test("validateUpdateStatus valid", () => {
      expect(validateUpdateStatus("COMPLETED").valid).toBe(true);
      expect(validateUpdateStatus("IN_PROGRESS").valid).toBe(true);
      expect(validateUpdateStatus("PENDING").valid).toBe(true);
    });

    test("validateUpdateStatus invalid", () => {
      expect(validateUpdateStatus("ARCHIVED").valid).toBe(false);
      expect(validateUpdateStatus("").valid).toBe(false);
    });
  });

  describe("Validasi ID", () => {
    test("ID positif valid", () => {
      expect(validateId("1").valid).toBe(true);
      expect(validateId("42").valid).toBe(true);
      expect(validateId(10).valid).toBe(true);
    });

    test("ID tidak valid (bukan angka / negatif / non-integer)", () => {
      expect(validateId("abc").valid).toBe(false);
      expect(validateId("-5").valid).toBe(false);
      expect(validateId("0").valid).toBe(false);
      expect(validateId("1.5").valid).toBe(false);
    });
  });
});
