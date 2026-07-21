export const notFound = (request, _response, next) => {
  const error = new Error(`Route not found: ${request.method} ${request.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, _request, response, _next) => {
  const duplicateKey = error?.code === 11000;
  const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : duplicateKey ? 409 : 500);

  response.status(statusCode).json({
    message: duplicateKey ? 'A record with this value already exists.' : error.message || 'Internal server error.',
  });
};
