import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors.js";
import { error } from "console";
import { config } from "../config.js";

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
};
// export const corruptFileError:RequestHandler = ()
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // console.log("3. errorHandler ran:", err?.constructor?.name);

  if (res.headersSent) {
    next(err);
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_FAILED",
        message: "Validaion failed",
        details: err.issues.map((i) => ({
          field: i.path.join(".") || "(root)",
          message: i.message,
        })),
      },
    });
    return;
  }
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: { code: err.code, message: err.message },
    });
    return;
  }
  console.log("Unhandled error:", err);

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      mesage:
        config.NODE_ENV === "production"
          ? "Something went wrong"
          : err instanceof Error
            ? err.message
            : String(err),
    },
  });
  // return;
};
