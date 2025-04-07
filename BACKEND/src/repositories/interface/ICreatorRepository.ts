import { ICreator } from "../../models/Creator";
import { IEvent } from "../../models/Event";
import { IBaseRepository } from "./IBaseRepository";

export interface ICreatorRepository extends IBaseRepository<ICreator> {
  blockCreator(creatorId: string): Promise<ICreator | null>;
  createEvent(eventData: Partial<IEvent>): Promise<IEvent>;
  findByEmail(email: string): Promise<ICreator | null>
  updateRefreshToken(id: string, refreshToken: string): Promise<void>;
  clearRefreshToken(id: string): Promise<void>;
  findByRefreshToken(refreshToken: string): Promise<any>;
  clearRefreshToken(creatorId: string): Promise<void>;
  findById(creatorId: string): Promise<any>;
}
