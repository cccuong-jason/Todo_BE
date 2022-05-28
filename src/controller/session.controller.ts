import { Request, Response, NextFunction } from "express"
import { validatePassword,  } from "../service/user.service"
import { createSession, createAccessToken, updateSession, findSession } from "../service/session.service"
import { UserDocument } from "../model/user.model"
import { sign } from "../utils/jwt.utils"
import { get } from "lodash";
import { singletonResponse } from "../utils/response.utils"
import config from "config";
import log from "../logger"

const globalConfig: any = config.get("appConfig");

export async function createUserSessionHandler(req: Request, res: Response, next: NextFunction) {

	try {
	
		// Validate the email & password
		const user = await validatePassword(req.body)

		if (!user) {
			return singletonResponse.response("Not found", "Invalid username or password", 401, res)
		}

		// Create a session
		const session = await createSession(user._id, req.get("user-agent") || "")

		const accessToken = createAccessToken({ user, session })

		const refreshToken = sign(session, {
			expiresIn: globalConfig.parsed.RFTTTL as string// 1 year
		})

		return res.send({ "accessToken": accessToken, "refreshToken": refreshToken })

	} catch (error: Error) {

		log.error(error)
		next({ error: error.message, statusCode: 401})
	}
}

export async function invalidateUserSessionHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {

	try {
		const sessionId = get(req, "user.session");

	  await updateSession({ _id: sessionId }, { valid: false });

	  return res.sendStatus(200);		
	} catch (error: Error) {

		log.error(error)
		next({ error: error.message, statusCode: 401})
	}
  
}

export async function getUserSessionsHandler(req: Request, res: Response) {

	try {
		const userId = get(req, "user._doc._id");

	  const sessions = await findSession({ user: userId, valid: true });

	  return res.send(sessions);	

	} catch(error: Error) {

		log.error(error)
		next({ error: error.message, statusCode: 401})
	}
  
}

