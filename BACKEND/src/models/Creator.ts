import mongoose, {  Document } from "mongoose";

export interface ICreatorInput {
  name?: string;
  email?: string;
  password: string;
  isVerified: boolean;
  isBlocked?:Boolean;
  refreshToken?: string;
otp?:string
googleId: { type: String }

}


export interface ICreator extends Document, ICreatorInput {
  createdAt: Date;
  updatedAt: Date;
}

const CreatorSchema= new mongoose.Schema<ICreator>(
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
    otp:{type:String},
    googleId:{type:String}

  },
  { timestamps: true }
);

export default mongoose.model<ICreator>("Creator", CreatorSchema);
