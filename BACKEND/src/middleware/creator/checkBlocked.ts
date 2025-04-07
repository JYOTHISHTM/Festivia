import { Request, Response, NextFunction } from "express";
import CreatorModel from "../../models/Creator"; 

interface AuthenticatedRequest extends Request {
  creator?: { id: string }; 
}

const checkBlocked = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      console.log("🔹 checkBlocked Middleware Running..."); 

  try {
    if (!req.creator || !req.creator.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const creator = await CreatorModel.findById(req.creator.id);
    if (!creator) return res.status(404).json({ message: "Creator not found" });

    if (creator.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked." });
    }

    next(); 
  } catch (error) {
    console.error("Error checking block status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default checkBlocked;
