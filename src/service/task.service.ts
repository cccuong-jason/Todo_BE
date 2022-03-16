import { DocumentDefinition, FilterQuery } from "mongoose" 
import { omit } from "lodash"
import Task, { ITask } from "../model/task.model"
import Todo, { ITodo } from "../model/todo.model"
import log from '../logger';

export async function createTask(todoId: DocumentDefinition<ITodo>, task: DocumentDefinition<ITask>) {
	try { 

		let OTask: DocumentDefinition<ITask> = await Task.create(task)

		return await Todo.findByIdAndUpdate(
			todoId,
			{
				$push: {taskList: OTask._id}
			},
			{
				new: true, useFindAndModify: true
			}
		) as DocumentDefinition<ITodo>

	} catch (error: any) {
		throw new Error(error)
	}
}