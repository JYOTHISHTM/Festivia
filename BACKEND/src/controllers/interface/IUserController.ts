import { Request, Response } from "express";

export interface IUserController {
  signUp(req: Request, res: Response): Promise<void>;
  verifyOTP(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<Response>;
  resendOTP(req: Request, res: Response): Promise<void>;
  getProfile(req: Request, res: Response): Promise<void>;
  getAllEvents(req: Request, res: Response): Promise<void>;
  getEventById(req: Request, res: Response): Promise<void>;
  updateProfile(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
}
