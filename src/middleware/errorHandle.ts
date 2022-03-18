import { Request, Response, NextFunction } from 'express';
import { get } from "lodash"
import { singletonResponse } from "../utils/response.utils"
import log from "../logger"

function handleError(error: TypeError | any, req: Request, res: Response, next: NextFunction) {

	log.error(error)
	
	const errorMessage = error.error || error.message ? (error.message || error.error) : "System error occured. We'll try to fix."
	const errorStatus = error.errorStatusCode ? error.errorStatusCode :500

	return singletonResponse.response("RequestError", errorMessage, errorStatus, res)

}

export default handleError