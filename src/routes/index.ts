import { Router } from "express"
import { usersRouter } from "./users.route"
import { sessionsRouter } from "./sessions.route"
import { todosRouter } from "./todos.route"

const router: Router = Router()

export const RUsers = usersRouter(router) 
export const RSessions = sessionsRouter(router) 
export const RTodos = todosRouter(router)