import { ICreatorService } from "../interface/ICreatorService";
import Creator, { ICreator } from "../../models/Creator";
import OTP from "../../models/Otp";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { IEvent } from "../../models/Event";
import CreatorRepository from "../../repositories/implementation/CreatorRepository";
import jwt from "jsonwebtoken";



dotenv.config();

class CreatorService implements ICreatorService {
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

  
  public async updateCreatorProfile(creatorId: string, profileData: Partial<ICreator>): Promise<ICreator | null> {
    try {
        console.log("📡 Service: Updating profile for Creator ID:", creatorId);
        console.log("📝 Data being sent to repository:", JSON.stringify(profileData, null, 2));
        return await CreatorRepository.updateCreator(creatorId, profileData);
    }catch (error: any) {
      console.error("❌ Service Error:", error);
      throw new Error(error.message);
  }
  
}

  async refreshAccessToken(refreshToken: string): Promise<string | null> {
    if (!refreshToken) {
      console.log("❌ No refresh token provided");
      return null;
    }

    const creator = await CreatorRepository.findByRefreshToken(refreshToken);
    if (!creator) {
      console.log("❌ Refresh token not found in database");
      return null;
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string };
      const newAccessToken = jwt.sign({ id: creator._id }, process.env.JWT_SECRET!, { expiresIn: "15m" });

      return newAccessToken;
    } catch (error) {
      console.log("❌ Invalid or expired refresh token");
      await CreatorRepository.clearRefreshToken(creator._id);
      return null;
    }
  }
  async login(email: string, password: string): Promise<{ token: string; refreshToken: string; creator: any } | null> {
    const creator = await CreatorRepository.findByEmail(email);

    if (!creator) {
      console.log("❌ Creator not found");
      return null;
    }

    if (creator.isBlocked) {
      console.log("🚫 Blocked account attempted login:", creator.email);
      throw new Error("Your account has been blocked 0999.");
    }

    const isPasswordValid = await bcrypt.compare(password, creator.password);
    if (!isPasswordValid) {
      console.log("❌ Invalid password attempt");
      return null;
    }

    const token = jwt.sign({ id: creator._id }, process.env.JWT_SECRET!, { expiresIn: "10m" });
    const refreshToken = jwt.sign({ id: creator._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "15d" });

    await CreatorRepository.updateRefreshToken(creator._id, refreshToken);

    return { token, refreshToken, creator: { id: creator._id, email: creator.email, name: creator.name } };
  }
  
  async logout(creatorId: string): Promise<void> {
    await CreatorRepository.clearRefreshToken(creatorId);
  }

  async getCreator(creatorId: string): Promise<any> {
    return await CreatorRepository.findById(creatorId);
  }


  async getEventById(id: string): Promise<Event | null> {
    return CreatorRepository.getEventById(id);
  }

  async getAllEvents(): Promise<Event[]> {
    return CreatorRepository.getAllEvents();
  }
  ////////////////////////////////////////////////
  private generateOTP(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  private async sendOTP(email: string, otp: string) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    });
  }

  async registerCreator(name: string, email: string, password: string) {
    const existingCreator = await Creator.findOne({ email });
    if (existingCreator) throw new Error("Email already in use");

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 30 * 1000);

    await OTP.create({ email, otp, expiresAt });
    await this.sendOTP(email, otp);

    await Creator.create({ name, email, password: hashedPassword, isVerified: false });

    return { email, message: "OTP sent" };
  }

  async verifyCreatorOTP(email: string, otp: string) {
    const creator = await Creator.findOne({ email });
    if (!creator) throw new Error("creator not found");

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) throw new Error("Invalid OTP");

    if (otpRecord.expiresAt && otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ email });
      throw new Error("OTP expired, request a new one");
    }

    creator.isVerified = true;
    await creator.save();
    await OTP.deleteOne({ email });

    return { email, message: "Account verified" };
  }


  async resendOTP(email: string) {
    const creator = await Creator.findOne({ email });
    if (!creator) throw new Error("creator not found");

    await OTP.deleteOne({ email });
    const newOtp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 30 * 1000);

    await OTP.create({ email, otp: newOtp, expiresAt });
    await this.sendOTP(email, newOtp);

    return { message: "New OTP sent successfully" };
  }

  async getCreatorById(creatorId: string): Promise<ICreator | null> {
    return await CreatorRepository.findById(creatorId);
  }

  async createEvent(eventData: Partial<IEvent>) {
    console.log("[Service] Creating event with data:", eventData);
    const event = await CreatorRepository.createEvent(eventData);
    console.log("[Service] Event successfully saved to database.");
    return event;
  }
}

export default new CreatorService();
