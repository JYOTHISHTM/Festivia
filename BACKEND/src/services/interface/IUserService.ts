import { IUser } from "../../models/User";

export interface IUserService {
  registerUser(name: string, email: string, password: string): Promise<{ email: string; message: string }>;
  verifyUserOTP(email: string, otp: string): Promise<{ email: string; message: string }>;
  resendOTP(email: string): Promise<{ message: string }>;
  getUserById(userId: string): Promise<IUser | null>;
  updateUserProfile(userId: string, profileData: Partial<IUser>): Promise<IUser | null>;
  logout(userId: string): Promise<void>;
}
