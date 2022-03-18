import { AnySchema } from "yup";
import { Request, Response, NextFunction } from "express";
import { singletonResponse } from "../utils/response.utils"
import log from "../logger";

const validate = (schema: AnySchema) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error: Error) {

    log.error(error);
    return singletonResponse.response(error.name , error.message, 400, res)
  }
};

export default validate;