import mongoose from "mongoose"
import { ConnectOptions } from "mongoose"
import config from "config";
import log from '../logger';

const globalConfig: any = config.get("appConfig");

function connect() {
	const dbUri = globalConfig.parsed.DBURI as string;
  console.log(dbUri)

	return mongoose
    .connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as ConnectOptions)
    .then(() => {
      log.info("Database connected");
    })
    .catch((error) => {
      log.error("Database connection error", error);
      process.exit(1);
    });
}

export default connect