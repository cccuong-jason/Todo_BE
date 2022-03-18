import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose"
import { omit } from "lodash";
import User, { UserDocument } from "../model/user.model"
// import { singletonResposne } from ""
import log from "../logger"

export async function createUser(input: DocumentDefinition<UserDocument>) {
	try {
		return await User.create(input)
	} catch (error: any) {
		throw new Error(error)
	}
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return User.findOne(query).populate({
    path: 'todoList',
    populate: { path: 'taskList' }
  }).lean()
}

export async function validatePassword({
  email,
  password,
}: {
  email: UserDocument["email"];
  password: string;
}) {
  const user = await User.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return false;
  }

  return user
}

export async function userInformationUpload(query: FilterQuery<UserDocument>, update: UpdateQuery<UserDocument>, options: QueryOptions) {
	return User.findOneAndUpdate(query, update, options).lean()	
}
