import { IUser } from "../../models/User";
import { IBaseRepository } from "./IBaseRepository";
import { UpdateQuery } from "mongoose";

export interface IUserRepository extends IBaseRepository<IUser> {
  blockUser(userId: string): Promise<IUser | null>;
  updateUser(userId: string, updatedData: UpdateQuery<IUser>): Promise<IUser | null>;
  logout(userId: string): Promise<{ message: string }>;
}
