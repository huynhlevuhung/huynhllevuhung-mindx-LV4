// models/TempUserModel.js
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const tempUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Tên đăng nhập không được trống"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email không được trống"],
      unique: true,
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
    passwordConfirm: {
      type: String,
      required: [true, "Vui lòng xác nhận lại mật khẩu"],
      select: false,
      validate: {
        validator: function (el) {
          return this.isNew ? el === this.password : true;
        },
        message: "Mật khẩu xác nhận không khớp",
      },
    },

    // ✅ Đồng bộ thêm các field từ UserModel
    fullname: { type: String },
    phone: { type: String },
    avatar: { type: String, default: "" },
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

    // ✅ OTP cho xác thực
    otp: { type: String, required: true },
    otpExpires: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index
    },
  },
  { timestamps: true }
);

// 📌 Middleware hash password trước khi save
tempUserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.skipHash) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // không lưu confirm
  next();
});

const TempUser = mongoose.model("TempUser", tempUserSchema);
export default TempUser;
