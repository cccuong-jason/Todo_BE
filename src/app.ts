import express from 'express';
import config from "config";
import cors from 'cors';
import compression from 'compression'
import helmet from 'helmet';
import logger from './logger';
import connect from "./db/connect"
import routes from "./routes"
import multer from "multer"
import path from "path"
import { fileStorage, fileFilter } from "./utils/multer.utils"
import { deserializeUser, errorHandler, apiLogger } from "./middleware"

const globalConfig: any = config.get("appConfig");
const port: number = parseInt(globalConfig.parsed.PORT)
const host: string = globalConfig.parsed.HOST

const app = express()

const media = multer({
	storage: fileStorage, 
	fileFilter: fileFilter
})

app.use(apiLogger)

app.use(compression());

app.use(helmet());

app.use(deserializeUser)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(media.single('avatar'))

app.use('/media', express.static(path.join(__dirname, 'media')))

app.use(cors());

app.disable('etag');

app.listen(port, host, () => {
	logger.info(`Todo BE listening on ${host}:${port}`);

	connect()

	routes(app)
	
	app.use(errorHandler)

})

process.env.TZ = 'Asia/Ho_Chi_Minh'