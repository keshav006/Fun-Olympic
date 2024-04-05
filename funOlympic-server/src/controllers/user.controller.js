import ValidationError from "../errors/validationError.error.js";
import * as userService from "../services/user.js";
import { successResponse } from "../utils/successResponse.js";

const getAllUser = async (req, res) => {
  const user = await userService.getAllUser();
  res.json(successResponse(200, "Ok", user));
};

const createUser = async (req, res) => {
  const data = req.body;
  const user = await userService.createUser(data);
  res.json(successResponse(201, "Created", user));
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUserById(+id);
  res.json(successResponse(200, "Ok", user));
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const userExist = await userService.getUserById(+id);
  if (!userExist)
    throw new ValidationError("User doesn't exist", "User doesn't exist");

  const user = await userService.deleteUser(+id);
  res.json(successResponse(200, "Ok", user));
};

export { getAllUser, createUser, getUserById, deleteUser };
