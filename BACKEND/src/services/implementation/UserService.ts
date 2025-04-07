
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { IUserService } from "../interface/IUserService";  
import UserRepository from "../../repositories/implementation/UserRepository";
dotenv.config();

class UserService implements IUserService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }



}

export default new UserService();



