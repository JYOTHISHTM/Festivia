import mongoose, {  Document } from "mongoose";

export interface ICreatorInput {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  isBlocked?:Boolean;
  refreshToken?: string;

}


export interface ICreator extends Document, ICreatorInput {
  createdAt: Date;
  updatedAt: Date;
}

const CreatorSchema= new mongoose.Schema<ICreator>(
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

export default mongoose.model<ICreator>("Creator", CreatorSchema);
