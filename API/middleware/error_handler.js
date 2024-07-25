const errorHandler = (status,  message) => {

  const error = new Error();
  error.statusCode = status|| 500;
  error.message = message || "Internal Server Error";
  return error;
};

export default errorHandler;
