import { HttpStatus } from '@midwayjs/core';

/**
 * 响应
 */
export class Result<T> {
  code: HttpStatus;
  message: string;
  data: T;
  constructor(code: HttpStatus, message: string, data: T = null) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static SUCCESS(data: any) {
    return new Result(HttpStatus.OK, '请求成功！', data);
  }
  static ERROR(message: string, code?: HttpStatus) {
    return new Result(
      code ?? HttpStatus.INTERNAL_SERVER_ERROR,
      message ?? '请求失败',
      null
    );
  }
}
