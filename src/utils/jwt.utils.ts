import jwt from "jsonwebtoken"
import config from "config";

const globalConfig: any = config.get("appConfig");
const privateKey: string = globalConfig.parsed.PKEY

export function sign(object: Object, options?: jwt.SignOptions | undefined) {
	return jwt.sign(object, privateKey, options)
}

export function decode(token: string) {
  try {
    const decoded = jwt.verify(token, privateKey);

    return { valid: true, expired: false, decoded };
  } catch (error: Error) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
}
