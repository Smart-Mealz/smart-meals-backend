import {
  registerUserValidator,
  verifyUserEmailValidator,
  loginUserValidator,
  changeUserRoleValidator,
} from "../validators/users.js";
import { UserModel } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/mailing.js";
import config from "../utils/config.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

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
    return res.status(422).json("User already exists");
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
  const tokenExpires = Date.now() + 1000 * 60 * 60; // 1 hour expiry

  // Assign and save to the user
  user.verificationToken = verificationToken;
  user.verificationTokenExpires = tokenExpires;
  await user.save();

  // Send email to user
  await sendEmail({
    from: config.SMPT_EMAIL,
    to: user.email,
    subject: "Verify your MealsBest account", // Email subject
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
    <p>Welcome to MealsBest! We’re excited to have you on board.</p>
    <p>To get started, please verify your email address by clicking the button below:</p>

    <!-- Verification button -->
    <a href="http://localhost:3000/api/v1/users/verify-email?token=${verificationToken}" class="button">Verify Email Address</a>

    <!-- Expiry Note -->
    <p class="expiry-note">Note: This verification link will expire in an hour.</p>

    <p class="fallback-url">
      If you’re having trouble with the button above, copy and paste the URL below into your web browser:
    </p>
    <p>
      <a href="http://localhost:3000/api/v1/users/verify-email?token=${verificationToken}">http://localhost:3000/api/v1/users/verify-email?token=${verificationToken}</a>
    </p>

    <p>Cheers,</p>
    <p>- MealsBest</p>
  </div>
</body>
</html>
`, // This is the HTML email template above
  });

  res.status(201).json({
    message:
      "Registration successful. Please check your email to verify your account.",
  });

  // https://yourapp.com/auth/verify-email/${verificationToken}?redirectTo=https%3A%2F%2Fyourapp.com%2Flogin">https://yourapp.com/auth/verify-email/${verificationToken}?redirectTo=https%3A%2F%2Fyourapp.com%2Flogin
  // Send response
  // res.status(201).json({
  //   message:
  //     "Check your email, your user verification token has been sent successfully",
  // });
};

// export const VerifyNewUserEmail = async (req, res) => {
//   const { error, value } = verifyUserEmailValidator.validate(req.body);
//   if (error) {
//     return res.status(400).json(error);
//   }

//   const { email, verificationToken } = value;

//   const user = await User.findOne({ email });
//   if (!user) {
//     return res.status(404).json({ message: "User not found!" });
//   }

//   if (user.isVerified) {
//     return res
//       .status(400)
//       .json({ message: "Your account is already verified. You can log in." });
//   }

//   if (!user.verificationToken || user.verificationToken !== verificationToken) {
//     return res.status(400).json({ message: "Invalid token" });
//   }

//   // Optional: if you saved an expiry date
//   if (
//     user.verificationTokenExpires &&
//     user.verificationTokenExpires < Date.now()
//   ) {
//     return res.status(400).json({
//       message:
//         "Sorry, your verification token has expired. Please request a new one.",
//     });
//   }

//   user.isVerified = true;
//   user.verificationTokenExpires = undefined; // Invalidate
//   user.tokenExpires = undefined;
//   await user.save();

//   return res.status(200).json({
//     message: "Your account has been successfully verified. You may now log in.",
//   });
// };

export const verifyUserEmail = async (req, res) => {
  // Validate user input
  const { error, value } = verifyUserEmailValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }

  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Verification token is required" });
  }

  const user = await UserModel.findOne({ verificationToken: token });

  if (!user) {
    return res.status(404).json({ message: "Invalid or expired token" });
  }

  if (
    user.verificationTokenExpires &&
    user.verificationTokenExpires < Date.now()
  ) {
    return res.status(400).json({
      message:
        "Sorry, your verification token has expired. Please request a new one.",
    });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: "Account is already verified" });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;

  await user.save();

  // You can also redirect them to a frontend success page if you'd like
  return res.status(200).json({ message: "Email successfully verified" });
};

export const loginUser = async (req, res) => {
  const { error, value } = loginUserValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }

  const user = await UserModel.findOne({ email: value.email }).select(
    "+password"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  const correctPassword = await bcrypt.compare(value.password, user.password);
  if (!correctPassword) {
    return res.status(401).json({ message: "Invalid Credentials!" });
  }

  if (!user.isVerified) {
    return res.status(400).json({ message: "You are not verified" });
  }

  const accessToken = jwt.sign({ id: user.id }, config.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });

  // res.cookie("myCookie", accessToken, {
  //   httpOnly: true,
  //   sameSite: "lax",
  //   expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  // });

  res.status(200).json({
    accessToken,
    message: "User logged in successfully",
    user: { email: user.email },
  });
};

//ChangeUserRole
export const changeUserRole = async (req, res) => {
  //Validate request body
  const { error, value } = changeUserRoleValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }

  //check if user exists
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found!" });
  }

  //Update user role
  const result = await UserModel.findByIdAndUpdate(req.params.id, value, {
    new: true,
  });
  // //return response
  res.status(200).json(result);
};

export const logoutUser = async (req, res) => {
  res.clearCookie("myCookie", {
    httpOnly: true,
    sameSite: "lax",
  });
  res.status(200).json({
    message: "User logged out successfully",
  });
};
