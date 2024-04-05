import mailer from "../config/mailer.config.js";
import {
  sendOtpTemplate,
  sendPasswordResetTemplate,
  sendPasswordUpdateTemplate,
  sendWelcomeTemplate,
} from "./emailTemplate.js";

const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS || "prabessh.dev@gmail.com";
const APP_NAME = process.env.APP_NAME || "funOlympics";

const processOtpJob = async (job) => {
  console.log(`Sending verification Otp email to '${job.data.email}'`);
  try {
    const message = {
      from: EMAIL_ADDRESS,
      to: job.data.email,
      subject: `Registration OTP for ${APP_NAME}`,
      html: sendOtpTemplate(job.data),
    }
    return await mailer.sendMail(message);
  } catch (error) {
    console.log(error)
    console.log(`Failed to send Otp to '${job.data.email}'`);
  }
};

const processPasswordResetOtpJob = async (job) => {
  try {
    console.log(`Sending password reset otp email to '${job.data.email}'`);

    const message = {
      from: EMAIL_ADDRESS,
      to: job.data.email,
      subject: `OTP to reset password ${APP_NAME}`,
      html: sendPasswordResetTemplate(job.data),
    };
    return await mailer.sendMail(message);
  } catch (error) {
    console.log(
      `Failed to send reset password OTP mail to '${job.data.email}'`
    );
  }
};

const processWelcomeJob = async (job) => {
  try {
    console.log(`Sending welcome email to '${job.data.email}'`);

    const message = {
      from: EMAIL_ADDRESS,
      to: job.data.email,
      subject: `Welcome to ${APP_NAME}`,
      html: sendWelcomeTemplate(job.data),
    };
    return await mailer.sendMail(message);
  } catch (error) {
    console.log(`Failed to send welcome mail to '${job.data.email}'`);
  }
  return null;
};

const processPasswordUpdateJob = async (job) => {
  try {
    console.log(`Sending password update mail to '${job.data.email}'`);

    const message = {
      from: EMAIL_ADDRESS,
      to: job.data.email,
      subject: `Your password has been updated`,
      html: sendPasswordUpdateTemplate(job.data),
    };
    return await mailer.sendMail(message);
  } catch (error) {
    console.log(`Failed to send password update mail to '${job.data.email}'`);
  }
  return null;
};

export {
  processOtpJob,
  processPasswordResetOtpJob,
  processPasswordUpdateJob,
  processWelcomeJob,
};
