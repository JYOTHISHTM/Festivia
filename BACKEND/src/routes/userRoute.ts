import { Router } from "express";
import UserController from "../controllers/implementation/UserController";
import { authenticateToken } from "../middleware/user/authMiddleware";
import CheckUserBlocked from "../middleware/user/CheckUserBlocked";
import AuthController from "../controllers/implementation/AuthController";
import ProfileController from "../controllers/implementation/ProfileController";
import EventController from "../controllers/implementation/EventController";
import passport from 'passport'
import jwt from "jsonwebtoken";
import User from "../models/User";
import { RequestHandler } from "express";


const router = Router();
const authController = new AuthController();
const eventController = new EventController();
const profileController = new ProfileController();



//UserController
router.get("/profile-data", authenticateToken, CheckUserBlocked as RequestHandler, UserController.getUser as any);


//AuthController
router.post("/register", authController.signUp.bind(authController));
router.post("/verify-otp", authController.verifyOTP.bind(authController));
router.post("/resend-otp", authController.resendOTP.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post("/refresh-token", authController.refreshToken.bind(authController));
router.get("/logout", authController.logout.bind(authController));


//EventController
router.get('/public-events', eventController.getAllEvents.bind(eventController));
router.get('/event/:id', eventController.getEventById.bind(eventController));


//ProfileController
router.put("/update-profile", authenticateToken, CheckUserBlocked as RequestHandler, profileController.updateProfile.bind(profileController) as RequestHandler)


///////////////////////////////////////////


router.post("/send-otp", authController.sendOtp.bind(authController));
router.post("/verify-otp-forgot-password", authController.verifyOtp.bind(authController));
router.post("/reset-password", authController.resetPassword.bind(authController));

///////////////////



// user route 
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login/failed" }),
  (req, res) => {
    const user: any = req.user;

    if (!user || !user._id) {
      return res.redirect(`${process.env.FRONTEND_URL}/login/failed`);
    }

    // Generate both tokens
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "10m" });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "15d" });

    // Set the refresh token as an HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });

    // Redirect to frontend with access token in query
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success`);
  })

  router.get("/oauth-user", async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.status(401).json({ message: "No refresh token found" });
  
      const refreshSecret = process.env.JWT_REFRESH_SECRET;
      if (!refreshSecret) return res.status(500).json({ message: "JWT refresh secret not configured" });
  
      const decoded = jwt.verify(refreshToken, refreshSecret) as { id: string };
  
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) return res.status(500).json({ message: "JWT secret not configured" });
  
      const newAccessToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "10m" });
  
      res.json({ user, token: newAccessToken });
    } catch (error) {
      console.error("OAuth user fetch error:", error);
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
  });
  
  




  
export default router;
