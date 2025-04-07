import CreatorModel, { ICreator } from "../../models/Creator";
import EventModel, { IEvent } from "../../models/Event";
import { BaseRepository } from "../implementation/BaseRepository";
import { ICreatorRepository } from "../interface/ICreatorRepository";

class CreatorRepository extends BaseRepository<ICreator> implements ICreatorRepository {
  constructor() {
    super(CreatorModel);
  }
  
  async findByEmail(email: string): Promise<any> {
    return await CreatorModel.findOne({ email });
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
    await CreatorModel.findByIdAndUpdate(id, { refreshToken });
  }


  async findByRefreshToken(refreshToken: string): Promise<any> {
    return await CreatorModel.findOne({ refreshToken });
  }

  async clearRefreshToken(id: string): Promise<void> {
    await CreatorModel.findByIdAndUpdate(id, { refreshToken: "" });
  }

  async findById(creatorId: string): Promise<any> {
    return await CreatorModel.findById(creatorId).select("-password");
  }
  async blockCreator(creatorId: string): Promise<ICreator | null> {
    return await this.update(creatorId, { isBlocked: true });
  }

  async createEvent(eventData: Partial<IEvent>): Promise<IEvent> {
    return await EventModel.create(eventData);
  }


}

export default new CreatorRepository();
