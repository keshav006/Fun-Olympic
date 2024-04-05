import db from "../config/db.js";

const createChat = async ({userId, eventId, body}) => {
  try {
    console.log("Pugyo yha event - id", eventId)
    const livechat = await db.livechat.findFirst({
      where: { event_id: +eventId },
    });

    console.log("chat vetyo", livechat);
    console.log("***********DB DATA", body, userId);

    const message = await db.message.create({
      data: {
        body,
        messageType: 'LIVECHAT',
        user_id: userId,
        livechat_id: livechat.id,
      },
    });
    console.log("*****message banyoo", message)
    return message;

  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

export { createChat };