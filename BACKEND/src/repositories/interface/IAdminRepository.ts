import { IAdmin } from "../../models/Admin";

export interface IAdminRepository {
  findByUsername(username: string): Promise<IAdmin | null>;
  findByRefreshToken(refreshToken: string): Promise<IAdmin | null>;
  updateRefreshToken(adminId: string, refreshToken: string): Promise<void>; // ✅ Fix
  clearRefreshToken(adminId: string): Promise<void>; // ✅ New method

}
