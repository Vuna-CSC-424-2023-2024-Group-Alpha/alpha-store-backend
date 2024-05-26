import express from "express";
import bcrypt from "bcrypt";

import User from "../model/user.model.js";
import sendSignupSuccessMail from "../utilities/Email/sendSignupSuccessMail.mail.js";
import sendForgottenPasswordOTPMail from "../utilities/Email/sendForgottenPasswordOTPMail.mail.js";
import { generateAuthToken } from "../utilities/handleAuthToken.js";
import otpGenerator from "../utilities/otpGenerator.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const {
      email,
      matricNumber,
      firstName,
      lastName,
      password,
      profilePicture,
    } = req.body;

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      matricNumber,
      firstName,
      lastName,
      password: hashedPassword,
      profilePicture,
    });

    const userDetails = await newUser.save();
    const authToken = generateAuthToken(userDetails._id);

    const fullName = `${userDetails.lastName} ${userDetails.firstName}`;
    await sendSignupSuccessMail(email, fullName);
    res.status(201).json({
      userDetails,
      authToken,
    });
  } catch (error) {
    console.log(
      `An unexpected error has occurred, please try again later: ${error}`
    );
    res.status(500).json({
      message: "An unexpected error has occurred, please try again later",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { matricNumber, password } = req.body;

    const userDetails = await User.findOne({ matricNumber });

    if (!userDetails) {
      return res.status(404).json({
        message: "No User Is Registered With This matricNumber Address",
      });
    }

    if (userDetails.blockLoginAttempt) {
      const timeSinceLastFailedLogin =
        Date.now() - userDetails.lastFailedLogin.getTime();
      const blockDuration = 60000; // 1 minute in milliseconds
      if (timeSinceLastFailedLogin < blockDuration) {
        return res.status(403).json({
          message: "Too many login attempts. Please try again later.",
          retryAfter: blockDuration - timeSinceLastFailedLogin,
        });
      } else {
        // Reset login attempts if the block duration has passed
        await User.updateOne(
          { matricNumber },
          { $set: { blockLoginAttempt: false, loginAttempts: 0 } }
        );
      }
    }

    const getHashedPasswordInDB = userDetails.password;

    const passwordIsCorrect = await bcrypt.compare(
      password,
      getHashedPasswordInDB
    );

    if (!passwordIsCorrect) {
      // Increment failed login attempts and update last failed login timestamp
      const maxLoginAttempts = 6;
      await User.updateOne(
        { matricNumber },
        { $inc: { loginAttempts: 1 }, $set: { lastFailedLogin: new Date() } }
      );

      // Block login if exceeded maximum attempts
      if (userDetails.loginAttempts + 1 >= maxLoginAttempts) {
        // +1 to include the current attempt
        await User.updateOne(
          { matricNumber },
          { $set: { blockLoginAttempt: true } }
        );
      }

      return res.status(401).json({
        message: "Incorrect Password!",
      });
    }

    // Reset login attempts to 0 on successful login
    await User.updateOne({ matricNumber }, { $set: { loginAttempts: 0 } });

    const authToken = generateAuthToken(userDetails._id);
    res.status(200).json({
      userDetails,
      authToken,
    });
  } catch (error) {
    console.log(
      `An unexpected error has occurred, please try again later ${error}`
    );
    res.status(500).json({
      message: "An unexpected error has occurred, please try again later",
    });
  }
});

router.post("/forgotten-password/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const userExists = await User.findOne({ email });

    if (!userExists) {
      return res.status(404).json({
        message:
          "Cannot reset password as no user is associated with this email.",
      });
    }

    const OTP = otpGenerator();
    userExists.forgottenPasswordOTP = OTP;
    userExists.timeOTPRequested = new Date();
    await userExists.save();

    const fullName = `${userExists.lastName} ${userExists.firstName}`;
    await sendForgottenPasswordOTPMail(email, fullName, OTP);
    res.status(200).json({
      message: "OTP sent",
    });
    console.log(fullName);
  } catch (error) {
    console.log(
      `An unexpected error has occurred, please try again later: ${error}`
    );
    res.status(500).json({
      message: "An unexpected error has occurred, please try again later",
    });
  }
});

router.patch("/change-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const userDetails = await User.findOne({ email });

    if (!userDetails) {
      return res.status(404).json({
        message: "No User Is Registered With This Email Address",
      });
    }

    const currentTime = new Date();
    const otpRequestTime = new Date(userDetails.timeOTPRequested);
    const otpValidityDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

    if (currentTime - otpRequestTime > otpValidityDuration) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    if (userDetails.forgottenPasswordOTP !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    userDetails.password = hashedPassword;
    userDetails.forgottenPasswordOTP = null;
    userDetails.timeOTPRequested = null;
    await userDetails.save();
    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(
      `An unexpected error has occurred, please try again later ${error}`
    );
    res.status(500).json({
      message: "An unexpected error has occurred, please try again later",
    });
  }
});

export default router;
