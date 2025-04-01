import { Request, Response, NextFunction } from "express";
import UserModel from "../../models/User"; 

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

const checkBlocked = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      console.log("🔹 checkBlocked Middleware Running...");
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "user not found" });

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked." });
    }

    next(); 
  } catch (error) {
    console.error("Error checking block status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default checkBlocked;
