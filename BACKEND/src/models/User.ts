import mongoose, { Document } from "mongoose";

export interface IUserInput {

  name?: string;
  email?: string;
  password?: string;
  isVerified?: boolean
  isBlocked?: Boolean
  refreshToken?: string;
  otp?: string
  googleId: string

}

export interface IUser extends Document, IUserInput {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    // name: { type: String, required: true },
    // email: { type: String, required: true, unique: true },
    name: {
      type: String,
      required: function () {
        return !this.googleId; // Only require password if not using Google
      }
    },
    email: {
      type: String,
      required: function () {
        return !this.googleId; // Only require password if not using Google
      }
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Only require password if not using Google
      }
    },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    refreshToken: { type: String },
    otp: { type: String },
    googleId: { type: String }

  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);