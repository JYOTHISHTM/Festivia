import { Response } from "express";
import ProfileService from "../../services/implementation/ProfileService";
import { AuthRequest, IProfileController } from "../interface/IProfileController";

class ProfileController implements IProfileController {
  
  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      let profileId: string = "";
      let profileType: "user" | "creator";

      if (req.user && req.user.id) {
        profileId = req.user.id;
        profileType = "user";
      } else if (req.creator && req.creator.id) {
        profileId = req.creator.id;
        profileType = "creator";
      } else {
        console.log("❌ Profile ID not found");
        res.status(401).json({ message: "Profile ID not found" });
        return;
      }

      console.log(`✅ Updating profile for ${profileType.toUpperCase()} ID:`, profileId);
      console.log("📝 Update request body:", JSON.stringify(req.body, null, 2));

      const updatedProfile = await ProfileService.updateProfile(profileType, profileId, req.body);

      if (!updatedProfile) {
        console.log(`❌ ${profileType.toUpperCase()} not found or not updated`);
        res.status(404).json({ message: `${profileType.toUpperCase()} not found` });
        return;
      }

      console.log("✅ Profile updated successfully:", updatedProfile);
      res.json(updatedProfile);
    } catch (error: any) {
      console.error("❌ Server Error:", error.message);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const creatorId = req.creator?.id;
      const userId = req.user?.id;

      if (!creatorId && !userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const type = creatorId ? "creator" : "user";
      const id = creatorId || userId;
      const profile = await ProfileService.getProfileById(id, type);

      if (!profile) {
        res.status(404).json({ message: `${type} not found` });
        return;
      }

      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
  }
}

export default ProfileController;
