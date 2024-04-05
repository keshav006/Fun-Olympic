import ValidationError from "../errors/validationError.error.js";
import { successResponse } from "../utils/successResponse.js";
import * as messageService from "../services/message.js";

const createOne = async (req, res) => {
  const { ...details } = req.body;
  const createdMessage = await messageService.createMessage({
    ...details,
  });

  res.json(successResponse(201, "Created", createdMessage));
};

const findAll = async (req, res) => {
  const messages = await messageService.getMessages();

  res.json(successResponse(200, "Ok", messages));
};

export { createOne, findAll };
