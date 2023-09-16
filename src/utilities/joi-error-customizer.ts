import { ValidationError, ValidationErrorItem } from "joi";

const joiErrorCustomizer = (errors: ValidationError): string[] =>
  errors.details.map((error: ValidationErrorItem) => error.message);

export default joiErrorCustomizer;
