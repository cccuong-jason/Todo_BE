const configuration = require('dotenv').config({path: __dirname + '/env/dev.env', override: true})
export default {
	appConfig: configuration,
}