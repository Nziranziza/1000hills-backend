import Joi, { ValidationOptions } from "joi";
import { REGEX } from "../../../constants";

type ObjectSchema = Joi.ObjectSchema;

const options: ValidationOptions = {
  abortEarly: false,
};

export const updateUser: ObjectSchema = Joi.object()
  .keys({
    phone: Joi.string().regex(REGEX.PHONE).message("Invalid phone number format"),
    bio: Joi.string().max(150),
    profileUrl: Joi.string().uri(),
    name: Joi.string().min(3)
  })
  .min(1)
  .options(options);
