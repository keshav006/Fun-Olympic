import schemas from "../utils/schema.js";
import ValidationError from "../errors/validationError.error.js";
import Joi from "joi";

const supportedMethods = ["post", "put", "patch", "delete"];

const validationOptions = {
  abortEarly: false,
  allowUnknown: false,
  stripUnknown: false,
};

const schemaValidator = (path, useJoiError = true) => {
  const schema = schemas[path];

  if (!schema) {
    throw new Error(`Schema not found for path: ${path}`);
  }

  return (req, res, next) => {
    const method = req.method.toLowerCase();

    if (!supportedMethods.includes(method)) {
      return next();
    }

    const { error, value } = schema.validate(req.body, validationOptions);

    if (error) {
      const customError = {
        status: "failed",
        error: "Invalid request. Please review request and try again.",
      };

      const joiError = {
        status: "failed",
        error: {
          original: error._original,
          details: error.details.map(({ message, type }) => ({
            message: message.replace(/['"]/g, ""),
            type,
          })),
        },
      };
      throw new ValidationError(
        joiError.error.original,
        joiError.error.details,
      );
    }

    // validation successful
    req.body = value;
    return next();
  };
};

export default schemaValidator;
