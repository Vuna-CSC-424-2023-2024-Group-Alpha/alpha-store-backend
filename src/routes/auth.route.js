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
    const { email, firstName, lastName, password } = req.body;

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(409).json({
        message: "User With this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });

    const userDetails = await newUser.save();
    const authToken = generateAuthToken(userDetails._id);
    res.status(201).json({
      userDetails,
      authToken,
    });
    const fullName = `${userDetails.lastName} ${userDetails.firstName}`;
    await sendSignupSuccessMail(email, fullName);
  } catch (error) {
    console.log(
      `An unexpected error has occured, please try again later ${error}`
    );
    res.status(500).json({
      message: "An unexpected error has occured, please try again later",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userDetails = await User.findOne({ email });

    if (!userDetails) {
      return res.status(404).json({
        message: "No User Is Registered With This Email Address",
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
          { email },
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
        { email },
        { $inc: { loginAttempts: 1 }, $set: { lastFailedLogin: new Date() } }
      );

      // Block login if exceeded maximum attempts
      if (userDetails.loginAttempts + 1 >= maxLoginAttempts) {
        // +1 to include the current attempt
        await User.updateOne({ email }, { $set: { blockLoginAttempt: true } });
      }

      return res.status(401).json({
        message: "Incorrect Password!",
      });
    }

    // Reset login attempts to 0 on successful login
    await User.updateOne({ email }, { $set: { loginAttempts: 0 } });

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
          "An Error has occured no can't reset password as no user is associated with this mail",
      });
    }
    const OTP = otpGenerator();
    userExists.forgottenPasswordOTP = OTP;
    userExists.timeOTPRequested = new Date();
    await userExists.save();
    const fullName = `${userExists.lastName} ${userExists.firstName}`;
    res.status(200).json({
      message: "OTP sent",
    });
    console.log(fullName);
    await sendForgottenPasswordOTPMail(email, fullName, OTP);
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
