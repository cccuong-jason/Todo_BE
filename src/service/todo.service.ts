import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose"
import Todo, { ITodo } from "../model/todo.model"
import User, { UserDocument } from "../model/user.model"
import { ITask } from "../model/task.model"
import { createTask } from "./task.service"
import log from '../logger';
import { omit, get } from "lodash"
import { singletonResponse } from "../utils/response.utils"
import { todosFilters } from "../utils/filter.utils"

export async function createTodo(todo: DocumentDefinition<ITodo>, task: Array<DocumentDefinition<ITask>>) {

	let OTodo = await Todo.create(omit(todo, "taskList"))

	var todoResult: any = ""

	await User.findByIdAndUpdate(
		todo.user,
		{
			$push: {todoList: OTodo._id}
		},
		{
			new: true, useFindAndModify: true
		}
	)
	
	task.forEach((element) => {
		todoResult = createTask(OTodo, element)
	})

	return todoResult
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
	  select: "-__v",
	  page: parseInt(query.page),
	  limit: 8,
	  customLabels: myCustomLabels,
	  populate: "taskList",
	  lean: true,
	  sort: { createdAt: "descending"}
	};

	const inputQuery = omit(query, "page")
	const searchType = get(inputQuery, "search") ? "search" : "filter"

	const FTodos = Object.keys(inputQuery).length !== 0 ? todosFilters(omit(query, "page"), searchType) : {}
	console.log(FTodos.$and[0].endDate)

	return await Todo.paginate(FTodos, options, myCustomLabels)
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
