
import { authenticateToken } from "../middleware/creator/authMiddleware";

import express from "express";
import CreatorController from "../controllers/implementation/CreatorController";
import multer from 'multer';
import checkBlocked from "../middleware/creator/checkBlocked";


const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/sign-up", CreatorController.signUp);
router.post("/verify-otp", CreatorController.verifyOTP);
router.post("/resend-otp", CreatorController.resendOTP);
// router.get('/event/:id', CreatorController.getEventById as any);
// router.get('/events', CreatorController.getAllEvents);

//
router.get("/event/:id", CreatorController.getEventById.bind(CreatorController));
router.get("/events", CreatorController.getAllEvents.bind(CreatorController));

//
router.post('/create-event',authenticateToken, upload.single('image'), CreatorController.createEvent as any);
router.get("/me", (req, res) => CreatorController.getCreator(req, res));

router.get("/profile-data", authenticateToken,checkBlocked, CreatorController.getProfile as any);
router.post("/login", (req, res) => CreatorController.login(req, res));

// router.post("/login", CreatorController.login);
router.post("/refresh-token", CreatorController.refreshToken as any);
// router.get("/logout", CreatorController.logout as any);
router.post("/logout", (req, res) => CreatorController.logout(req, res));

router.put("/update-profile", authenticateToken,checkBlocked, CreatorController.updateProfile);



export default router;
