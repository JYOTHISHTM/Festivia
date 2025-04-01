import { Request, Response } from "express";
import { IUserController } from "../interface/IUserController";
import { IUserService } from "../../services/interface/IUserService";  
import UserService from "../../services/implementation/UserService";  
import EventModel from "../../models/Event";
import mongoose from "mongoose";

import jwt from "jsonwebtoken";
import User from "../../models/User";
import bcrypt from "bcryptjs";


interface AuthRequest extends Request {
  user?: { id: string }; 
}
class UserController implements IUserController {

    private userService: IUserService;

    constructor(userService: IUserService) {
        this.userService = userService;
      }
      
    
  async signUp(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const result = await UserService.registerUser(name, email, password);
      res.status(201).json({ success: true, message: result.message, data: result });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  }

  async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      const result = await UserService.verifyUserOTP(email, otp);
      res.status(200).json({ success: true, message: result.message, data: result });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  }



  async resendOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ success: false, message: "Email is required" });
        return;
      }
      const result = await UserService.resendOTP(email);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const user = await UserService.getUserById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user profile", error });
    }
  }

  async getAllEvents(req: Request, res: Response): Promise<void> {
    try {
      const events = await EventModel.find();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  }

  async getEventById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid Event ID" });
        return;
      }
      const event = await EventModel.findById(id);
      if (!event) {
        res.status(404).json({ error: "Event not found" });
        return;
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching the event." });
    }
  }

  async updateProfile  (req: AuthRequest, res: Response): Promise<void> {
    
    try {
      if (!req.user || !req.user.id) {
        console.error("User ID not found in request object");
        res.status(401).json({ message: "User ID not found" });
        return;
      }
      
      const userId = req.user.id;
      
      const updatedUser = await UserService.updateUserProfile(userId, req.body);
      console.log("Service response:", updatedUser);
     
      if (!updatedUser) {
        console.log("User not found - returning 404");
        res.status(404).json({ message: "User not found" });
        return;
      }
            res.json(updatedUser);
    } catch (error: any) {
      console.error("Update profile error:", error.message);
      console.error("Error stack:", error.stack);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };

  
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        console.log("❌ Invalid credentials");
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
  
      if (user.isBlocked) {
        console.log("🚫 Blocked account attempted login:", user.email);
        return res.status(403).json({ message: "Your account has been blocked user333." });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "10m" });
      const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "15d" });
  
      user.refreshToken = refreshToken;
      await user.save();
  
      res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });
    
      return res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
    } catch (error) {
      console.error("❌ Server error:", error);
      return res.status(500).json({ error: "Server Error" });
    }
  }
  


  async refreshToken(req: Request, res: Response) {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            console.log("❌ No refresh token found");
            return res.sendStatus(401);
        }

        const user = await User.findOne({ refreshToken });
        if (!user) {
            console.log("❌ Refresh token not found in database");
            res.clearCookie("refreshToken");
            return res.sendStatus(403);
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string };
        } catch (error) {
            console.log("❌ Invalid or expired refresh token");
            user.refreshToken = ""; // Clear token in DB
            await user.save();
            res.clearCookie("refreshToken");
            return res.status(403).json({ error: "Invalid or expired refresh token" });
        }

        const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "15m" });

        res.json({ token: newAccessToken });
    } catch (error) {
        console.error("❌ Internal server error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async logout(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = "";
        await user.save();
      }
    }

    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("❌ Logout error:", error);
    res.status(500).json({ error: "Server error" });
  }
}

     async getUser  (req: Request, res: Response) {
      try {
        const user = await User.findById((req as any).user.id).select("-password");
        if (!user) return res.sendStatus(404);
        res.json(user);
      } catch (error) {
        res.status(500).json({ error: "Server Error" });
      }
    };
  
  
}


const userController = new UserController(UserService);
export default userController;
