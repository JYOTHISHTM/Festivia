import { Request, Response } from "express";
import dotenv from "dotenv";
import { IAdminController } from "../../controllers/interface/IAdminController";
import { IAdminService } from "../../services/interface/IAdminService";

dotenv.config();

class AdminController implements IAdminController {
  private adminService: IAdminService;

  constructor(adminService: IAdminService) {
    this.adminService = adminService;
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { username, password } = req.body;
      const { token, refreshToken, admin } = await this.adminService.login(username, password);

      res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });

      return res.status(200).json({
        message: "Login successful",
        isAdmin: true,
        token,
        admin: { id: admin._id, username: admin.username }
      });

    } catch (error) {
      console.error("❌ Server error:", (error as Error).message);
      return res.status(401).json({ message: (error as Error).message });
    }
  }

  
  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;
      const newAccessToken = await this.adminService.refreshToken(refreshToken);

      if (!newAccessToken) {
        res.clearCookie("refreshToken");
        return res.status(403).json({ error: "Invalid or expired refresh token" });
      }

      res.json({ token: newAccessToken });
    } catch (error) {
      console.error("❌ Internal server error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }


  async logout(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.cookies;

      await this.adminService.logout(refreshToken);

      res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });

      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("❌ Logout error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }

  async getUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.adminService.getUsers(); // ✅ Fix applied
      return res.status(200).json(users);
    } catch (error) {
      console.error("Actual Error in getUsers:", error); // Log the actual error
      return res.status(500).json({ message: "Error fetching users", error });
    }
  }


  async getCreators(req: Request, res: Response): Promise<Response> {
    try {
      const creators = await this.adminService.getCreators();
      return res.status(200).json(creators);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching creators", error });
    }
  }

  async blockUser(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      const user = await this.adminService.blockUser(userId);

      if (!user) return res.status(404).json({ message: "User not found" });

      return res.status(200).json({
        message: user.isBlocked ? "User blocked successfully" : "User unblocked successfully",
        user
      });
    } catch (error) {
      return res.status(500).json({ message: "Error updating user status", error });
    }
  }

  async blockCreator(req: Request, res: Response): Promise<Response> {
    try {
      const { creatorId } = req.params;
      const creator = await this.adminService.blockCreator(creatorId);

      if (!creator) return res.status(404).json({ message: "Creator not found" });

      return res.status(200).json({
        message: creator.isBlocked ? "Creator blocked successfully" : "Creator unblocked successfully",
        creator
      });
    } catch (error) {
      return res.status(500).json({ message: "Error updating creator status", error });
    }
  }



}

export default  AdminController;
