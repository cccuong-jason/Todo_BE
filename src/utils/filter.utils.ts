import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose"
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
				createdAt: {
				    $gte: params.interval !== undefined? params.interval.split(",")[0] : null,
				    $lte: params.interval !== undefined? params.interval.split(",")[1] : null
				}
			},
			lgeDate : {
				createdAt: {
				    $lte: params.lgeDate !== undefined? new Date(params.lgeDate) : null
				}
			},
			gteDate : {
				createdAt: {
				    $gte: params.lgeDate !== undefined? new Date(params.gteDate) : null
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

		console.log("Build Search ...")

		return  FTodos.buildSearch(input)
	}

	
}