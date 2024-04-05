import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import db from "../config/db.js";
import ValidationError from "../errors/validationError.error.js";
import * as userService from "../services/user.js";
import * as mailService from "../services/mailer.service.js";
import { successResponse } from "../utils/successResponse.js";
import { generateTokens } from "../utils/token.js";
import { generateOtp } from "../utils/otp.js";

const sendSignupOtp = async (req, res) => {
  const { email, name } = req.body;
  const user = await userService.getUserByEmail(email);
  if (user) {
    throw new ValidationError("Email already exits", "Email already exits");
  }

  sendOtp(email, name);

  res.json(successResponse(200, "Ok", { message: "OTP sent to your email" }));
};

const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ValidationError("Email doesn't exits", "Email doesn't exits");
  }

  const otp = generateOtp();

  mailService.sendResetOtp({
    name: user.name,
    email: user.email,
    otp,
  });

  res.json(successResponse(200, "Ok", { message: "OTP sent to your email" }));
};

const sendOtp = (email, name = "") => {
  const otp = generateOtp();
  mailService.sendOtp({
    email,
    name,
    otp,
  });
};

const signUp = async (req, res) => {
  const { token, ...details } = req.body;

  // check email is unique or not
  const userExist = await userService.getUserByEmail(details.email);

  if (userExist) {
    throw new ValidationError("Email already exits", "Email already exits");
  }

  const user = await userService.createUser({
    ...details,
  });

  const tokens = await generateTokens({
    id: user.id,
    roles: user.roles,
    email: user.email,
  });

  const { password, ...rest } = user;

  mailService.sendWelcome({
    name: user.name,
    email: user.email,
  });

  res.json(successResponse(200, "Ok", { user: { ...rest }, tokens }));
};

const resetRequest = async (req, res) => {
  const users = await db.user.findMany({
    where: {
      resetRequest: true,
    },
  });

  res.json(successResponse(200, "Ok", { users }));
};

const changePassword = async (req, res) => {
  const { id, password } = req.body;

  const hashedPassword = await hashPassword(password);

  const user = await db.user.update({
    where: { id: +id },
    data: {
      password: hashedPassword,
      resetRequest: false,
    },
  });

  mailService.sendPasswordUpdate({
    name: user.name,
    email: user.email,
    password,
  });

  res.json(successResponse(200, "Ok", { message: "Password changed" }));
};

const verifyResetOtp = async (req, res) => {
  const { email } = req.body;
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ValidationError("User doesn't exits", "User doesn't exits");
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      resetRequest: true,
    },
  });

  res.json(
    successResponse(200, "Ok", {
      message: "Your password reset request has been sent to the admin!",
    }),
  );
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.getUserByEmail(email);

  if (!user)
    throw new ValidationError(
      "Invalid email or password",
      "Invalid email or password",
    );

  const isCorrectPassword = await comparePassword(password, user.password);

  if (!isCorrectPassword)
    throw new ValidationError(
      "Invalid email or password",
      "Invalid email or password",
    );

  // create jwt and sent to user
  const tokens = generateTokens({
    id: user.id,
    roles: user.roles,
    email: user.email,
  });

  res.json(
    successResponse(200, "Ok", {
      tokens,
      user: {
        name: user.name,
        id: user.id,
        role: user.roles,
        email: user.email,
      },
    }),
  );
};

export {
  signUp,
  signIn,
  resetRequest,
  verifyResetOtp,
  changePassword,
  sendResetOtp,
  sendSignupOtp,
};
