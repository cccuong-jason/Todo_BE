import { Express, Request, Response } from 'express'
import { createUserHandler } from "./controller/user.controller" 
import { createUserSessionHandler, invalidateUserSessionHandler, getUserSessionsHandler } from "./controller/session.controller" 
import { createUserSchema, createUserSessionSchema } from "./schema/user.schema"
import { validateRequest, requiresUser } from "./middleware"
 
export default function(app: Express) {
	app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200))

	// Register User
	/* POST /api/user */
	app.post("/api/users", validateRequest(createUserSchema), createUserHandler)

	// Login
	/* POST /api/sessions */
	app.post("/api/sessions", validateRequest(createUserSessionSchema), createUserSessionHandler)

	// Get the user's Session
	/* GET /api/session */

	// Logout
	/* DELTE /api/session */
	app.delete("/api/session", requiresUser, invalidateUserSessionHandler)
}