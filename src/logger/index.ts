import logger from "pino"
import dayjs from "dayjs"

const log = logger({
	transport: {
    target: 'pino-pretty',
    options: {
      translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
      colorize: true,
      ignore: "pid,hostname",
    }
  	}

})

export default log;