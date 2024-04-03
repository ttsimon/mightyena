import { Context, IMiddleware, Middleware, NextFunction } from '@midwayjs/core';
import { Result } from '../../response/index';

@Middleware()
export class ResponseMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const result = await next();
      return Result.SUCCESS(result);
    };
  }
  static getName(): string {
    return 'Response';
  }
}
