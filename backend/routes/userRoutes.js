import express from "express";
import authController from "../controllers/authController.js";
import userController from "../controllers/userController.js";
import uploadAvatar from "../middlewares/uploadAvatar.js";

const router = express.Router();

// ================= AUTH =================
router.get("/", authController.getAllUsers);

router.post("/signup", authController.signup);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);

router.post("/login", authController.login);

router.post("/forgot-password", authController.forgotPassword);
router.post(
  "/resend-otp-forgot-password",
  authController.resendOtpForgotPassword
);
router.post("/verify-forgot-password", authController.verifyForgotPassword);

router.post(
  "/reset-password",
  authController.verifyResetTokenCookie,
  authController.resetPassword
);

router
  .route("/me")
  .get(authController.protect, userController.getMe)
  .patch(
    authController.protect,
    uploadAvatar.single("avatar"),
    userController.updateMe
  );

// ================= ADMIN CRUD =================
// Nếu muốn bảo vệ admin:
// router.use(authController.protect, authController.restrictTo("admin"));

router
  .route("/")
  .get(userController.getAllUsers)    // GET /api/users
  .post(userController.createUser);   // POST /api/users

router
  .route("/:id")
  .get(userController.getUser)        // GET /api/users/:id
  .patch(userController.updateUser)   // PATCH /api/users/:id
  .delete(userController.deleteUser); // DELETE /api/users/:id

export default router;
