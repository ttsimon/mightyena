import { ColumnOptions } from 'typeorm';

export interface IQuery {
  [key: string]: any;
}

export interface IDto {
  [key: string]: any;
}

export interface IEntityClass<T extends IEntity> {
  new (...args: any[]): T;
}

export interface IEntity {
  id: string | number;
  [key: string]: any;
}

/**
 * Export装饰器参数
 */
export type IExportOptions = {
  // Controller前缀
  prefix: string;
  // 数据实体
  entity: IEntityClass<IEntity>;
  // 是否开启分页
  page?: boolean;
  // 是否开启新增
  create?: boolean;
  // 是否开启更新
  update?: boolean;
  // 是否开启删除
  remove?: boolean;
  // 是否开启单条数据查询
  single?: boolean;
};

/**
 * DateFormat装饰器参数
 */
export type IDateFormatOptions = {
  // 时间转换格式
  format?: string;
  // 调用的内部装饰器 默认@Column
  decorator?: (...args: any[]) => PropertyDecorator;
  // typeorm装饰器配置
  options?: ColumnOptions;
};

/**
 * Public装饰器参数
 */
export type IQueryOptions = {
  // 当前字段是否支持等于查询
  eq?: boolean;
  // 当前字段是否支持模糊查询
  like?: boolean;
  // 当前字段是否支持区间查询
  bet?: boolean;
  // 当前字段是否支持小于查询
  lt?: boolean;
  // 当前字段是否支持大于查询
  gt?: boolean;
  // 当前字段是否支持小于等于查询
  lte?: boolean;
  // 当前字段是否支持大于等于查询
  gte?: boolean;
};
