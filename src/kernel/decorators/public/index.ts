import { createCustomPropertyDecorator } from '@midwayjs/core';
import { EXPORT_QUERY_KEY } from '../../constant/index';
import { IQueryOptions } from '../../types/index';

/**
 * 实体字段查询模式装饰器@Public
 * @param options 模式配置项
 * @constructor
 */
export function Public(options: IQueryOptions): PropertyDecorator {
  // 只允许存在一种模式
  let metadata = 'eq';
  for (const key in options) {
    if (options[key]) {
      metadata = key;
      break;
    }
  }
  return createCustomPropertyDecorator(EXPORT_QUERY_KEY, metadata);
}
