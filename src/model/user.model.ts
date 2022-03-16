import mongoose from "mongoose"
import bcrypt from "bcrypt"
import config from "config"

const globalConfig: any = config.get("appConfig");

export interface UserDocument extends mongoose.Document {
	email: string;
	name: string;
	password: string;
	avatar?: File | string
	birthday?: Date | string
	phone: string
	address: string
	createdAt: Date;
	updatedAt: Date;
	comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new mongoose.Schema<UserDocument>(
	{
		email: {type: String, required:true, unique:true},
		name: {type: String, required: true},
		birthday: { type: Date, default: null},
		password: {type: String, required: true},
		phone: { type: String, default: "", trim: true},
		address: {	type: String, default: "", trim: true},
		avatar: { type: String, default: "/media/users/default_avatar.png"}
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true
		}
	}
)

UserSchema.pre("save", async function(next) {
	let user = this as UserDocument	

	if (!user.isModified("password")) return next();

	const salt = await bcrypt.genSalt(parseInt(globalConfig.parsed.SALTWORKFACTOR) as number)

	const hash = await bcrypt.hashSync(user.password, salt)

	user.password = hash

	return next()
})

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const User = mongoose.model<UserDocument>("User", UserSchema)

export default User
