import User from "../../models/User";
import OTP from "../../models/Otp";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

import UserRepository from "../../repositories/implementation/UserRepository";
import { IUser } from "../../models/User";
import { IUserService } from "../interface/IUserService";  

dotenv.config();

class UserService implements IUserService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  private generateOTP(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  private async sendOTP(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    });
  }

  public async registerUser(name: string, email: string, password: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email already in use");

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 30 * 1000);

    await OTP.create({ email, otp, expiresAt });
    await this.sendOTP(email, otp);

    await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    return { email, message: "OTP sent" };
  }

  public async verifyUserOTP(email: string, otp: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) throw new Error("Invalid OTP");

    if (otpRecord.expiresAt && otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ email });
      throw new Error("OTP expired, request a new one");
    }

    user.isVerified = true;
    await user.save();
    await OTP.deleteOne({ email });

    return { email, message: "Account verified" };
  }


  public async resendOTP(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    await OTP.deleteOne({ email });

    const newOtp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 30 * 1000);

    await OTP.create({ email, otp: newOtp, expiresAt });
    await this.sendOTP(email, newOtp);

    return { message: "New OTP sent successfully" };
  }

  public async getUserById(userId: string): Promise<IUser | null> {
    return await UserRepository.findById(userId);
  }

  public async updateUserProfile(userId: string, profileData: Partial<IUser>): Promise<IUser | null> {
    try {
      return await UserRepository.updateUser(userId, profileData);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async logout(userId: string): Promise<void> {
    await UserRepository.logout(userId); 
}

  
}

export default new UserService();



