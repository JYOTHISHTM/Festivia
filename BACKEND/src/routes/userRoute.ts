import { Router } from "express";
import UserController from "../controllers/implementation/UserController";
import { authenticateToken } from "../middleware/user/authMiddleware";
import CheckUserBlocked from "../middleware/user/CheckUserBlocked";



const router = Router();

router.get("/profile-data",authenticateToken,CheckUserBlocked, UserController.getUser as any); 


router.post("/register", UserController.signUp); 
router.post("/verify-otp", UserController.verifyOTP); 
router.post("/resend-otp", UserController.resendOTP); 

router.get('/public-events', UserController.getAllEvents);
router.get('/event/:id', UserController.getEventById as any );


router.post("/login", UserController.login);
router.post("/refresh-token", UserController.refreshToken as any);
router.get("/logout", UserController.logout as any);
router.put("/update-profile", authenticateToken,CheckUserBlocked, UserController.updateProfile);




export default router;
