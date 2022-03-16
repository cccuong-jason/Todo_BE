import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose"
import Todo, { ITodo } from "../model/todo.model"
import { ITask } from "../model/task.model"
import { createTask } from "./task.service"
import log from '../logger';
import { omit } from "lodash"

export async function createTodo(todo: DocumentDefinition<ITodo>, task: Array<DocumentDefinition<ITask>>) {
	try {

		let OTodo: DocumentDefinition<ITodo> = await Todo.create(omit(todo, "taskList"))

		task.forEach(async (element) => {
			OTodo = await createTask(OTodo, element)
		})

		return OTodo

	} catch (error: any) {

		throw new Error(error)
	}
}

export async function findAllTodo(query?: object | string | number | any) {
	const myCustomLabels: object = {
	  totalDocs: 'itemCount',
	  docs: 'itemsList',
	  limit: 'perPage',
	  page: 'currentPage',
	  nextPage: 'next',
	  prevPage: 'prev',
	  totalPages: 'pageCount',
	  pagingCounter: 'slNo',
	  meta: 'paginator',
	};

	const options: object = {
	  page: parseInt(query.page),
	  limit: 4,
	  customLabels: myCustomLabels,
	  populate: "taskList"
	};

	return await Todo.paginate({}, options, myCustomLabels)
}

export async function findTodo(query: FilterQuery<ITodo>, options: QueryOptions = {lean: true}) {
	return Todo.findOne(query, {}, options).populate("taskList")
}

export async function findAndUpdate(query: FilterQuery<ITodo>, update: UpdateQuery<ITodo>, options: QueryOptions) {
	return Todo.findOneAndUpdate(query, update, options).populate('taskList')
}

export async function deleteTodo(query: FilterQuery<ITodo>) {
	return Todo.deleteOne(query)
}
