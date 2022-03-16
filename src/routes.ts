import { Express, Request, Response } from 'express'
import { createUserHandler, updateUserInformationHandler } from "./controller/user.controller" 
import { createTodoHandler, findTodoHandler, findAndUpdateHandler, deleteTodoHandler, findAllTodoHandler } from "./controller/todo.controller" 
import { createUserSessionHandler, invalidateUserSessionHandler, getUserSessionsHandler } from "./controller/session.controller" 
import { createUserSchema, createUserSessionSchema } from "./schema/user.schema"
import { createTodoSchema } from "./schema/todo.schema"
import { validateRequest, requiresUser } from "./middleware"
 
export default function(app: Express) {
	app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200))

	// Register User
	/* POST /api/users */
	app.post("/api/users", validateRequest(createUserSchema), createUserHandler)

	// Update User Information
	/* PATCH /api/users */
	app.patch("/api/users/:userId", requiresUser, updateUserInformationHandler)

	// Login
	/* POST /api/sessions */
	app.post("/api/sessions", validateRequest(createUserSessionSchema), createUserSessionHandler)

	// Get the user's Session
	/* GET /api/session */
	app.get("/api/sessions", requiresUser, getUserSessionsHandler);

	// Logout
	/* DELTE /api/session */
	app.delete("/api/sessions", requiresUser, invalidateUserSessionHandler)

	// Todo Create 
	/* POST /api/todos */
	app.post("/api/todos", [requiresUser, validateRequest(createTodoSchema)], createTodoHandler)	

	// Todo Get All
	/* GET /api/todos */
	app.get("/api/todos", findAllTodoHandler)

	// Todo Get By Id
	/* GET /api/todos/:todoId */
	app.get("/api/todos/:todoId", findTodoHandler)	

	// Todo Update
	/* PUT /api/todos/:todoId */
	app.put("/api/todos/:todoId", [requiresUser, validateRequest(createTodoSchema)], findAndUpdateHandler)

	// Todo Delet
	/* DEL /api/todos/:todoId */
	app.delete("/api/todos/:todoId", requiresUser, deleteTodoHandler)
}