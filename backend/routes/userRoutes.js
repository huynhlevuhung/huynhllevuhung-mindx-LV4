import express from "express";
import authController from "../controllers/authController.js";
import userController from "../controllers/userController.js";
import uploadAvatar from "../middlewares/uploadAvatar.js";

const router = express.Router();

// USER PROFILE
router
  .route("/me")
  .get(authController.protect, userController.getMe)
  .patch(
    authController.protect,
    uploadAvatar.single("avatar"),
    userController.updateMe
  );

// ADMIN CRUD USERS
router.use(authController.protect);
router.use(authController.restrictTo("admin"));

router.get("/stats/count-non-admins", userController.countNonAdmins);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
