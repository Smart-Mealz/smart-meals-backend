import Joi from "joi";

export const addMealkitToCartValidator = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});

export const updateMealkitCartValidator = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});
