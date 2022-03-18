import { Router } from "express" 
import { createTodoHandler, findTodoHandler, findAndUpdateHandler, deleteTodoHandler, findAllTodoHandler } from "../controller/todo.controller" 
import { createTodoSchema } from "../schema/todo.schema"
import { validateRequest, requiresUser } from "../middleware"

export const todosRouter = (route: Router = Router()) => {

	// Todo Create 
	/* POST /api/todos */
	route.post("/api/todos", [requiresUser, validateRequest(createTodoSchema)], createTodoHandler)	

	// Todo Get All
	/* GET /api/todos */
	route.get("/api/todos", findAllTodoHandler)

	// Todo Get By Id
	/* GET /api/todos/:todoId */
	route.get("/api/todos/:todoId", findTodoHandler)	

	// Todo Update
	/* PATCH /api/todos/:todoId */
	route.patch("/api/todos/:todoId", requiresUser, findAndUpdateHandler)

	// Todo Delete
	/* DEL /api/todos/:todoId */
	route.delete("/api/todos/:todoId", requiresUser, deleteTodoHandler)

	return route
}
