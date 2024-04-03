import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IEntity, IQuery } from '../../types/index';
import { DateFormat } from '../../decorators/index';

/**
 * 基础实体类
 */
export class BasicsEntity implements IEntity {
  /**
   * 数据库主键
   */
  @PrimaryGeneratedColumn({ type: 'int', comment: '数据库主键，自增id' })
  id: number;

  /**
   * 创建时间
   */
  @DateFormat({
    decorator: CreateDateColumn,
    options: {
      name: 'create_time',
      comment: '创建时间',
    },
  })
  createTime: Date;

  /**
   * 更新时间
   */
  @DateFormat({
    decorator: UpdateDateColumn,
    options: {
      name: 'update_time',
      comment: '更新时间',
    },
  })
  updateTime: Date;

  /**
   * 软删除字段
   */
  @DeleteDateColumn({
    name: 'delete_time',
    select: false,
    insert: false,
    update: false,
    comment: '软删除字段',
  })
  deleteTime: Date;
}

export class IPage implements IQuery {
  current: number;
  size: number;
}
