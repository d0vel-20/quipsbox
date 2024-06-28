import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    username: string;
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = model<IUser>('User', userSchema);
export default User;


