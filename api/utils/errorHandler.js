export default function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.log({ err, message });
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
}
