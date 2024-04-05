const errorResponse = (message, status, details) => ({
  success: false,
  status: status || 500,
  message,
  details: details || null,
});

export default errorResponse;
