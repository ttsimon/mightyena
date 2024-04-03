import { Catch, MidwayHttpError } from '@midwayjs/core';
import { Result } from '../../response/index';
import { Context } from '@midwayjs/web';
@Catch()
export class ExceptionFilter {
  async catch(exception: MidwayHttpError, ctx: Context) {
    ctx.logger.error(exception);
    // 设置请求状态码
    ctx.response.status = exception.status || 500;
    return Result.ERROR(exception.message, exception.status || 500);
  }
}
