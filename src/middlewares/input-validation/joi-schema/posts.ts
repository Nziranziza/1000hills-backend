import Joi, { Schema, ValidationOptions } from "joi";

type ObjectSchema = Joi.ObjectSchema;

const options: ValidationOptions = {
  abortEarly: false,
};
const alterOptions: Record<string, (schema: Schema) => Schema<any>> = {
  post: (schema: Schema) => schema.required(),
  put: (schema: Schema) => schema.optional(),
};

const schema: ObjectSchema = Joi.object()
  .keys({
    title: Joi.string().alter(alterOptions),
    description: Joi.string(),
    assets: Joi.array()
      .items(
        Joi.object().keys({
          url: Joi.string().uri().required(),
          type: Joi.string().valid("image", "video").lowercase().required(),
        })
      )
      .alter(alterOptions),
  })
  .min(1)
  .options(options);

export const create = schema.tailor("post");
export const update = schema.tailor("put");
