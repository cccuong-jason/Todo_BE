import { Request, Response, NextFunction } from "express"
import { createTodo, findTodo, findAndUpdate, deleteTodo, findAllTodo } from "../service/todo.service"
import { get, concat, flatten, forEach, values } from "lodash"
import { singletonResponse } from "../utils/response.utils"
import { PaginationParameters } from "mongoose-paginate-v2"
import log from "../logger"

export async function createTodoHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const userId = get(req, "user._doc._id");
		const body = req.body;
		const todo = await createTodo({ ...body, user: userId }, body.taskList)

		return singletonResponse.response("Successful", `Create Todo[${body.name}] Successfully`, 201, res, { todo })

	} catch (error: Error) {

		log.error(error)
		next({ error: error.message, statusCode: 409})
	}
}

export async function findAllTodoHandler(req: Request, res: Response, next: NextFunction) {
	try {

		const todo = await findAllTodo(req.query)

		if (!todo || todo.itemsList.length === 0) {
			return singletonResponse.response("Not found", "No Todo list Found", 404, res)
		}

		const result = concat(values(todo.itemsList), todo.paginator)

		return singletonResponse.response("Successfully", "Retrieve Todo List", 200, res, result)

	} catch (error: Error) {

		log.error(error)
		next({ error: error.message, statusCode: 400})
	}
}

export async function findTodoHandler(req: Request, res: Response, next: NextFunction) {
	try {

		const _id = get(req, "params.todoId")
		const todo = await findTodo({ _id })

		if (!todo) {
			return singletonResponse.response("Not found", `Todo[${_id}] Not Found`, 404, res)
		}

		return singletonResponse.response("Successfully", `Retrieve Todo[${_id}] Object`, 200, res, { ...todo })

	} catch (error: Error) {

		log.error(error)
		next({ error: error.message , statusCode: 400})
	}
}

export async function findAndUpdateHandler(req: Request, res: Response, next: NextFunction) {
	try {

		const userId = get(req, "user._doc._id")
		const _id = get(req, "params.todoId")
		const update = req.body

		const todo: any = await findTodo({ _id }) 

		if (!todo) {
			return singletonResponse.response("Not found", `Todo[${_id}] Not Found`, 404, res)
		}	

		if (String(todo.user) !== userId) {
			return singletonResponse.response("Unauthorized User", `User [${_id}] Not Match`, 401, res)
		}

		const updatedTodo = await findAndUpdate({ _id }, update, {new: true})

		return singletonResponse.response("Update Sucessfull", `Todo [${_id}] updated successfully`, 200, res, { ...updatedTodo })

	} catch (error: Error) {

		log.error(error)
		next({ error: error.message , statusCode: 400})
	}
}


export async function deleteTodoHandler(req: Request, res: Response, next: NextFunction) {
	try {

		const userId = get(req, "user._doc._id")
		const _id = get(req, "params.todoId")

		const todo: any = await findTodo({ _id }) 

		if (!todo) {
			return singletonResponse.response("Not found", `Todo[${_id}] Not Found`, 404, res)
		}	

		if (String(todo.user) !== userId) {
			return singletonResponse.response("Unauthorized User", `User [${_id}] Not Match`, 401, res)
		}

		await deleteTodo({ _id })	

		return singletonResponse.response("Delete Sucessfully", `Todo [${_id}] deleted successfully`, 200, res)

	} catch (error: Error) {

		log.error(error)
		next({ error: error.message , statusCode: 400})
	}
}