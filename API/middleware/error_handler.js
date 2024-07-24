const errorHandler = (err, req, res, next) => {
  const error = new Error();
  error.statusCode = err.statusCode || 500;
  error.message = err.message || "Internal Server Error";
  return error;
};
