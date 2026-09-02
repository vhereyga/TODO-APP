import { Elysia } from "elysia";
import { TodoController } from "../controllers/todo.controller";

export const todoRoutes = new Elysia({ prefix: "/api" })
  .get("/todos", TodoController.getAll)
  .get("/todos/:id", TodoController.getById)
  .post("/todos", TodoController.create)
  .put("/todos/:id", TodoController.update)
  .patch("/todos/:id/status", TodoController.updateStatus)
  .delete("/todos/:id", TodoController.delete)
  .get("/dashboard", TodoController.getDashboard);
