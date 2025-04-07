import { Request, Response } from "express";
import { IUser } from "../../models/User";
import { ICreator } from "../../models/Creator";

export interface AuthRequest extends Request {
  user?: IUser;
  creator?: ICreator;
}

export interface IProfileController {
  updateProfile(req: AuthRequest, res: Response): Promise<void>;
  getProfile(req: AuthRequest, res: Response): Promise<void>;
}
