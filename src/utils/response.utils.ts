import { Response } from "express"
import { get, values } from "lodash"
import httpCode from "./statusCode"

class CustomResponse {

	public _type: string
	public _message!: string;
	public _status!: number;
	public _additionalInfo!: any;
	public _content?: null | object | object[]

	constructor(type: string = "Error", message: string, status: number = 500, additionalInfo: any = {}) {

		this._type = type === "Error" ? "Error" : type
		this._message = message;
		this._status = status;
		this._additionalInfo = get(httpCode, String(this._status));
	}

	// Getter & Setter
	get type(): string {
		return this._type
	}

	set type(newType: string) {
		this._type = newType
	}

	get message(): string {
		return this._message
	}

	set message(newMessage: string) {
		this._message = newMessage
	}

	get status(): number {
		return this._status
	}

	set status(newStatus: number) {
		this._status = newStatus
	}

	get additionalInfo(): string {
		return this._additionalInfo
	}

	set additionalInfo(newAdditionalInfo: string) {
		this._additionalInfo = newAdditionalInfo
	}

	private async _response(response: Response) {
		return await response.status(this.status).send({
			"type": this._type,
			"message": this.message,
			"code": this._status,
			"additionalInfo": this._additionalInfo,
			"content": this._content
		})
	}

	public response(type: string, message: string, status: number, res: Response, additionalInfo?: any) {
		this._type = type
		this._message = message
		this._status = status
		this._additionalInfo = get(httpCode, String(status))

		if (additionalInfo && additionalInfo.todo) {
			this._content =  values(additionalInfo)
		} else if (this._content && !additionalInfo) {
			this._content = undefined
		} else {
			this._content = additionalInfo
		}

		this._response(res)
	}

}

export const singletonResponse = new CustomResponse("Initial", "Initial Message", 102)
