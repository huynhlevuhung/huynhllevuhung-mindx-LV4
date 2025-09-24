// controllers/userController.js
import User from "../models/UserModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// 📌 Lấy thông tin user hiện tại
const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

// 📌 Cập nhật thông tin cá nhân (fullname, phone, avatar)
const updateMe = catchAsync(async (req, res, next) => {
  const allowedFields = ["fullname", "phone"];
  const updateData = {};

  allowedFields.forEach((field) => {
    if (req.body[field]) updateData[field] = req.body[field];
  });

  if (req.file) updateData.avatar = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  res.status(200).json({
    status: "success",
    data: { user: updatedUser },
  });
});

// 📌 Chỉ cập nhật avatar
const updateAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Chưa chọn file avatar", 400));
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: req.file.filename },
    { new: true, runValidators: true }
  ).select("-password");

  res.status(200).json({
    status: "success",
    data: { user: updatedUser },
  });
});

// 📌 Tạo user (Admin)
const createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: { user: newUser },
  });
});

// 📌 Lấy danh sách user
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});

// 📌 Lấy 1 user theo ID
const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) return next(new AppError("Không tìm thấy user", 404));

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

// 📌 Update user (không phân quyền)
const updateUser = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) return next(new AppError("Không tìm thấy user", 404));

  res.status(200).json({
    status: "success",
    data: { user: updatedUser },
  });
});

// 📌 Xóa user
const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) return next(new AppError("Không tìm thấy user", 404));

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export default {
  getMe,
  updateMe,
  updateAvatar,
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
