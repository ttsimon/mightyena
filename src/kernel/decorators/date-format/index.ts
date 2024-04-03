import { Column } from 'typeorm';
import * as dayjs from 'dayjs';
import { IDateFormatOptions } from '../../types/index';

/**
 * 日期格式转换
 * @param format 转换的格式
 * @param decorator 调用typeorm的装饰器 默认Column
 * @param options typeorm的Column配置
 * @constructor
 */
export function DateFormat({
  format = 'YYYY-MM-DD hh:mm:ss',
  decorator = Column,
  options = {},
}: IDateFormatOptions): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    if (!options.transformer) {
      options.transformer = {
        to: (value: any) => value,
        from: (value: any) => dayjs(value).format(format),
      };
    }
    return decorator({
      ...options,
    })(target, propertyKey);
  };
}
