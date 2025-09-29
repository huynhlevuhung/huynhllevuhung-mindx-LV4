import express from "express";
import authController from "../controllers/authController.js";

import userController from "../controllers/userController.js";
import uploadAvatar from "../middlewares/uploadAvatar.js";
console.log("authController:", authController);
const router = express.Router();

// ================= AUTH =================
// Signup, verify OTP, login, forgot/reset password
router.post("/signup", authController.signup);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);
router.post("/login", authController.login);

router.post("/forgot-password", authController.forgotPassword);
router.post("/resend-otp-forgot-password", authController.resendOtpForgotPassword);
router.post("/verify-forgot-password", authController.verifyForgotPassword);
router.post(
  "/reset-password",
  authController.verifyResetTokenCookie,
  authController.resetPassword
);

// ================= USER PROFILE =================
// Lấy thông tin hiện tại
router
  .route("/me")
  .get(authController.protect, userController.getMe)
  .patch(
    authController.protect,
    uploadAvatar.single("avatar"), // upload avatar
    userController.updateMe
  );

// ================= ADMIN CRUD USERS =================
// Chỉ admin mới được CRUD user
router.use(authController.protect);
router.use(authController.restrictTo("admin"));
router.get(
  "/stats/count-non-admins",
  authController.protect,
  authController.restrictTo("admin"),
  userController.countNonAdmins
);


router
  .route("/")
  .get(userController.getAllUsers)   // GET all users
  .post(userController.createUser);  // CREATE user

router
  .route("/:id")
  .get(userController.getUser)       // GET user by ID
  .patch(userController.updateUser)  // UPDATE user
  .delete(userController.deleteUser); // DELETE user

export default router;
