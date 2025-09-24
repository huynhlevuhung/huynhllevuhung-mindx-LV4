const User = require("../models/UserModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const allowedFields = ["fullname", "phone"];
  const updateData = {};
  allowedFields.forEach((field) => {
    if (req.body[field]) updateData[field] = req.body[field];
  });

  if (req.file) {
    updateData.avatar = req.file.filename;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  res.status(200).json({
    status: "success",
    data: { user: updatedUser },
  });
});

exports.updateAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Chưa chọn file avatar", 400));
  }

  const avatarFilename = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, {
    avatar: avatarPath,
  }).select("-password");

  res.status(200).json({
    status: "success",
    data: { user: updatedUser },
  });
});

////////////////////////////////////////////////////////////////////

// 📌 CREATE USER (Admin)
exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: { user: newUser },
  });
});




// 📌 GET ALL USERS
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});

// GET ONE USER (Admin)
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return next(new AppError("Không tìm thấy user", 404));
  }

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

// // UPDATE USER (Admin/User)
// exports.updateUser = catchAsync(async (req, res, next) => {
//   let targetUserId = req.params.id;

//   // Nếu không phải admin thì chỉ cho phép update chính mình
//   if (req.user.role !== "admin") {
//     if (req.params.id !== req.user.id) {
//       return next(new AppError("Bạn không có quyền cập nhật user khác", 403));
//     }

//     // Nếu là user thường -> chỉ cho phép sửa fullname, phone, avatar
//     const allowedFields = ["fullname", "phone"];
//     const updateData = {};

//     allowedFields.forEach((field) => {
//       if (req.body[field]) updateData[field] = req.body[field];
//     });

//     if (req.file) {
//       updateData.avatar = req.file.filename;
//     }

//     const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
//       new: true,
//       runValidators: true,
//     }).select("-password");

//     return res.status(200).json({
//       status: "success",
//       data: { user: updatedUser },
//     });
//   }

  

//   // Nếu là admin -> full quyền update
//   const updatedUser = await User.findByIdAndUpdate(targetUserId, req.body, {
//     new: true,
//     runValidators: true,
//   }).select("-password");

//   if (!updatedUser) {
//     return next(new AppError("Không tìm thấy user", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: { user: updatedUser },
//   });
// });

// UPDATE USER (Không phân quyền, ai cũng có thể update từ UserLayout)
exports.updateUser = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) {
    return next(new AppError("Không tìm thấy user", 404));
  }

  res.status(200).json({
    status: "success",
    data: { user: updatedUser },
  });
});

// DELETE USER (Admin)
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError("Không tìm thấy user", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});