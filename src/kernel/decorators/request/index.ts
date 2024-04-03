import { createRequestParamDecorator } from '@midwayjs/core';

/**
 * 自定义context参数装饰器@Ctx
 * @constructor
 */
export function Ctx(): ParameterDecorator {
  return createRequestParamDecorator(ctx => ctx);
}
