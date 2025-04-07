

import { Request, Response } from "express";


export interface IEventController{
    getEventById(req: Request, res: Response): Promise<Response>;
    getAllEvents(req: Request, res: Response): Promise<Response>;
}