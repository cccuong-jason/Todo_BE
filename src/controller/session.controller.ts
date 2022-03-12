import { Request, Response } from "express"
import { validatePassword,  } from "../service/user.service"
import { createSession, createAccessToken, updateSession, findSession } from "../service/session.service"
import { UserDocument } from "../model/user.model"
import { sign } from "../utils/jwt.utils"
import { get } from "lodash";
import config from "config";

const globalConfig: any = config.get("appConfig");

export async function createUserSessionHandler(req: Request, res: Response) {

	// Validate the email & password
	const user = await validatePassword(req.body)

	if (!user) {
		return res.status(401).send("Invalid username or password")
	}

	// Create a session
	const session = await createSession(user._id, req.get("user-agent") || "")

	const accessToken = createAccessToken({ user, session })

	const refreshToken = sign(session, {
		expiresIn: globalConfig.parsed.RFTTTL as string// 1 year
	})

	return res.send({ "accessToken": accessToken, "refreshToken": refreshToken })
}

export async function invalidateUserSessionHandler(
  req: Request,
  res: Response
) {
  const sessionId = get(req, "user.session");

  await updateSession({ _id: sessionId }, { valid: false });

  return res.sendStatus(200);
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = get(req, "user._id");

  const sessions = await findSession({ user: userId, valid: true });

  return res.send(sessions);
}

