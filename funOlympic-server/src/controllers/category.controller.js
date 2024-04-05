import ValidationError from "../errors/validationError.error.js";
import { successResponse } from "../utils/successResponse.js";
import * as categoryService from "../services/category.js";

const findOne = async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ValidationError("Id is required", "Id is required");
  const catId = parseInt(id);
  
  const category = await categoryService.getCategoryById(catId);
  res.json(successResponse(200, "Ok", category));
};

const findAll = async (req, res) => {
  const categories = await categoryService.getAllCategory();
  res.json(successResponse(200, "Ok", categories));
};

const createOne = async (req, res) => {
  const { ...details } = req.body;

  const category = await categoryService.createCategory({
    ...details,
  });
  res.json(successResponse(201, "Created", category));
};

const updateOne = async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ValidationError("Id is required", "Id is required");

  const { ...details } = req.body;
  const category = await categoryService.updateCategoryById(id, {
    ...details,
  });
  res.json(successResponse(200, "Ok", category));
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ValidationError("Id is required", "Id is required");

  const doesExist = await categoryService.getCategoryById(+id);
  if (!doesExist)
    throw new ValidationError(
      "Category does not exist",
      "Category does not exist"
    );

  const data = await categoryService.deleteCategory(id);
  res.json(successResponse(204, "Deleted", data));
};

export { findOne, findAll, createOne, updateOne, deleteOne };
