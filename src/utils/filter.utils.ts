import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery, ObjectId } from "mongoose"
import Todo, { ITodo } from "../model/todo.model" 
import { forEach } from "lodash"
import dayjs from "dayjs"

class TodoFilters {

	public _query: any
	public _queryList: any

	constructor() {

		this._query = null
		this._queryList = null
		
	}

	get query(): any {
		return this._query
	}

	set query(params: any) {
		this._query = params === "search" ? {$text: {$search: null}} : { $and: []}
	}

	get queryList(): any {
		return this._queryList
	} 

	set queryList(params: any) {

		console.log(new Date(params.gteDate))

		this._queryList = {
			status: {
				status: params.status !== undefined? params.status : null
			},
			tags : {
				tags: {
					$in: params.tags !== undefined? params.tags.split(',') : null
				}
			},
			interval : {
				startDate: {
				    $gte: params.interval !== undefined? params.interval.split(",")[0] : null,
				    $lte: params.interval !== undefined? params.interval.split(",")[1] : null
				}
			},
			lgeDate : {
				endDate: {
				    $lte: params.lgeDate !== undefined? new Date(params.lgeDate) : null
				}
			},
			gteDate : {
				startDate: {
				    $gte: params.gteDate !== undefined? new Date(params.gteDate) : null
				}
			},
			date: {
				startDate: {
					$eq: params.date !== undefined? new Date(params.date) : null
				}
			},
			user: {
				$match: {
					_id: params.user !== undefined? params.user : null
				}
			}
		}	
	} 

	public buildFilter(inputQuery: FilterQuery<ITodo>) {
		
		for (var value in inputQuery) {
			if (this._queryList.hasOwnProperty(value)) {
				this._query.$and.push(this._queryList[value])
			}
		}

		return this._query
	}

	public buildSearch(inputQuery: FilterQuery<ITodo>) {

		this._query.$text.$search = inputQuery.search

		return this._query
	}

}

export function todosFilters(input: FilterQuery<ITodo>, searchType: string) {

	const FTodos = new TodoFilters()
	FTodos.query = searchType

	if (searchType === "filter") {

		FTodos.queryList = input

		return FTodos.buildFilter(input)	

	} else {

		return  FTodos.buildSearch(input)
	}

	
}