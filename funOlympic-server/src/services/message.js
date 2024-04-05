import db from "../config/db.js";
import ValidationError from "../errors/validationError.error.js";

const createMessage = async (data) => {
  const { body, userId, eventId, type, commentId, liveId } = data;
  if (type.toLocaleLowerCase() === "livechat") {
    if (liveId) {
      const livechat = await db.livechat.findUnique({
        where: { id: +liveId },
      });

      if (!livechat) {
        throw new ValidationError("Invalid livechat id", "Invalid livechat id");
      }
      const message = await db.message.create({
        data: {
          body,
          user_id: +userId,
          messageType: type.toLocaleUpperCase(),
          livechat_id: +liveId,
        },
      });
      return message;
    }

    const livechat = await db.livechat.create({
      data: {
        event_id: eventId,
      },
    });

    const message = await db.message.create({
      data: {
        body,
        user_id: +userId,
        messageType: type.toLocaleUpperCase(),
        livechat: livechat.id,
      },
    });
    return message;
  }
  if (type.toLocaleLowerCase() === "comment") {
    // creating new message for comment
    if (commentId) {
      const comment = await db.comments.findUnique({
        where: { id: +commentId },
      });
      if (!comment) {
        throw new ValidationError("Invalid comment id", "Invalid comment id");
      }
      const message = await db.message.create({
        data: {
          user_id: +userId,
          messageType: type.toLocaleUpperCase(),
          comment_id: +commentId,
          body: body,
        },
      });
      return message;
    }

    // creating new for comment for event
    const comment = await db.comments.create({
      data: {
        event_id: +eventId,
      },
    });
    const message = await db.message.create({
      data: {
        body,
        user_id: userId,
        messageType: type.toLocaleUpperCase(),
        comment_id: comment.id,
      },
    });
    return message;
  }
  throw new ValidationError("Invalid message type", "Invalid message type");
};

const getMessages = async () => {
  return await db.message.findMany({});
};

export { createMessage, getMessages };
