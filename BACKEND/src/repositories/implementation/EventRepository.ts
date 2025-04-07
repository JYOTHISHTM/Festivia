import EventModel from "../../models/Event";
import mongoose from "mongoose";

class EventRepository {
  async getEventById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await EventModel.findById(id);
  }

  async getAllEvents() {
    return await EventModel.find();
  }
}

export default new EventRepository();
