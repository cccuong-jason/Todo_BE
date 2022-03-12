import express from 'express';
import config from "config";
import log from './logger';
import connect from "./db/connect"
import routes from "./routes"
import { deserializeUser } from "./middleware"

const globalConfig: any = config.get("appConfig");
const port: number = parseInt(globalConfig.parsed.PORT)
const host: string = globalConfig.parsed.HOST

const app = express()

app.use(deserializeUser)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, host, () => {
	log.info(`Service listening on ${host}:${port}`);

	connect()

	routes(app)
})
