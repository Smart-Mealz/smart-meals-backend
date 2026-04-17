import Joi from "joi";

export const registerUserValidator = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  //username: Joi.string().min(3).max(30),
  email: Joi.string().required().email(),
  password: Joi.string().required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Confirm password is required",
    }),
  role: Joi.string().valid("user", "admin")
})

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
