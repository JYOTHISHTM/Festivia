
export interface IEventService {
    getEventById(id: string): Promise<any>;
    getAllEvents(): Promise<any>;
  }
  