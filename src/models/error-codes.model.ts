import { HttpException, HttpStatus } from '@nestjs/common';

export class DB_UNIQUE_VIOLATION_EXCEPTION extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class SOME_PRODUCTS_ARE_NOT_EXIST extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
