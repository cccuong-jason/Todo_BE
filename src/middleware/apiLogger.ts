import { Request, Response, NextFunction } from "express"
import logger from "../logger"

const apiLogger = async (
	req: Request,
  	res: Response,
  	next: NextFunction
) => {
	const startHrTime = process.hrtime();
	logger.debug("Incomming request verbose", {
		headers: req.headers,
		query: req.query,
		body: req.body
	})

	res.on('finish', () => {
		const elapsedHrTime = process.hrtime(startHrTime);
    	const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
	    logger.info(`[${req.method} | ${req.url} | ${res.statusCode}] ${req.get("user-agent")} - Time: ${elapsedTimeInMs}ms`);
	});

	return next();
}

export default apiLogger