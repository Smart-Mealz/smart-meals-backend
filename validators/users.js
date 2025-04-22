import Joi from "joi";

export const registerUserValidator = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  //username: Joi.string().min(3).max(30),
  email: Joi.string().required().email(),
  password: Joi.string()
    .min(6)
    .pattern(
      new RegExp(
        "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$"
      )
    )
    .message(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    )
    .required(),
  confirmPassword: Joi.ref("password"),
  role: Joi.string().valid("user", "admin"),
}).with("password", "confirmPassword");

export const verifyUserEmailValidator = Joi.object({
  verificationToken: Joi.string(),
});

export const loginUserValidator = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

export const changeUserRoleValidator = Joi.object({
  role: Joi.string().valid("user", "admin"),
});
