export const successResponse = (status, type, data) => {
  return { status, success: true, type, payload: { data } };
};
