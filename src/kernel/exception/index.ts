import { MidwayHttpError } from '@midwayjs/core';
import { HttpStatus } from '@midwayjs/core/dist/error/http';

export class Exception extends MidwayHttpError {
  constructor(message: string, code?: HttpStatus) {
    super(message, code || HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
