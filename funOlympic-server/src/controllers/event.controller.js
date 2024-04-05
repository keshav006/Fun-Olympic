import ValidationError from "../errors/validationError.error.js";
import { successResponse } from "../utils/successResponse.js";
import * as eventService from "../services/event.js";

const findOne = async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ValidationError("Id is required", "Id is required");

  const event = await eventService.findOne(id);
  res.json(successResponse(200, "Ok", event));
};

const findAll = async (req, res) => {
  const events = await eventService.findAll();
  res.json(successResponse(200, "Ok", events));
};

const createOne = async (req, res) => {
  const { ...details } = req.body;

  const event = await eventService.createOne({
    ...details,
  });
  res.json(successResponse(201, "Created", event));
};

const updateOne = async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ValidationError("Id is required", "Id is required");

  const { category, title, ...details } = req.body;
  const event = await eventService.updateOne(+id, {
    ...{ eventTitle: title, ...details },
    category: {
      connect: {
        id: +category,
      },
    },
  });
  res.json(successResponse(200, "Ok", event));
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ValidationError("Id is required", "Id is required");

  const doesExist = await eventService.findOne(+id);
  if (!doesExist)
    throw new ValidationError("Event does not exist", "Event does not exist");

  const data = await eventService.deleteOne(id);
  res.json(successResponse(204, "Deleted", data));
};

export { findOne, findAll, createOne, updateOne, deleteOne };
