import { IAdminService } from "../interface/IAdminService";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { ICreatorRepository } from "../../repositories/interface/ICreatorRepository";
import { IAdminRepository } from "../../repositories/interface/IAdminRepository";
import { IAdmin } from "../../models/Admin"; // Ensure correct type import
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken"; // Ensure correct import

export default class AdminService implements IAdminService {
  private userRepository: IUserRepository;
  private creatorRepository: ICreatorRepository;
  private adminRepository: IAdminRepository;

  constructor(
    userRepository: IUserRepository,
    creatorRepository: ICreatorRepository,
    adminRepository: IAdminRepository
  ) {
    this.userRepository = userRepository;
    this.creatorRepository = creatorRepository;
    this.adminRepository = adminRepository;
  }



  async refreshToken(refreshToken: string): Promise<string | null> {
    if (!refreshToken) {
      console.log("❌ No refresh token found");
      return null;
    }
  
    const admin = await this.adminRepository.findByRefreshToken(refreshToken);
    if (!admin) {
      console.log("❌ Refresh token not found in database");
      return null;
    }
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
  
      if (!decoded || typeof decoded !== "object") {
        throw new Error("Invalid token payload");
      }
  
      // ✅ Explicitly extract `id` as a string
      const adminId = decoded.id as string | undefined;
  
      if (!adminId) {
        throw new Error("Invalid token payload (missing ID)");
      }
  
      const newAccessToken = jwt.sign({ id: adminId }, process.env.JWT_SECRET!, { expiresIn: "15m" });
  
      return newAccessToken;
    } catch (error) {
      console.log("❌ Invalid or expired refresh token");
      await this.adminRepository.updateRefreshToken(admin._id.toString(), "");
      return null;
    }
  }
  

  async login(username: string, password: string): Promise<{ 
    token: string; 
    refreshToken: string; 
    admin: { _id: string; username: string } 
  }> {
    console.log("🛠️ Login attempt for username:", username);

    // ✅ Explicitly define type to avoid 'unknown' error
    const admin: IAdmin | null = await this.adminRepository.findByUsername(username);
    if (!admin) {
      console.log("❌ Admin not found for username:", username);
      throw new Error("Invalid credentials");
    }

    console.log("✅ Admin found:", admin.username);

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      console.log("❌ Invalid password attempt for username:", username);
      throw new Error("Invalid credentials");
    }

    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      console.error("❌ Missing JWT secret keys!");
      throw new Error("Server Error: Missing JWT secrets");
    }

    // ✅ Type assertion ensures _id is treated as a string
    const adminId: string = admin._id.toString();
    
    const token = jwt.sign({ id: adminId }, process.env.JWT_SECRET, { expiresIn: "10m" });
    const refreshToken = jwt.sign({ id: adminId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "15d" });

    console.log("🔑 Generated JWT Token:", token);
    console.log("🔄 Generated Refresh Token:", refreshToken);

    await this.adminRepository.updateRefreshToken(adminId, refreshToken);
    console.log("💾 Refresh Token Updated");

    return { 
      token, 
      refreshToken, 
      admin: { _id: adminId, username: admin.username } // ✅ Ensures correct return type
    };
  }


////////////////////////


async logout(refreshToken: string): Promise<void> {
  if (!refreshToken) {
    console.log("❌ No refresh token found");
    return;
  }

  const admin = await this.adminRepository.findByRefreshToken(refreshToken);
  if (!admin) {
    console.log("❌ Refresh token not found in database");
    return;
  }

  await this.adminRepository.clearRefreshToken(admin._id.toString());
}
  async getUsers(): Promise<any> {
    return await this.userRepository.findAll();
  }

  async getCreators(): Promise<any> {
    return await this.creatorRepository.findAll();
  }

  async blockUser(userId: string): Promise<any> {
    return await this.userRepository.toggleBlock(userId);
  }

  async blockCreator(creatorId: string): Promise<any> {
    return await this.creatorRepository.toggleBlock(creatorId);
  }


  
}
