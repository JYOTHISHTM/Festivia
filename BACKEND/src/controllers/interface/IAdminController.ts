import { Request, Response } from "express";

export interface IAdminController {
  login(req: Request, res: Response): Promise<Response>;
  getUsers(req: Request, res: Response): Promise<Response>;
  getCreators(req: Request, res: Response): Promise<Response>;
  blockUser(req: Request, res: Response): Promise<Response>;
  blockCreator(req: Request, res: Response): Promise<Response>;
  logout(req: Request, res: Response): Promise<void>;

}
