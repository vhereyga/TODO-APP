import { describe, expect, test, beforeAll, afterAll } from "bun:test";
import { app } from "../../src/index";
import prisma from "../../src/lib/prisma";

describe("Integration Testing - Todo REST API (Bab XI & Bab XII SRS)", () => {
  let createdTodoId: number;

  beforeAll(async () => {
    // Bersihkan data testing jika perlu atau pastikan koneksi DB siap
    await prisma.$connect();
  });

  afterAll(async () => {
    // Bersihkan Todo yang dibuat selama test
    if (createdTodoId) {
      await prisma.todo.deleteMany({
        where: { id: createdTodoId },
      });
    }
    await prisma.$disconnect();
  });

  // Skenario 1: Create Todo Data Valid
  test("1. Create Todo (POST /api/todos) dengan data valid -> 201 Created", async () => {
    const payload = {
      title: "Membuat Unit Testing & Integration Testing",
      description: "Testing otomatis untuk validasi dan API",
      priority: "HIGH",
      dueDate: "2026-09-10T00:00:00.000Z",
    };

    const response = await app.handle(
      new Request("http://localhost:3000/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    );

    expect(response.status).toBe(201);
    const body = (await response.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();
    expect(body.data.title).toBe(payload.title);
    expect(body.data.priority).toBe("HIGH");
    expect(body.data.status).toBe("PENDING");

    createdTodoId = body.data.id;
    expect(typeof createdTodoId).toBe("number");
  });

  // Skenario 2: Create Todo Title Kosong
  test("2. Create Todo (POST /api/todos) dengan title kosong -> 400 Bad Request", async () => {
    const payload = {
      title: "",
      description: "Tanpa judul",
      priority: "MEDIUM",
    };

    const response = await app.handle(
      new Request("http://localhost:3000/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    );

    expect(response.status).toBe(400);
    const body = (await response.json()) as any;
    expect(body.success).toBe(false);
    expect(body.message).toContain("Title wajib diisi");
  });

  // Skenario 3: Get Todos
  test("3. Get All Todos (GET /api/todos) -> 200 OK & Array", async () => {
    const response = await app.handle(new Request("http://localhost:3000/api/todos"));

    expect(response.status).toBe(200);
    const body = (await response.json()) as any;
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  // Skenario 4: Get Todo ID Valid
  test("4. Get Todo By ID (GET /api/todos/:id) ID valid -> 200 OK", async () => {
    const response = await app.handle(new Request(`http://localhost:3000/api/todos/${createdTodoId}`));

    expect(response.status).toBe(200);
    const body = (await response.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.id).toBe(createdTodoId);
  });

  // Skenario 5: Get Todo ID Tidak Ada
  test("5. Get Todo By ID (GET /api/todos/999999) ID tidak ada -> 404 Not Found", async () => {
    const response = await app.handle(new Request("http://localhost:3000/api/todos/999999"));

    expect(response.status).toBe(404);
    const body = (await response.json()) as any;
    expect(body.success).toBe(false);
    expect(body.message).toContain("Todo tidak ditemukan");
  });

  // Skenario 6: Update Todo Data Valid
  test("6. Update Todo (PUT /api/todos/:id) data valid -> 200 OK & Data Berubah", async () => {
    const updatePayload = {
      title: "Membuat Unit dan Integration Testing Selesai",
      description: "Deskripsi diperbarui",
      status: "IN_PROGRESS",
      priority: "HIGH",
    };

    const response = await app.handle(
      new Request(`http://localhost:3000/api/todos/${createdTodoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      })
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.title).toBe(updatePayload.title);
    expect(body.data.status).toBe("IN_PROGRESS");
  });

  // Skenario 7: Update Status PATCH
  test("7. Update Status (PATCH /api/todos/:id/status) -> 200 OK & Status COMPLETED", async () => {
    const response = await app.handle(
      new Request(`http://localhost:3000/api/todos/${createdTodoId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      })
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.status).toBe("COMPLETED");
  });

  // Skenario 8: Status Validation INVALID
  test("8. Update Status dengan status INVALID -> 400 Bad Request", async () => {
    const response = await app.handle(
      new Request(`http://localhost:3000/api/todos/${createdTodoId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "NOT_VALID_STATUS" }),
      })
    );

    expect(response.status).toBe(400);
    const body = (await response.json()) as any;
    expect(body.success).toBe(false);
  });

  // Skenario 9: Priority Validation INVALID
  test("9. Create/Update dengan Priority INVALID -> 400 Bad Request", async () => {
    const response = await app.handle(
      new Request("http://localhost:3000/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Priority Invalid Test",
          priority: "CRITICAL_INVALID",
        }),
      })
    );

    expect(response.status).toBe(400);
    const body = (await response.json()) as any;
    expect(body.success).toBe(false);
  });

  // Skenario 10: Dashboard Statistics
  test("10. Dashboard Stats (GET /api/dashboard) -> 200 OK & Statistik sesuai", async () => {
    const response = await app.handle(new Request("http://localhost:3000/api/dashboard"));

    expect(response.status).toBe(200);
    const body = (await response.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();
    expect(typeof body.data.total).toBe("number");
    expect(typeof body.data.pending).toBe("number");
    expect(typeof body.data.inProgress).toBe("number");
    expect(typeof body.data.completed).toBe("number");
  });

  // Skenario 11: Delete Todo
  test("11. Delete Todo (DELETE /api/todos/:id) ID valid -> 200 OK & Terhapus", async () => {
    const response = await app.handle(
      new Request(`http://localhost:3000/api/todos/${createdTodoId}`, {
        method: "DELETE",
      })
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as any;
    expect(body.success).toBe(true);
    expect(body.message).toContain("Todo berhasil dihapus");

    // Pastikan sekarang 404
    const checkRes = await app.handle(new Request(`http://localhost:3000/api/todos/${createdTodoId}`));
    expect(checkRes.status).toBe(404);
  });
});
