import { successResponse } from "../utils/successResponse.js";
import * as chatService from "../services/livechat.js";

const createOne = async (req, res) => {
  const { ...details } = req.body;

const chatResponse = await chatService.createChat({
    ...details,
    userId: req.user.id,
  });
  res.json(successResponse(201, "Created", chatResponse));
};

export { createOne}