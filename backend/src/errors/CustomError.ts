export class CustomError extends Error {
  status: number;

  constructor(message: string = 'Error', status: number = 500) {
    super(message);
    this.status = status;
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string = 'Bad Request') {
    super(message, 400);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Not Found') {
    super(message, 404);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string = 'Internal Server Error') {
    super(message);
  }
}
