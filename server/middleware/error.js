export const errorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;

  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl} on the server`);
  error.status = "fail";
  error.statusCode = 404;

  next(error);
};
