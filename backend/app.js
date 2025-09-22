const express = require("express");
const userRouter = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const cors = require("cors");
const globalErrorHandle = require("./controllers/errorController");
const cookieParser = require("cookie-parser");
const path = require("path");
const AppError = require("./utils/appError");

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép không có origin (Postman, server-to-server, etc.)
      if (!origin) return callback(null, true);

      // Cho phép tất cả origin localhost
      if (origin.startsWith("http://localhost")) {
        return callback(null, true);
      }

      // Nếu không khớp thì reject
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/auth", authRoutes);

app.use(
  "/img/avatars",
  express.static(path.join(__dirname, "public/img/avatars"))
);

app.use((req, res, next) => {
  next(new AppError(`Không tìm thấy ${req.originalUrl} trên server này!`, 404));
});

app.use(globalErrorHandle);

module.exports = app;
