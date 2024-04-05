import Jwt from "jsonwebtoken";

const verifyJwtToken = async (token) => {
  try {
    const key = process.env.JWT_SECRET_KEY;
    console.log("JWT key", key, token);
    const payload = await Jwt.verify(token, key);
    console.log("🚀 ~ verifyJwtToken ~ payload:", payload);
    return payload;
  } catch (error) {
    console.error("Error verifying JWT token", error);
    return null;
  }
};

export { verifyJwtToken };
