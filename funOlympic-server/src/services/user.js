import { hashPassword } from "../utils/bcrypt.js";
import db from "../config/db.js";

const createUser = async (user) => {
  const { password, ...details } = user;
  const hashedPassword = await hashPassword(password);
  return await db.user.create({
    data: {
      password: hashedPassword,
      roles: "ADMIN",
      // role: "Admin",
      ...details,
    },
  });
};

const getUserByEmail = async (email) => {
  return await db.user.findFirst({ where: { email } });
};

const getUserById = async (id) => {
  return await db.user.findUnique({ where: { id } });
};

const updateUserById = async (id, user) => {
  return await db.user.update({ where: { id }, data: user });
};

const getAllUser = async () => {
  return await db.user.findMany({});
};

const deleteUser = async (userId) => {
  try {
    const data = await db.user.delete({ where: { id: userId } });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export {
  getUserByEmail,
  createUser,
  getAllUser,
  getUserById,
  updateUserById,
  deleteUser,
};
