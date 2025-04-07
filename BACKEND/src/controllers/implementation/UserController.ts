import { Request, Response } from "express";
import { IUserController } from "../interface/IUserController";
import { IUserService } from "../../services/interface/IUserService";  
import UserService from "../../services/implementation/UserService";  
import User from "../../models/User";

interface AuthRequest extends Request {
  user?: { id: string }; 
}
class UserController implements IUserController {

    private userService: IUserService;

    constructor(userService: IUserService) {
        this.userService = userService;
      }
      

     async getUser  (req: Request, res: Response) {
      try {
        const user = await User.findById((req as any).user.id).select("-password");
        if (!user) return res.sendStatus(404);
        res.json(user);
      } catch (error) {
        res.status(500).json({ error: "Server Error" });
      }
    };
  
  
}


const userController = new UserController(UserService);
export default userController;
