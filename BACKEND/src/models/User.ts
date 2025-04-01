import mongoose, { Document } from "mongoose";

export interface IUserInput {
  
  name: string;
  email: string;
  password: string;
  isVerified?: boolean
  isBlocked?:Boolean
  refreshToken?: string;

}

export interface IUser extends Document, IUserInput {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    refreshToken: { type: String }

  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);