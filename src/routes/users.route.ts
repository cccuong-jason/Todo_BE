import { Router, IRouter } from "express"
import { createUserHandler, updateUserInformationHandler, findUserHandler } from "../controller/user.controller" 
import { createUserSessionHandler, invalidateUserSessionHandler, getUserSessionsHandler } from "../controller/session.controller" 
import { createUserSchema, createUserSessionSchema } from "../schema/user.schema"
import { validateRequest, requiresUser } from "../middleware"

export const usersRouter = (route: Router  = Router()) => {

	// Register User
	/* POST /api/users */
	route.post("/api/users", validateRequest(createUserSchema), createUserHandler)

	// Update User Information
	/* PATCH /api/users */
	route.patch("/api/users/:userId", requiresUser, findUserHandler)

	// User Get By Id
	/* GET /api/users/:todoId */
	route.get("/api/users/:userId", findUserHandler)

	return route

}
