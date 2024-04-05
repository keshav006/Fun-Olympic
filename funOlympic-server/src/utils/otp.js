import { totp } from "otplib";

const OTP_SECRET = process.env.OTP_SECRET || 'sfsf';
const OTP_DURATION_IN_SECS = process.env.OTP_DURATION_IN_SECS;

totp.options = {
  step: +OTP_DURATION_IN_SECS,
};

const generateOtp = () => {
  return totp.generate(OTP_SECRET);
};

console.log("***Seectre key", OTP_SECRET)
const verifyOtp = (otp) => totp.verify({ token: otp, secret: OTP_SECRET });

export { generateOtp, verifyOtp };
