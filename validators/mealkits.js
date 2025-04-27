import Joi from "joi";

export const addMealkitValidator = Joi.object({
  image: Joi.string().required(),
  tag: Joi.string().valid(
    "Spicy",
    "Sweet",
    "Vintage",
    "Savory",
    "Fresh",
    "Fruity"
  ),
  title: Joi.string().required(),
  description: Joi.string().required(),
  time: Joi.string().required(),
  ingredients: Joi.string().required(),
  recipeSteps: Joi.string().required(),
  servings: Joi.number().required(),
  price: Joi.number().required(),
  quantity: Joi.number().required(),
  category: Joi.string().valid("Continental", "Local").required(),
});

export const updateMealkitValidator = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required(),
  quantity: Joi.number().required(),
  category: Joi.string().valid("Continental", "Local").required(),
  description: Joi.string().required(),
  ingredients: Joi.string().required(),
  recipeSteps: Joi.string().required(),
  servings: Joi.number().required(),
});

export const updateMealkitImageValidator = Joi.object({
  image: Joi.string().required(),
});
