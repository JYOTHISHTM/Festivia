import { Request, Response } from "express";

export interface ICreatorController {
  updateProfile(req: Request, res: Response): Promise<void>;
  signUp(req: Request, res: Response): Promise<void>;
  verifyOTP(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<Response>;
  resendOTP(req: Request, res: Response): Promise<void>;
  getProfile(req: Request, res: Response): Promise<void>;
  getEventById(req: Request, res: Response): Promise<Response>;
  getAllEvents(req: Request, res: Response): Promise<void>;
  createEvent(req: Request, res: Response): Promise<Response>;
  refreshToken(req: Request, res: Response): Promise<Response>;
  logout(req: Request, res: Response): Promise<Response>;
  getCreator(req: Request, res: Response): Promise<Response>;
}
