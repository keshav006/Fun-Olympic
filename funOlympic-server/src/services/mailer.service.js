import createJob from "../config/queue.config.js";
import {
  RESET_OTP,
  SENT_OTP,
  PASSWORD_UPDATE,
  WELCOME,
} from "../constants/mail.constant.js";

// { name, email }
const sendWelcome = (welcomeMailerDto) => {
  createJob(WELCOME, welcomeMailerDto);
};

const sendPasswordUpdate = (passwordUpdateDto) => {
  createJob(PASSWORD_UPDATE, passwordUpdateDto);
};

// { name, email, otp }
const sendOtp = (otpDto) => {
  console.log("*******SEND OTP******", otpDto)
  createJob(SENT_OTP, otpDto);
};

// { name, email, otp }
const sendResetOtp = (resetOtp) => {
  createJob(RESET_OTP, resetOtp);
};

export { sendOtp, sendResetOtp, sendWelcome, sendPasswordUpdate };
