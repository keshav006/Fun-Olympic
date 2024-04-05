import db from "../config/db.js";

const createCategory = async (user) => {
  const { sport, description } = user;
  const category = await db.category.create({
    data: {
      sport,
      description,
    },
  });
  return category;
};

const getCategoryById = async (id) => {
  return await db.category.findUnique({ where: { id } });
};

const updateCategoryById = async (id, user) => {
  return await db.category.update({ where: { id }, data: user });
};

const getAllCategory = async () => {
  return await db.category.findMany({});
};

const deleteCategory = async (id) => {
  return await db.category.delete({ where: { id: +id } });
};

export {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  updateCategoryById,
};
