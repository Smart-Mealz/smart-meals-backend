import Joi from "joi";

export const registerUserValidator = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  //username: Joi.string().min(3).max(30),
  email: Joi.string().required().email(),
  password: Joi.string().required(),
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

export const forgotUserPasswordValidator = Joi.object({
  email: Joi.string().required().email(),
});

export const resetUserPasswordValidator = Joi.object({
  newPassword: Joi.string().required(),
  confirmPassword: Joi.valid(Joi.ref("newPassword")).required(),
  token: Joi.string().required(),
});

export const changeUserRoleValidator = Joi.object({
  role: Joi.string().valid("user", "admin"),
});
