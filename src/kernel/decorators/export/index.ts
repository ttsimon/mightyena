// 提供一个唯一 key
import { saveClassMetadata, saveModule } from '@midwayjs/core';
import { IExportOptions } from '../../types/index';
import { EXPORT_MODEL_KEY } from '../../constant/index';

/**
 * 导出控制器装饰器
 * @param prefix 导出的路径
 * @param entity 实体
 * @param page 是否开启分页
 * @param create 是否开启新增
 * @param update 是否开启更新
 * @param remove 是否开启删除
 * @param single 是否开启单条数据查询
 * @constructor
 */
export function Export({
  prefix,
  entity,
  page = true,
  create = false,
  update = false,
  remove = false,
  single = false,
}: IExportOptions): ClassDecorator {
  return (target: any) => {
    saveModule(EXPORT_MODEL_KEY, target);
    saveClassMetadata(
      EXPORT_MODEL_KEY,
      { prefix, entity, page, create, update, remove, single },
      target
    );
  };
}
