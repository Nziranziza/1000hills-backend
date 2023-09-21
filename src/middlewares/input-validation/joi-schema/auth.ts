import Joi, { ValidationOptions } from "joi";

type ObjectSchema = Joi.ObjectSchema;
const email = Joi.string().email().required().lowercase();
const password = Joi.string()
  .min(8)
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
  .message(
    '"{#label}" must contain at least one lowercase letter, one uppercase letter, one digit, and one special character (!@#$%^&*)'
  )
  .required();

const options: ValidationOptions = {
  abortEarly: false,
};

export const signup: ObjectSchema = Joi.object()
  .keys({
    email,
    password,
  })
  .options(options);

export const login: ObjectSchema = Joi.object({
  email,
  password: Joi.string().required(),
});

export const forgotPassword: ObjectSchema = Joi.object()
  .keys({
    email,
  })
  .options(options);

export const resetPassowrd: ObjectSchema = Joi.object()
  .keys({
    password,
  })
  .options(options);
