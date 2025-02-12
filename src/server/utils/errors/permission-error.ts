export class PermissionError extends Error {
  constructor(
    public message: string,
    public description?: string,
    public cause?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
