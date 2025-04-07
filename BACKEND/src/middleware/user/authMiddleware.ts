

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1] || "";
  if (!token) return res.sendStatus(401); 

  jwt.verify(token, process.env.JWT_SECRET!, (err, decodedUser) => {
    if (err) return res.sendStatus(403); 
    (req as any).user = decodedUser; 
    next();
  });
};

