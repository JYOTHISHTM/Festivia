import UserModel, { IUser } from "../../models/User";
import { BaseRepository } from "../implementation/BaseRepository";
import { IUserRepository } from "../interface/IUserRepository";

class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }

  
  async updateRefreshToken(userId: string, refreshToken: string) {
    return await UserModel.findByIdAndUpdate(userId, { refreshToken });
  }
  async blockUser(userId: string): Promise<IUser | null> {
    return await this.update(userId, { isBlocked: true });
  }


  async logout(userId: string): Promise<{ message: string }> {
    try {
      await UserModel.deleteOne({ _id: userId });
      return { message: "Logout successful" };
    } catch (error) {
      throw new Error("Logout failed");
    }
  }




  async updateOtp(email: string, otp: string, otpExpires: Date) {
    return UserModel.updateOne({ email }, { otp, otpExpires });
  }

  async updatePassword(email: string, password: string) {
    return UserModel.updateOne({ email }, { password, otp: null });
  }


}

export default new UserRepository();
