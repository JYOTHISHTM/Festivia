import { Router } from "express";
import AdminController from "../controllers/implementation/AdminController";
import AdminService from "../services/implementation/AdminService";
import UserRepository from "../repositories/implementation/UserRepository";
import CreatorRepository from "../repositories/implementation/CreatorRepository";
import AdminRepository from "../repositories/implementation/AdminRepository";
import { authenticateToken } from "../middleware/admin/authMiddleware";


const router = Router();
const adminService = new AdminService(UserRepository,CreatorRepository,AdminRepository); 
const adminController = new AdminController(adminService); 

router.post("/login", adminController.login.bind(adminController));
router.get("/users", adminController.getUsers.bind(adminController));
router.get("/creator", adminController.getCreators.bind(adminController));
router.put("/toggle-block/:userId",authenticateToken, adminController.blockUser.bind(adminController));
router.put("/toggle-block-creator/:creatorId",authenticateToken,adminController.blockCreator.bind(adminController));
router.post("/logout", adminController.logout.bind(adminController));

export default router;
