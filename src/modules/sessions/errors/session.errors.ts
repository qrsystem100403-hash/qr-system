export class SessionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SessionError";
  }
}

export class SessionExpiredError extends SessionError {
  constructor() {
    super("Session has expired.");
  }
}

export class SessionNotFoundError extends SessionError {
  constructor() {
    super("Session not found.");
  }
}

export class InvalidSessionError extends SessionError {
  constructor() {
    super("Invalid session.");
  }
}