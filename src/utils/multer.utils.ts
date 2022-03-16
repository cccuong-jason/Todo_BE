import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'
import dayjs from "dayjs"
import fs from "fs"
import path from "path"

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

export const fileStorage = multer.diskStorage({
    destination: (
        request: Request,
        file: Express.Multer.File,
        callback: DestinationCallback
    ): void => {

    	var __dir: string = process.cwd() + "/src/media/users/" + request.user._doc._id

    	if (!fs.existsSync(__dir)) {
    		fs.mkdirSync(__dir)	
    	}

        callback(null, process.cwd() + "/src/media/users/" + `${request.user._doc._id}`)
    },

    filename: (
        req: Request, 
        file: Express.Multer.File, 
        callback: FileNameCallback
    ): void => {
        callback(null, String(dayjs().format('DD_MM_YYYY')) + "_" + file.originalname)
    }
})

export const fileFilter = (
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
): void => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}