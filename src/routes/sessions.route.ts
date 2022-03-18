import { Router } from "express"
import { validateRequest, requiresUser } from "../middleware"
import { createUserSessionHandler, invalidateUserSessionHandler, getUserSessionsHandler } from "../controller/session.controller" 
import { createUserSessionSchema } from "../schema/user.schema"

export const sessionsRouter = (route: Router = Router()) => {

	// Login
	/* POST /api/sessions */
	route.post("/api/sessions", validateRequest(createUserSessionSchema), createUserSessionHandler)

	// Get the user's Session
	/* GET /api/session */
	route.get("/api/sessions", requiresUser, getUserSessionsHandler);

	// Logout
	/* DELTE /api/session */
	route.delete("/api/sessions", requiresUser, invalidateUserSessionHandler)

	return route
}
