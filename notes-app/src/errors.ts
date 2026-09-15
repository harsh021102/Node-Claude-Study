export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = new.target.name;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, options?: { cause?: unknown }) {
    super(`${resource} not found`, 404, "NOT_FOUND", options);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, 409, "CONFLICT", options);
  }
}
