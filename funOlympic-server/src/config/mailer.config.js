import nodemailer from "nodemailer";

const EMAIL_SERVICE = process.env.EMAIL_SERVICE || "gmail";
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS || "prabessh.dev@gmail.com";
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "jrbc gzfr mjcb hrwg";

const config = {
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL_ADDRESS,
    pass: EMAIL_PASSWORD,
  },
};

const mailer = nodemailer.createTransport(config);

export default mailer;
