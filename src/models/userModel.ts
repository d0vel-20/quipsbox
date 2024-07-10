import { Schema, model } from 'mongoose';

interface IUser {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  otp: string;
  otpExpires: Date;
  resetCode?: string;
  resetCodeExpires?: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  resetCode: { type: String },
  resetCodeExpires: { type: Date },
});

const User = model<IUser>('User', userSchema);
export default User;



