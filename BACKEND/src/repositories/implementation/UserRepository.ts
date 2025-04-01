import UserModel, { IUser } from "../../models/User";
import { BaseRepository } from "../implementation/BaseRepository";
import { IUserRepository } from "../interface/IUserRepository";
import { UpdateQuery } from "mongoose";

class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async blockUser(userId: string): Promise<IUser | null> {
    return await this.update(userId, { isBlocked: true });
  }

  async updateUser(userId: string, updatedData: UpdateQuery<IUser>): Promise<IUser | null> {
    try {
      const result = await UserModel.findByIdAndUpdate(userId, updatedData, { new: true });
      console.log("Database result:", result);
      return result;
    } catch (error: any) {
      console.error("Repository error:", error.message);
      console.error("Error stack:", error.stack);
      throw error;
    }
  }

  async logout(userId: string): Promise<{ message: string }> {
    try {
      await UserModel.deleteOne({ _id: userId });
      return { message: "Logout successful" };
    } catch (error) {
      throw new Error("Logout failed");
    }
  }
}

export default new UserRepository();
