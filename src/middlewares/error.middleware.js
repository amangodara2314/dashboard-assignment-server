import AppError from "../utils/AppError.js";

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export default errorMiddleware;
