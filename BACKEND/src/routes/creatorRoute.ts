
import express from "express";
import CreatorController from "../controllers/implementation/CreatorController";
import multer from 'multer';
import checkBlocked from "../middleware/creator/checkBlocked";
import AuthController from "../controllers/implementation/AuthController";
import ProfileController from "../controllers/implementation/ProfileController";
import EventController from "../controllers/implementation/EventController";
import { authenticateToken } from "../middleware/creator/authMiddleware";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const authController = new AuthController(); // ✅ Create an instance
const creatorController = new CreatorController(); // ✅ Create an instance
const eventController = new EventController(); // ✅ Create an instance
const profileController = new ProfileController(); // ✅ Create an instance

//AuthController
router.post("/sign-up", authController.signUp.bind(authController));
router.post("/verify-otp", authController.verifyOTP.bind(authController));
router.post("/resend-otp", authController.resendOTP.bind(authController));
router.post("/login", (req, res) => authController.login(req, res));////
router.post("/refresh-token", authController.refreshToken.bind(authController));
router.post("/logout", (req, res) => authController.logout(req, res));////


//EventController
router.get("/event/:id", eventController.getEventById.bind(eventController));
router.get("/events", eventController.getAllEvents.bind(eventController));


//CreatorController
router.post('/create-event',authenticateToken, upload.single('image'), creatorController.createEvent.bind(creatorController));
router.get("/me", (req, res) => creatorController.getCreator.bind(creatorController));



//ProfileController
router.get("/profile-data", authenticateToken,checkBlocked, profileController.getProfile.bind(profileController));
router.put("/update-profile", authenticateToken,checkBlocked, profileController.updateProfile.bind(profileController));





router.post("/send-otp", authController.sendOtp.bind(authController));
router.post("/verify-otp-forgot-password", authController.verifyOtp.bind(authController));
router.post("/reset-password", authController.resetPassword.bind(authController));


export default router;
