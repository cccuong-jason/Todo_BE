import { UserDocument } from "./user.model"
import { ITask } from "./task.model"
import mongoose from "mongoose"
import paginate, { PaginateModel } from "mongoose-paginate-v2"

export interface ITodo extends mongoose.Document {
	user: UserDocument["_id"],
	name: string,
	description: string,
	status: boolean,
	createdAt: Date,
	updatedAt: Date,
	tags: Array<string>,
	startDate: Date,
	endDate: Date,
	taskList: ITask["_id"][],
}

const ITodoSchema = new mongoose.Schema<ITodo>({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
	name: { type: String, trim: true, required: true, unique: true, dropDups: true, index: true},
	description: { type: String},
	status: { type: Boolean, default:false },
	tags: { type: [String] },
	startDate: { type: Date },
	endDate: { type: Date },
	taskList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task"}]

}, {
	timestamps: true,
	toJSON: {
		virtuals: true
	}
})

ITodoSchema.plugin(paginate)
ITodoSchema.index({'$**': 'text'});

const Todo = mongoose.model<ITodo, PaginationModel<ITodo>>("Todo", ITodoSchema)

Todo.createIndexes()

export default Todo