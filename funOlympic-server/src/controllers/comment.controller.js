import ValidationError from "../errors/validationError.error.js";
import { successResponse } from "../utils/successResponse.js";
import * as commentService from "../services/comment.js";

const createOne = async (req, res) => {
  const { ...details } = req.body;

  const commentResponse = await commentService.createComment({
    ...details,
    userId: req.user.id,
  });
  res.json(successResponse(201, "Created", commentResponse));
};

const findOne = async (req, res) => {
  const { ...details } = req.body;

  const commentResponse = await commentService.getComments({ ...details });
  res.json(successResponse(200, "Ok", commentResponse));
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ValidationError("Id is required", "Id is required");

  const data = await commentService.deleteComment(id);
  res.json(successResponse(204, "Deleted", data));
};

export { createOne, findOne, deleteOne };
