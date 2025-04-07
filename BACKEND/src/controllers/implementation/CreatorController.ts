import { Request, Response } from "express";
import { ICreatorController } from "../interface/ICreatorController";
import CreatorService from "../../services/implementation/CreatorService";
import cloudinary from "../../config/cloudinary";
import streamifier from "streamifier"

interface AuthRequest extends Request {
  creator?: { id: string };
}

class CreatorController implements ICreatorController {

  
  async getCreator(req: Request, res: Response): Promise<Response> {
    try {
      const creatorId = (req as any).creator?.id;
      if (!creatorId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      const creator = await CreatorService.getCreator(creatorId);
      if (!creator) return res.sendStatus(404);
  
      return res.json(creator);
    } catch (error: any) {
      console.error("❌ Get creator error:", error);
      return res.status(500).json({ error: "Server Error" });
    }
  }


  async createEvent(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required." });
      }

      const streamUpload = () => {
        return new Promise<{ secure_url: string }>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "festivia/events" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          if (req.file) {
            streamifier.createReadStream(req.file.buffer).pipe(stream);
          }
        });
      };

      const uploadResult = await streamUpload();
      const imageUrl = uploadResult.secure_url;

      const { eventName, eventType, description, date, time, location, seatType, prize } = req.body;

      if (!eventName || !eventType || !description || !date || !time || !location || !seatType || !prize) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      const eventData: any = {
        eventName,
        eventType,
        description,
        date,
        time,
        location,
        seatType,
        prize: parseFloat(prize),
        image: imageUrl
      };

      if (seatType === "RESERVED") {
        const { totalSeats, earlyBirdTickets, earlyBirdDiscount } = req.body;
        if (!totalSeats) {
          return res.status(400).json({ message: "Total seats is required for reserved seating" });
        }
        eventData.totalSeats = parseInt(totalSeats);
        eventData.availableSeats = parseInt(totalSeats);
        if (earlyBirdTickets) eventData.earlyBirdTickets = parseInt(earlyBirdTickets);
        if (earlyBirdDiscount) eventData.earlyBirdDiscount = parseInt(earlyBirdDiscount);
      }

      const newEvent = await CreatorService.createEvent(eventData);
      return res.status(201).json(newEvent);
    } catch (error) {
      return res.status(500).json({ message: "Failed to create event", error });
    }
  }

}

export default  CreatorController;



