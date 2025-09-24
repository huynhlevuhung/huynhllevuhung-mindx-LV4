// app.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import userRouter from "./routes/userRoutes.js";
//import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";



import globalErrorHandle from "./controllers/errorController.js";
import AppError from "./utils/appError.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS linh hoạt
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin.startsWith("http://localhost")) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// MongoDB connect
//mongoose.connect(process.env.MONGO_URL);

// Routes

//console.log("userRouter:", userRouter);
//console.log("productRouter:", productRouter);
app.use("/api/users", userRouter);
//app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);


// static
app.use(
  "/img/avatars",
  express.static(path.join(__dirname, "public/img/avatars"))
);

// 404
app.use((req, res, next) => {
  next(new AppError(`Không tìm thấy ${req.originalUrl} trên server này!`, 404));
});

// error handler
app.use(globalErrorHandle);

export default app;
