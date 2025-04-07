import EventRepository from "../../repositories/implementation/EventRepository";
import {IEventService} from '../interface/IEventService'


class EventService implements IEventService {

  
  async getEventById(id: string) {
    return await EventRepository.getEventById(id);
  }

  async getAllEvents() {
    return await EventRepository.getAllEvents();
  }
}

export default new EventService();
