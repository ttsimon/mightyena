import {
  attachPropertyDataToClass,
  getPropertyDataFromClass,
} from '@midwayjs/core';
import { EXPORT_VALID_SCOPE_KEY } from '../../constant';

/**
 * 实体参数校验作用域装饰器
 * @param scope 创建时/更新时
 * @constructor
 */
export function ValidScope(scope: 'create' | 'update') {
  return (target: any, propertyKey: string, parameterIndex?: number) => {
    if (parameterIndex !== null && parameterIndex !== undefined) {
      // 同一个propertyKey只能有一个@ValidScope
      if (
        !getPropertyDataFromClass(EXPORT_VALID_SCOPE_KEY, target, propertyKey)
      ) {
        attachPropertyDataToClass(
          EXPORT_VALID_SCOPE_KEY,
          {
            propertyKey,
            parameterIndex,
            scope,
          },
          target,
          propertyKey,
          'one'
        );
      }
    } else {
      const data = getPropertyDataFromClass(
        EXPORT_VALID_SCOPE_KEY,
        target,
        propertyKey
      );
      // Scope: create/update只能出现一次
      if (!data || data.some(it => it.scope !== scope)) {
        attachPropertyDataToClass(
          EXPORT_VALID_SCOPE_KEY,
          {
            propertyKey,
            scope,
          },
          target,
          propertyKey
        );
      }
    }
  };
}
