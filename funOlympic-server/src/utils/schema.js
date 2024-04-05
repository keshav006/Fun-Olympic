import Joi from "joi";

const PASSWORD_REGEX = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
);

const register = Joi.object().keys({
  name: Joi.string().required().messages({
    "any.required": `"name" is a required field`,
  }),
  email: Joi.string().email().required().messages({
    "string.email": `"email" should be a type of 'email'`,
  }),
  phone: Joi.string().required().min(10).max(10),
  country: Joi.string().required(),
  sport: Joi.string().required(),
  token: Joi.string().required(),
  password: Joi.string().pattern(PASSWORD_REGEX).min(8).required().messages({
    "string.min": `"password" should have a minimum length of {#limit}`,
    "string.empty": `"password" cannot be an empty field`,
  }),
});

const login = Joi.object().keys({
  email: Joi.string().email().required().messages({
    "string.email": `"email" should be a type of 'email'`,
  }),
  password: Joi.string().required().min(8).required().messages({
    "string.min": `"password" should have a minimum length of {#limit}`,
    "string.empty": `"password" cannot be an empty field`,
  }),
});

const categoryCreate = Joi.object().keys({
  sport: Joi.string().required().messages({
    "any.required": `"sport" is a required field`,
  }),
  description: Joi.string().required().messages({
    "any.required": `"description" is a required field`,
  }),
});

const categoryUpdate = Joi.object().keys({
  sport: Joi.string().messages({
    "any.required": `"sport" is a required field`,
  }),
  description: Joi.string().messages({
    "any.required": `"description" is a required field`,
  }),
});

const eventCreate = Joi.object().keys({
  title: Joi.string().required().messages({
    "any.required": `"title" is a required field`,
  }),
  description: Joi.string().required().messages({
    "any.required": `"description" is a required field`,
  }),
  thumbnail: Joi.string().required().messages({
    "any.required": `"thumbnail" is a required field`,
  }),
  published: Joi.bool().required().messages({
    "any.required": `"published" is a required field`,
  }),

  liveChatEnabled: Joi.bool().required().messages({
    "any.required": `"liveChatEnabled" is a required field`,
  }),

  streamLink: Joi.string().required().messages({
    "any.required": `"steamLink" is a required field`,
  }),

  categoryId: Joi.string().required().messages({
    "any.required": `"categoryId" is a required field`,
  }),

  endDate: Joi.string().required().messages({
    "any.required": `"endDate" is a required field`,
  }),
  startDate: Joi.string().required().messages({
    "any.required": `"startDate" is a required field`,
  }),
});

const eventUpdate = Joi.object().keys({
  title: Joi.string().messages({
    "any.required": `"title" is a required field`,
  }),
  description: Joi.string().messages({
    "any.required": `"description" is a required field`,
  }),
  thumbnail: Joi.string().messages({
    "any.required": `"thumbnail" is a required field`,
  }),
  published: Joi.bool().messages({
    "any.required": `"published" is a required field`,
  }),

  liveChatEnabled: Joi.bool().messages({
    "any.required": `"liveChatEnabled" is a required field`,
  }),

  streamLink: Joi.string().messages({
    "any.required": `"steamLink" is a required field`,
  }),

  category: Joi.string().messages({
    "any.required": `"categoryId" is a required field`,
  }),

  endDate: Joi.string().messages({
    "any.required": `"endDate" is a required field`,
  }),
  startDate: Joi.string().messages({
    "any.required": `"startDate" is a required field`,
  }),
});

const createMessage = Joi.object().keys({
  body: Joi.string().required().messages({
    "any.required": `"body" is a required field`,
  }),
  eventId: Joi.number().required().messages({
    "any.required": `"eventId" is a required field`,
  }),
  type: Joi.string().required().messages({
    "any.required": `"type" is a required field`,
  }),
  userId: Joi.number().required().messages({
    "any.required": `"userId" is a required field`,
  }),
  commentId: Joi.any().optional(),
  liveId: Joi.any().optional(),
});

const createComment = Joi.object().keys({
  body: Joi.string().required().messages({
    "any.required": `"body" is a required field`,
  }),
  eventId: Joi.string().required().messages({
    "any.required": `"eventId" is a required field`,
  }),
});

const getComment = Joi.object().keys({
  eventId: Joi.string().required().messages({
    "any.required": `"eventId" is a required field`,
  }),
});

const updateComment = Joi.object().keys({
  body: Joi.string().messages({
    "any.required": `"body" is a required field`,
  }),
  eventId: Joi.string().messages({
    "any.required": `"eventId" is a required field`,
  }),
});

const registerOtp = Joi.object().keys({
  email: Joi.string().required().messages({
    "any.required": `"email" is a required field`,
  }),
  name: Joi.string().required().messages({
    "any.required": `"name" is a required field`,
  }),
});
const resetOtp = Joi.object().keys({
  email: Joi.string().required().messages({
    "any.required": `"email" is a required field`,
  }),
});

const verifyResetOtp = Joi.object().keys({
  email: Joi.string().required().messages({
    "any.required": `"email" is a required field`,
  }),
  token: Joi.string().required().messages({
    "any.required": `"token" is a required field`,
  }),
});

const resetPassword = Joi.object().keys({
  id: Joi.string().required().messages({
    "any.required": `"id" is a required field`,
  }),
  password: Joi.string().min(8).required().messages({
    "any.required": `"password" is a required field`,
  }),
});
export default {
  "/auth/signin": login,
  "/auth/signup": register,
  "/auth/send-signup-otp": registerOtp,
  "/auth/send-reset-otp": resetOtp,
  "/auth/verify-reset-otp": verifyResetOtp,
  "/auth/reset-password": resetPassword,
  "/category/create": categoryCreate,
  "/category/update": categoryUpdate,
  "/event/create": eventCreate,
  "/event/update": eventUpdate,
  "/comment/create": createComment,
  "/comment/update": updateComment,
  "/comment/get-comments": getComment,
  "/message/create": createMessage,
};
