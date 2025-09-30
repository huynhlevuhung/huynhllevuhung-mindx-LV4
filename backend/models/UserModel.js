// models/UserModel.js
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Tên đăng nhập không được trống"],
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: [true, "Email không được trống"],
      lowercase: true,
      validate: [validator.isEmail, "Sai định dạng Email"],
    },

    password: {
      type: String,
      required: [true, "Mật khẩu không được trống"],
      minlength: [8, "Mật khẩu phải có ít nhất 8 ký tự"],
      match: [
        /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/,
        "Mật khẩu phải chứa ít nhất 1 chữ số và 1 ký tự đặc biệt",
      ],
      select: false,
    },

    fullname: { type: String },

    phone: { type: String },

    avatar: { type: String, default: "" }, // link Cloudinary

    avatarId: { type: String }, // 🆕 public_id Cloudinary (để xoá ảnh sau này)

    address: [{ type: String }],

    balance: { type: Number, default: 0 },

    rank: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum"],
      default: "bronze",
    },

    role: {
      type: String,
      enum: ["user", "seller", "shipper", "admin", "route manager"],
      default: "user",
    },

    isActive: { type: Boolean, default: true },

    otpReset: {
      code: String,
      expiresAt: Date,
      attemptCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// 📌 Middleware hash password trước khi save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.skipHash) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
