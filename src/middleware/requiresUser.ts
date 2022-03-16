import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { singletonResponse } from "../utils/response.utils"

const requiresUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = get(req, "user");

  if (!user) {
    return singletonResponse.response("RequestError", "No user credentials found", 400, res)
  }

  return next();
};

export default requiresUser;