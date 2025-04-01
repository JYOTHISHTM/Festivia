import { ICreator } from "../../models/Creator";
import { IEvent } from "../../models/Event";

export interface ICreatorService {
  registerCreator(name: string, email: string, password: string): Promise<{ email: string; message: string }>;
  verifyCreatorOTP(email: string, otp: string): Promise<{ email: string; message: string }>;
  resendOTP(email: string): Promise<{ message: string }>;
  getCreatorById(creatorId: string): Promise<ICreator | null>;
  updateCreatorProfile(userId: string, profileData: Partial<ICreator>): Promise<ICreator | null>;
  createEvent(eventData: Partial<IEvent>): Promise<IEvent>;
  logout(creatorId: string): Promise<void>;
  login(email: string, password: string): Promise<{ token: string; refreshToken: string; creator: any } | null>;
  refreshAccessToken(refreshToken: string): Promise<string | null>;
  getCreator(creatorId: string): Promise<any>;
  getEventById(id: string): Promise<Event | null>;
  getAllEvents(): Promise<Event[]>;
}
