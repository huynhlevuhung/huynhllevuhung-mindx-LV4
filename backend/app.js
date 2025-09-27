// app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Routers
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import storeRouter from "./routes/storeRoutes.js";
import productVariantsRouter from "./routes/productVariantsRoutes.js";
import colorsRouter from "./routes/colorsRoutes.js";
import sizesRouter from "./routes/sizesRoutes.js";
import imagesRouter from "./routes/imagesRoutes.js";
import billsRouter from "./routes/billsRoutes.js";
import orderItemsRouter from "./routes/orderItemsRoutes.js";
import cartsRouter from "./routes/cartsRoutes.js";
import cartItemsRouter from "./routes/cartItemsRoutes.js";
import addressesRouter from "./routes/addressesRoutes.js";
import areasRouter from "./routes/areasRoutes.js";
import promotionsRouter from "./routes/promotionRoutes.js";
import tagsRouter from "./routes/tagsRoutes.js";

// Utils
import globalErrorHandle from "./controllers/errorController.js";
import AppError from "./utils/appError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ------------------- Middleware -------------------

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

// Static folder for avatars/images
app.use(
  "/img/avatars",
  express.static(path.join(__dirname, "public/img/avatars"))
);
app.use(
  "/img/products",
  express.static(path.join(__dirname, "public/img/products"))
);

// ------------------- Routes -------------------

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/stores", storeRouter);
app.use("/api/product-variants", productVariantsRouter);
app.use("/api/colors", colorsRouter);
app.use("/api/sizes", sizesRouter);
app.use("/api/images", imagesRouter);
app.use("/api/bills", billsRouter);
app.use("/api/order-items", orderItemsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/cart-items", cartItemsRouter);
app.use("/api/addresses", addressesRouter);
app.use("/api/areas", areasRouter);
app.use("/api/promotions", promotionsRouter);
app.use("/api/tags", tagsRouter);

// ------------------- 404 Not Found -------------------
app.use((req, res, next) => {
  next(new AppError(`Không tìm thấy ${req.originalUrl} trên server này!`, 404));
});

// ------------------- Global Error Handler -------------------
app.use(globalErrorHandle);

export default app;
