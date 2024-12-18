import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    userName: string;
    password: string;
}

const UserSchema = new Schema<IUser>({
    userName: {type:String, required: true},
    password: {type:String, required: true}
});

export default mongoose.model<IUser>("User", UserSchema);