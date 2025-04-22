// utils/apiHandler.ts

import { Response } from "express";

// Success response handler
export const apiSuccess = (
  res: Response,
  data: any = null,
  message: string = "Request successful",
  status: number = 200
) => {
  const response: { success: boolean; message: string; data?: any } = { success: true, message };
  if (data !== null) response["data"] = data;
  res.status(status).json(response);
};

// Error response handler
export const apiFailure = (
  res: Response,
  message: string = "Request failed",
  status: number = 400,
  data: any = null
) => {
  const response: { success: boolean; message: string; data?: any } = { success: false, message };
  if (data !== null) response["data"] = data;
  res.status(status).json(response);
};

// Handling API errors (middleware)
export const apiErrorHandler = (err: any, req: any, res: Response, next: any) => {
  let statusCode = 500;
  let message = err.message || "An error occurred";

  if (err.name === "ValidationError") {
    statusCode = 422;
    message = Object.values(err.errors)
      .map((error: any) => error.message)
      .join(", ");
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === "NotFoundError") {
    statusCode = 404;
    message = "Resource not found";
  }

  res.status(statusCode).json({ success: false, message });
};
