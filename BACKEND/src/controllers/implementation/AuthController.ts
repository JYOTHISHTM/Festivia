import { Request, Response } from "express";
import { IAuthController } from "../interface/IAuthController";
import AuthService from "../../services/implementation/AuthService";

//AuthController
 class AuthController implements IAuthController {

  async login(req: Request, res: Response): Promise<Response> {
    try {
        const { email, password, role } = req.body;

        const result = await AuthService.login(email, password, role);

        if (!result) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        console.log("🔹 Login Service Response:", result);

        const { token, refreshToken, user } = result;
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });

        if (role === "creator") {
            return res.json({ token, creator: { id: user.id, email: user.email, name: user.name } }); 
        }
        
        return res.json({ token, user: { id: user.id, email: user.email, name: user.name } }); 
    } catch (error: any) {
        console.error("❌ Server error:", error);
        return res.status(500).json({ error: error.message || "Server Error" });
    }
}

async signUp(req: Request, res: Response): Promise<Response> {
  try {
    const { name, email, password, role } = req.body;

    if (role !== "user" && role !== "creator") {
      return res.status(400).json({ success: false, error: "Invalid role" });
    }

    const result = await AuthService.register(name, email, password, role);

    return res.status(201).json({ success: true, message: result.message, data: result }); // ✅ Return added
  } catch (error) {
    return res.status(400).json({ success: false, error: (error as Error).message }); // ✅ Return added
  }
}
    
async verifyOTP(req: Request, res: Response): Promise<void> {
  try {
    const { email, otp, userType } = req.body; // userType: "user" | "creator"

    if (!["user", "creator"].includes(userType)) {
       res.status(400).json({ success: false, error: "Invalid user type" });
    }

    const result = await AuthService.verifyOTP(email, otp, userType);
    res.status(200).json({ success: true, message: result.message, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
}

async logout(req: Request, res: Response): Promise<Response> {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(400).json({ error: "No refresh token provided" });
    }

    const message = await AuthService.logout(refreshToken);
    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });

    return res.status(200).json({ message });
  } catch (error: any) {
    console.error("❌ Logout error:", error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
}

async resendOTP(req: Request, res: Response): Promise<Response> {
  try {
    const { email, type } = req.body;


    if (!email || !type || (type !== "user" && type !== "creator")) {
      return res.status(400).json({ success: false, message: "Invalid request data" });
    }

    const result = await AuthService.resendOTP(email, type);

    return res.status(200).json({ success: true, message: result.message });
  } catch (error: any) {
    console.error("❌ Error in resendOTP:", error);
    return res.status(400).json({ success: false, error: error.message });
  }
}

  async refreshToken(req: Request, res: Response): Promise<Response> {
    try {
      const { refreshToken } = req.cookies;
      const { type } = req.body; // Expect "user" or "creator"

      if (!refreshToken || !type) {
        console.log("❌ No refresh token or type found");
        return res.sendStatus(401);
      }

      const newAccessToken = await AuthService.refreshAccessToken(refreshToken, type);

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

  async sendOtp(req: Request, res: Response): Promise<void> {
    const { email ,type} = req.body;
    console.log("email and type from sendOtp",email,type);
    
    try {

      const result = await AuthService.sendOtp(email,type);
  
      res.status(200).json({
        success: true,
        message: result.message,
        otp: result.otp, // ✅ send OTP to frontend
      }); 
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
  
  async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp, type } = req.body;
      console.log("type from aauth contro",type);
  
      if (!type) {
        return res.status(400).json({ message: "Type is required (user/creator)" });
      }
  
      const isValid = await AuthService.verifyOtp(email, otp, type);
  
      if (!isValid) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
  
      return res.status(200).json({ message: "OTP verified successfully" });
    } catch (err) {
      console.error("❌ Error verifying OTP:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
  
  async resetPassword(req: Request, res: Response) {
    try {
      const { email, password, type } = req.body;
      console.log("everyhthign from resetPassword from auth controller",email,type);
      
      const result = await AuthService.resetPassword(email, password, type);
      res.status(200).json({ success: true, message: result });
    } catch (err: any) {
      console.error("❌ Error in Controller:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }


  async googleCallback(req: Request, res: Response): Promise<Response> {
    const user = req.user as {id:string;type:string}
    if (!user) {
      return res.status(401).json({ success: false, message: "Google authentication failed" });
    }

    // You can generate token here instead of session if needed
    return res.status(200).json({
      success: true,
      user,
      message: `Logged in successfully as ${user.type}`,
    });
  }
  
}

export default  AuthController;
