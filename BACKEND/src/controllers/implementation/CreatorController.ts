import { Request, Response } from "express";
import { ICreatorController } from "../interface/ICreatorController";
import { ICreatorService } from "../../services/interface/ICreatorService";
import CreatorService from "../../services/implementation/CreatorService";
import mongoose from "mongoose";
import cloudinary from "../../config/cloudinary";
import streamifier from "streamifier";
import CreatorRepository from "../../repositories/implementation/CreatorRepository";
import jwt from "jsonwebtoken";


interface AuthRequest extends Request {
  creator?: { id: string };
}

class CreatorController implements ICreatorController {

  private creatorService: ICreatorService;

  constructor(creatorService: ICreatorService) {
    this.creatorService = creatorService;
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
        if (!req.creator || !req.creator.id) {
            console.log("❌ Creator ID not found");
            res.status(401).json({ message: "Creator ID not found" });
            return;
        }

        const creatorId = req.creator.id;
        console.log("✅ Updating profile for Creator ID:", creatorId);
        console.log("📝 Update request body:", JSON.stringify(req.body, null, 2));

        const updatedCreator = await CreatorService.updateCreatorProfile(creatorId, req.body);

        if (!updatedCreator) {
            console.log("❌ Creator not found or not updated");
            res.status(404).json({ message: "Creator not found" });
            return;
        }

        console.log("✅ Profile updated successfully:", updatedCreator);
        res.json(updatedCreator);
    } catch (error: any) {
        console.error("❌ Server Error:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

  
async getProfile(req: Request, res: Response): Promise<void> {
  try {
    const creatorId = (req as any).creator?.id;
    if (!creatorId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const creator = await CreatorService.getCreatorById(creatorId);
    if (!creator) {
      res.status(404).json({ message: "creator not found" });
      return;
    }
    res.json(creator);
  } catch (error) {
    res.status(500).json({ message: "Error fetching creator profile", error });
  }
}

async getCreator(req: Request, res: Response): Promise<Response> {
  try {
    const creatorId = (req as any).creator?.id;
    if (!creatorId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const creator = await this.creatorService.getCreator(creatorId);
    if (!creator) return res.sendStatus(404);

    return res.json(creator);
  } catch (error: any) {
    console.error("❌ Get creator error:", error);
    return res.status(500).json({ error: "Server Error" });
  }
}



  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const result = await this.creatorService.login(email, password);

      if (!result) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const { token, refreshToken, creator } = result;
      res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });

      return res.json({ token, creator });
    } catch (error: any) {
      console.error("❌ Server error:", error);
      return res.status(500).json({ error: error.message || "Server Error" });
    }
  }

  async signUp(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const result = await CreatorService.registerCreator(name, email, password);
      res.status(201).json({ success: true, message: result.message, data: result });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  }

  async verifyOTP(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const result = await CreatorService.verifyCreatorOTP(email, otp);
      res.status(200).json({ success: true, message: result.message, data: result });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  }


  async refreshToken(req: Request, res: Response): Promise<Response> {
    try {
      const { refreshToken } = req.cookies;
      const newAccessToken = await this.creatorService.refreshAccessToken(refreshToken);
  
      if (!newAccessToken) {
        res.clearCookie("refreshToken");
        return res.sendStatus(403);
      }
  
      return res.json({ token: newAccessToken });
    } catch (error: any) {
      console.error("❌ Internal server error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  
  async logout(req: Request, res: Response): Promise<Response> {
    try {
      const { refreshToken } = req.cookies;
  
      if (!refreshToken) {
        return res.status(400).json({ error: "No refresh token provided" });
      }
  
      // ✅ Decode the refresh token properly
      let decoded: any;
      try {
        decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!);
      } catch (error) {
        return res.status(401).json({ error: "Invalid refresh token" });
      }
  
      const creatorId = decoded.id; // Extract creator ID from token
  
      // ✅ Ensure ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(creatorId)) {
        return res.status(400).json({ error: "Invalid Creator ID" });
      }
  
      // ✅ Clear refresh token from DB (make sure this function handles it correctly)
      await CreatorRepository.clearRefreshToken(creatorId);
  
      // ✅ Clear cookie
      res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
  
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error: any) {
      console.error("❌ Logout error:", error);
      return res.status(500).json({ error: "Server error" });
    }
  }


async resendOTP(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: "Email is required" });
      return;
    }
    const result = await CreatorService.resendOTP(email);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
}

////////////////////////////////////////




  


async getEventById(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Event ID" });
    }

    const event = await this.creatorService.getEventById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.json(event);
  } catch (error) {
    return res.status(500).json({ error: "An error occurred while fetching the event." });
  }
}

async getAllEvents(req: Request, res: Response): Promise<void> {
  try {
    const events = await this.creatorService.getAllEvents();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
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

export default new CreatorController(CreatorService);



