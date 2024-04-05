import Mailgen from "mailgen";

const APP_NAME = process.env.APP_NAME;
const CLIENT_URL = process.env.CLIENT_URL;

const MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: `${APP_NAME}`,
    link: "http://localhost:3000/",
    copyright: `Copyright © 2024 ${APP_NAME}. All rights reserved.`,
  },
});

export function sendWelcomeTemplate(welcomeDto) {
  const { email, name } = welcomeDto;

  const template = {
    body: {
      name,
      title: `Welcome to ${APP_NAME}`,
      intro: `You have successfully created an account on ${APP_NAME}`,
      dictionary: {
        name,
        email,
      },
      outro: "Thank you for joining with us",
    },
  };

  return MailGenerator.generate(template);
}

export function sendPasswordUpdateTemplate(dto) {
  const { name, email, password } = dto;
  const date = new Date();

  const template = {
    body: {
      name,
      title: `Your password has been updated successfully.`,
      intro: `${name}, The password for email <strong> ${email} </strong> has been successfully updated. Here are the details:`,
      dictionary: {
        name,
        email,
        password,
        date,
      },
      outro: `If you don't recognize this action, we recommend you do an additional password reset. If you need assistance, please connect with our Support team. <br />`,
    },
  };

  return MailGenerator.generate(template);
}

export function sendOtpTemplate(otpMailerDto) {
  const { name, otp } = otpMailerDto;

  const template = {
    body: {
      name,
      title: "Verify your email address",
      intro:
        "Confirm it's you by entering the code. Ignore if you're not making an account.",
      action: {
        instructions: `<br><strong>To get started with ${APP_NAME}, Verify this OPT:</strong>`,
        button: {
          color: "#48cfad",
          text: otp,
          link: "#",
        },
      },
      outro:
        "We will never email you and ask you to disclose or verify your password.",
    },
  };

  return MailGenerator.generate(template);
}

export function sendPasswordResetTemplate(passwordResetDto) {
  const { email, otp } = passwordResetDto;

  const template = {
    body: {
      email,
      title: `Reset your password`,
      intro: `If you are not trying to reset your password please ignore this mail.`,
      action: {
        instructions: `<br><strong>You can reset your password using the below OTP. Your OTP will be expired in 5 Minute</strong>`,
        button: {
          color: "#414141",
          text: otp,
          link: `#`,
        },
      },
      outro:
        "Please do not reply to this email. Emails sent to this address will not be answered. <br>",
    },
  };

  return MailGenerator.generate(template);
}
