import {
  registerUserValidator,
  verifyUserEmailValidator,
  loginUserValidator,
  forgotUserPasswordValidator,
  resetUserPasswordValidator,
  changeUserRoleValidator,
} from "../validators/users.js";
import { UserModel } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/mailing.js";
import config from "../utils/config.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// User registration controller
export const registerUser = async (req, res) => {
  // Validate user input
  const { error, value } = registerUserValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }

  // Check if email already exists in the database
  const existingUser = await UserModel.findOne({ email: value.email });
  if (existingUser) {
    return res.status(422).json("User already exists!");
  }

  // Hash plaintext password
  const hashedPassword = await bcrypt.hash(value.password, 12);

  // Create user record
  const user = await UserModel.create({
    ...value,
    password: hashedPassword,
  });

  //creating a token
  const verificationToken = crypto.randomBytes(16).toString("hex");
  const tokenExpires = Date.now() + 1000 * 60 * 60;

  // Assign and save to the user
  user.verificationToken = verificationToken;
  user.verificationTokenExpires = tokenExpires;
  await user.save();

  // Send email verification to user via their email address
  await sendEmail({
    from: config.SMPT_EMAIL,
    to: user.email,
    subject: "Verify your SmartMeal account",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      padding: 20px;
      color: #333;
    }
    .email-container {
      max-width: 600px;
      margin: auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    h2 {
      color: #333;
    }
    .button {
      display: inline-block;
      padding: 12px 25px;
      background-color: #007bff;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
      text-align: center;
      border: none;
    }
    .button:hover {
      background-color: #0056b3;
      color: #ffffff !important;
    }
    .fallback-url {
      margin-top: 20px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <h2>Hello ${user.firstname},</h2>
    <p>Welcome to SmartMeal! We’re excited to have you on board.</p>
    <p>To get started, please verify your email address by clicking the button below:</p>

    <!-- Verification button -->
    <a href="https://smartmealz.netlify.app/verify-email?token=${verificationToken}" class="button">Verify Email Address</a>

    <!-- Expiry Note -->
    <p class="expiry-note">Note: This verification link will expire in an hour.</p>

    <p class="fallback-url">
      If you’re having trouble with the button above, copy and paste the URL below into your web browser:
    </p>
    <p>
      <a href="https://smartmealz.netlify.app/verify-email?token=${verificationToken}">https://smartmealz.netlify.app/verify-email?token=${verificationToken}</a>
    </p>

    <p>Cheers,</p>
    <p>- SmartMeal</p>
  </div>
</body>
</html>
`,
  });

  res.status(201).json({
    message:
      "Registration successful. Please check your email to verify your account.",
  });
};

//User email verification controller
export const verifyUserEmail = async (req, res) => {
  // Validate user input
  const { error, value } = verifyUserEmailValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }

  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Verification token is required!" });
  }

  //Query the database for the email verification token
  const user = await UserModel.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() },
  });

  //Checking status of the email verification token retrieved from database
  if (!user) {
    return res.status(401).json({ message: "Invalid or expired token!" });
  }

  if (user.isVerified) {
    return res.status(409).json({ message: "User is already verified!" });
  }

  //Update the user verification status in database
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;

  await user.save();

  // You can also redirect them to a frontend success page if you'd like
  return res.status(200).json({ message: "Email successfully verified." });
};

//User login controller
export const loginUser = async (req, res) => {
  // Validate user input
  const { error, value } = loginUserValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }
  //Find matching user record in database
  const user = await UserModel.findOne({ email: value.email }).select(
    "+password"
  );

  if (!user) {
    return res.status(404).json({ message: "No users found!" });
  }

  //Compare incoming password with saved password
  const correctPassword = await bcrypt.compare(value.password, user.password);
  if (!correctPassword) {
    return res.status(401).json({ message: "Invalid Credentials!" });
  }

  //User verification status check
  if (!user.isVerified) {
    return res.status(400).json({
      message:
        "Your account is not verified yet. Please check your email for the verification link.",
    });
  }

  //Generate access token for user
  const accessToken = jwt.sign({ id: user.id }, config.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });

  res.status(200).json({
    accessToken,
    message: "User logged in successfully",
    user: { email: user.email },
  });
};

//Forgot Password Controller
export const forgotUserPassword = async (req, res) => {
  // Validate user input
  const { error, value } = forgotUserPasswordValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }
  //Find matching user record in database
  const user = await UserModel.findOne({ email: value.email });

  //creating a token
  const resetPasswordToken = crypto.randomBytes(16).toString("hex");
  const resetPasswordTokenExpires = Date.now() + 1000 * 60 * 60;

  // Assign and save to the user
  user.forgotPasswordToken = resetPasswordToken;
  user.forgotPasswordTokenExpires = resetPasswordTokenExpires;
  await user.save();

  if (user) {
    // Send forgot password verification email to user via their email address
    await sendEmail({
      from: config.SMPT_EMAIL,
      to: user.email,
      subject: "Reset your SmartMeal password",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      padding: 20px;
      color: #333;
    }
    .email-container {
      max-width: 600px;
      margin: auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    h2 {
      color: #333;
    }
    .button {
      display: inline-block;
      padding: 12px 25px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
      text-align: center;
    }
    .button:hover {
      background-color: #0056b3;
    }
    .fallback-url {
      margin-top: 20px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <h2>Hello ${user.firstname},</h2>
    <p>Need a new password? No worries. Click the button below to reset and choose a new one.</p>
    <a href="https://smartmealz.netlify.app/reset-password?token=${resetPasswordToken}"class="button">Reset Password</a>
    <p class="fallback-url">
      If the button above doesn't work, you can copy and paste this link into your browser:
    </p>
    <p>
      <a href="https://smartmealz.netlify.app/reset-password?token=${resetPasswordToken}">https://smartmealz.netlify.app/reset-password?token=${resetPasswordToken}</a>
    </p>
    <p>Didn’t request this change? You can ignore this email and get back to business as usual.</p>
    <p>Cheers,</p>
    <p>- SmartMeal Team</p>
  </div>
</body>
</html>`,
    });

    res.status(200).json({
      message:
        "If there's a SmartMeal account connected to this email address, we’ll email you password reset instructions. If you don’t receive the email, please try again and make sure you enter the email address associated with your SmartMeal account.",
    });
  }
};

//Reset password email verification
export const resetUserPassword = async (req, res) => {
  // Validate user input
  const { error, value } = resetUserPasswordValidator.validate({
    ...req.body,
    token: req.query.token,
  });
  if (error) {
    return res.status(422).json(error.message);
  }
  const { newPassword } = value;
  const { token } = req.query;

  const user = await UserModel.findOne({
    forgotPasswordToken: token,
    forgotPasswordTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = await bcrypt.hash(newPassword, 12);
  user.forgotPasswordToken = undefined;
  user.forgotPasswordTokenExpires = undefined;

  await user.save();

  res
    .status(200)
    .json({ message: "Password reset successful. You can now log in." });
};

//Change User Role Controller
export const changeUserRole = async (req, res) => {
  // Validate user input
  const { error, value } = changeUserRoleValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }

  //check if user exists
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "No users found!" });
  }

  //Update user role in database
  const result = await UserModel.findByIdAndUpdate(req.params.id, value, {
    new: true,
  });
  // //return response
  res.status(200).json(result);
};
