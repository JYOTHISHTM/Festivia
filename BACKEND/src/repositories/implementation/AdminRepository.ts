import { AdminModel } from "../../models/Admin";
import { IAdmin } from "../../models/Admin";
import { IAdminRepository } from "../interface/IAdminRepository";

class AdminRepository implements IAdminRepository {
  async findByUsername(username: string): Promise<IAdmin | null> {
    return await AdminModel.findOne({ username, isAdmin: true }).lean();
  }
  async findByRefreshToken(refreshToken: string) {
    return await AdminModel.findOne({ refreshToken });
  }

  async updateRefreshToken(adminId: string, refreshToken: string): Promise<void> {
    await AdminModel.updateOne({ _id: adminId }, { refreshToken });
  }
  
  async clearRefreshToken(adminId: string): Promise<void> { // ✅ Logout-specific
    await AdminModel.updateOne({ _id: adminId }, { refreshToken: "" });
  }
}

export default new AdminRepository();
