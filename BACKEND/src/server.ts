import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoute"; 
import adminRoutes from "./routes/adminRoute"; 
import creatorRoutes from "./routes/creatorRoute";
import cookieParser from "cookie-parser";

import passport from "passport";
// import session from "express-session";

import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import "./config/passport"; // adjust the path as needed




dotenv.config();
const app = express();
app.use(passport.initialize());


///////////


const errorLogStream = fs.createWriteStream(path.join(__dirname, "../logs/error.log"), {
  flags: "a", 
});

morgan.token("error-message", (_req: Request, res: Response) => res.locals.errorMessage || "-");

app.use(
  morgan(':method :url :status :response-time ms - :error-message', {
    stream: errorLogStream,
    skip: (_req, res) => res.statusCode < 400, 
  })
);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.errorMessage = err.message; 
  next(err);
});


app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: err.message });
});
///////////////

app.use(helmet()); 
app.use(cors({ 
  origin: "http://localhost:3030", 
  credentials: true 
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log(" MongoDB Connected Successfully");
  } catch (error) {
    console.error(" MongoDB Connection Error:", error);
    process.exit(1);
  }
};

app.use((req, res, next) => {
  console.log(` [Backend] Incoming Request: ${req.method} ${req.url}`);
  next();
});


app.use("/users", userRoutes);
app.use("/admin", adminRoutes); 
app.use("/creator", creatorRoutes);



app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(" Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});



const PORT = process.env.PORT || 5001;
const startServer = async () => {
  await connectDB(); 
  app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
};

process.on("uncaughtException", (err) => {
  console.error(" Uncaught Exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.error(" Unhandled Rejection:", err);
  process.exit(1);
});

startServer();
