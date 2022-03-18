import { Request, Response, NextFunction } from "express"
import { get, omit, concat } from "lodash"
import { createUser, findUser, userInformationUpload } from "../service/user.service"
import { singletonResponse } from "../utils/response.utils"
import log from "../logger"

export async function createUserHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const user = await createUser(req.body)
		return singletonResponse.response("Successful", `Create [${user.name}] Successfully`, 201, res, { ...omit(user, "password") })

	} catch (error: any) {

		log.error(error)
		next({ error: error.message, statusCode: 409})
	}
}

export async function updateUserInformationHandler(req: Request, res: Response, next: NextFunction) {
	try {

		const userId = get(req, "user._doc._id")	
		const _id = get(req, "params.userId")
		
		const update = req.file !== undefined && req.file.fieldname === "avatar"  ? {avatar: `/media/users/${userId}/${req.file.filename}`, ...req.body} : {...req.body}

		const user: any = await findUser({ _id })

		if (!user) {
			return singletonResponse.response("Not found", `User [${_id}] Not Found`, 404, res)
		}	

		if (String(user._id) !== userId) {
			return singletonResponse.response("Unauthorized User", `User [${_id}] Not Match`, 401, res)
		}

		const updatedUser = await userInformationUpload({ _id }, update, {new: true})

		return singletonResponse.response("Update Sucessfull", `User [${_id}] updated successfully`, 200, res, { ...updatedUser })

	} catch (error: Error) {

		log.error(error)
		next({ error: error.message, statusCode: 400})
	}
}

export async function findUserHandler(req: Request, res: Response, next: NextFunction) {
	try {

		console.log("Here")

		const _id = get(req, "params.userId")
		const user = await findUser({ _id })

		if (!user) {
			return singletonResponse.response("Not found", `User [${_id}] Not Found`, 404, res)
		}

		return singletonResponse.response("Successfully", `Retrieve User [${_id}] Object`, 200, res, { ...user })

	} catch (error: Error) {

		log.error(error)
		next({ error: error.message , statusCode: 400})
	}		
}