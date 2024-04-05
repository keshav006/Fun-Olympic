import db from "../config/db.js";

const createComment = async (detail) => {
  return await db.comments.create({
    data: {
      message: {
        create: {
          body: detail?.body,
          user: {
            connect: {
              id: +detail?.userId,
            },
          },
        },
      },
      event_id: +detail?.eventId,
    },
  });
};

const getComments = async (eventId) => {
  return await db.comments.findMany({
    where: {
      event_id: +eventId,
    },
    include: {
      message: true,
    },
  });
};

const deleteComment = async (id) => {
  return await db.comments.delete({
    where: {
      id: +id,
    },
  });
};

export { createComment, getComments, deleteComment };
