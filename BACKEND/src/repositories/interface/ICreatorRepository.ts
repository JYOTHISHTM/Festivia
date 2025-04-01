import { ICreator } from "../../models/Creator";
import { IEvent } from "../../models/Event";
import { IBaseRepository } from "./IBaseRepository";
import { UpdateQuery } from "mongoose";

export interface ICreatorRepository extends IBaseRepository<ICreator> {
  blockCreator(creatorId: string): Promise<ICreator | null>;
  createEvent(eventData: Partial<IEvent>): Promise<IEvent>;
  updateCreator(userId: string, updatedData: UpdateQuery<ICreator>): Promise<ICreator | null>;
  // updateCreatorProfile(creatorId: string, data: any): Promise<any>;
  findByEmail(email: string): Promise<any>;
  updateRefreshToken(id: string, refreshToken: string): Promise<void>;
  clearRefreshToken(id: string): Promise<void>;
  findByRefreshToken(refreshToken: string): Promise<any>;
  clearRefreshToken(creatorId: string): Promise<void>;
  findById(creatorId: string): Promise<any>;
  getEventById(id: string): Promise<Event | null>;
  getAllEvents(): Promise<Event[]>;
}
