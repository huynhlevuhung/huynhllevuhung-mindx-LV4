import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

// AUTH
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

router.get("/me", authController.protect, authController.getMe);

export default router;
