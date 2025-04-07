import { Request,Response } from "express";
import {IEventController} from '../interface/IEventController'
import EventService from '../../services/implementation/EventService'


class EventController implements IEventController{
  async getEventById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const event = await EventService.getEventById(id);

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      return res.json(event);
    } catch (error) {
      console.error("❌ Error fetching event:", error);
      return res.status(500).json({ error: "An error occurred while fetching the event." });
    }
  }

  async getAllEvents(req: Request, res: Response): Promise<Response> {
    try {
      const events = await EventService.getAllEvents();
      return res.status(200).json(events);
    } catch (error) {
      console.error("❌ Error fetching all events:", error);
      return res.status(500).json({ message: "Failed to fetch events" });
    }
  }
}

export default  EventController;
