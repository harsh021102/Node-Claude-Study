import type { RequestHandler } from "express";
import type { ZodType } from "zod";

function formatIssues(error: {
  issues: Array<{ path: PropertyKey[]; message: string }>;
}) {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "root",
    message: issue.message,
  }));
}
export function validateBody<T>(schema: ZodType<T>): RequestHandler {
  return (req, res, next) => {
    req.body = schema.parse(req.body);
    next();
  };
}
export function validateQuery<T>(schema: ZodType<T>): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res
        .status(400)
        .json({ error: "Invalid query", details: formatIssues(result.error) });
      return;
    }
    res.locals.query = result.data;
    next();
  };
}
