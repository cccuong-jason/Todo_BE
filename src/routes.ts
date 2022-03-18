import { Router, Express, Request, Response } from 'express'
import { RUsers, RSessions, RTodos } from "./routes/"
 
export default function(app: Express) {

	const route = Router()
	app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200))

	app.use(RUsers)
	app.use(RSessions)
	app.use(RTodos)

}