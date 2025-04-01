import CreatorModel, { ICreator } from "../../models/Creator";
import EventModel, { IEvent } from "../../models/Event";
import { BaseRepository } from "../implementation/BaseRepository";
import { ICreatorRepository } from "../interface/ICreatorRepository";
import { UpdateQuery } from "mongoose";

class CreatorRepository extends BaseRepository<ICreator> implements ICreatorRepository {
  constructor() {
    super(CreatorModel);
  }

  
  async updateCreator(creatorId: string, updatedData: UpdateQuery<ICreator>): Promise<ICreator | null> {
    console.log("📂 Repository: updateCreator called");
    console.log("🆔 Creator ID:", creatorId);
    console.log("🔄 Update Data:", JSON.stringify(updatedData, null, 2));

    try {
        const result = await CreatorModel.findByIdAndUpdate(creatorId, updatedData, { 
            new: true, 
            runValidators: true, 
        });

        if (!result) {
            console.log("❌ No creator found to update");
        } else {
            console.log("✅ Database update successful:", result);
        }

        return result;
    } catch (error: any) {
        console.error("❌ Repository error:", error.message);
        throw error;
    }
}


// async updateCreatorProfile(creatorId: string, data: any): Promise<any> {
//   return await CreatorModel.findByIdAndUpdate(creatorId, data, { new: true });
// }
  async findByEmail(email: string): Promise<any> {
    return await CreatorModel.findOne({ email });
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
    await CreatorModel.findByIdAndUpdate(id, { refreshToken });
  }


  async getEventById(id: string): Promise<Event | null> {
    return await EventModel.findById(id);
  }

  async getAllEvents(): Promise<Event[]> {
    return await EventModel.find();
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
////////////////////////////
  async blockCreator(creatorId: string): Promise<ICreator | null> {
    return await this.update(creatorId, { isBlocked: true });
  }

  async createEvent(eventData: Partial<IEvent>): Promise<IEvent> {
    return await EventModel.create(eventData);
  }


}

export default new CreatorRepository();
