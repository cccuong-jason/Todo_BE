import { UserDocument } from "./user.model"
import { ITodo } from "./todo.model"
import mongoose from "mongoose"

export interface ITask extends mongoose.Document {
	todoObject: ITodo["_id"],
	name: string,
	description: string,
	status: boolean,
}

const ITaskSchema = new mongoose.Schema<ITask>({
	todoObject: { type: mongoose.Schema.Types.ObjectId, ref: "Todo"},
	name: { type: String, trim: true, required: true},
	description: { type: String},
	status: { type: Boolean, default:false }
})

const Task = mongoose.model<ITask>("Task", ITaskSchema)

export default Task