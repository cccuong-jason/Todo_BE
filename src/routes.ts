import { Router, Express, Request, Response } from 'express'
import { RUsers, RSessions, RTodos } from "./routes/"
 
export default function(app: Express) {

	const route = Router()
	app.get("/healthcheck", (req: Request, res: Response) => res.status(200).send("Todo App is working fine..."))

	app.use(RUsers)
	app.use(RSessions)
	app.use(RTodos)

}