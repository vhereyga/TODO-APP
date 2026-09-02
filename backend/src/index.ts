import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { todoRoutes } from "./routes/todo.route";

export const app = new Elysia()
  .use(
    cors({
      origin: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .onError(({ code, error, set }) => {
    console.error(`[Error] ${code}:`, error);
    if (code === "NOT_FOUND") {
      set.status = 404;
      return { success: false, message: "Endpoint tidak ditemukan" };
    }
    if (code === "VALIDATION") {
      set.status = 400;
      return { success: false, message: "Validasi request gagal", error: error.message };
    }
    set.status = 500;
    return { success: false, message: "Terjadi kesalahan pada server" };
  })
  .get("/", () => ({
    success: true,
    message: "Todo App Backend API (Bun + Elysia.js + Prisma + PostgreSQL)",
    docs: "/api/todos",
  }))
  .get("/api", () => ({
    success: true,
    message: "Todo App API Base Endpoint",
    endpoints: [
      "GET /api/todos",
      "GET /api/todos/:id",
      "POST /api/todos",
      "PUT /api/todos/:id",
      "PATCH /api/todos/:id/status",
      "DELETE /api/todos/:id",
      "GET /api/dashboard",
    ],
  }))
  .use(todoRoutes);

const PORT = Number(process.env.PORT) || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Todo App Backend is running at http://localhost:${PORT}`);
    console.log(`📊 API Endpoints available at http://localhost:${PORT}/api`);
  });
}

export default app;
