import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    blockLoginAttempt: {
      type: Boolean,
      required: false,
      default: false,
    },
    loginAttempts: {
      type: Number,
      required: false,
      default: 0,
    },
    lastFailedLogin: {
      type: Date,
      required: false,
    },
    forgottenPasswordOTP: {
      type: Number,
      required: false,
    },
    timeOTPRequested: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const { model } = mongoose;
const User = model("User", userSchema);

export default User;
