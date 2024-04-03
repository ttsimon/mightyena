import {
  Body,
  Del,
  Get,
  getClassMetadata,
  INJECT_CUSTOM_PROPERTY,
  Param,
  Patch,
  Post,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/core';
import { IPage } from '../entities';
import { InjectDataSource } from '@midwayjs/typeorm';
import {
  DataSource,
  EntityTarget,
  Equal,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  FindOptionsWhere,
  Between,
} from 'typeorm';
import { IEntity, IEntityClass } from '../../types';
import { Ctx, ValidScope } from '../../decorators';
import { Context } from '@midwayjs/web';
import * as Qs from 'qs';
import { Assert } from '../../utils';

@Scope(ScopeEnum.Request)
@Provide()
export class BaseController<T extends IEntity = IEntity> {
  @InjectDataSource()
  dataSource: DataSource;

  // 实体
  entity: IEntityClass<T>;

  /**
   * 分页查询
   * @param ctx 请求上下文
   */
  @Get()
  async query(@Ctx() ctx: Context) {
    // 转换数据
    const query = Qs.parse(ctx.request.url.split('?')[1] ?? '') as any;
    // 分页参数
    const current = query.current ? (query.current - 1) * query.size : 1;
    const size = query.size ?? 10;
    // 删除其他key
    this.deleteOtherKeys(query, ['current', 'size']);
    // 获取字段的查询员数据
    const queryKeyMetadata = this.getQueryPropertyMetadataFormEntity();
    // 构造查询条件
    const where = this.structureQueryWhere(queryKeyMetadata, query);
    const [result, count] = await this.repository.findAndCount({
      skip: (current - 1) * size,
      take: size,
      where: where,
    });
    return {
      list: result,
      total: count,
      pages: Math.ceil(count / size),
    };
  }

  /**
   * 根据id查询数据
   * @param id
   */
  @Get('/:id')
  async single(@Param('id') id: number) {
    Assert.notNull(id, '缺少必填参数id');
    const result = await this.repository.findOneBy({
      id,
    } as T);
    Assert.notNull(result, '数据不存在！');
    return result;
  }

  /**
   * 根据id删除数据
   * @param id
   */
  @Del('/:id')
  async delete(@Param('id') id: number | string) {
    Assert.notNull(id, '缺少必填参数id');
    const data = await this.repository.findOneBy({ id } as T);
    Assert.notEmptyObject(data, '找不到要删除的数据！请检查id是否正确');
    const result = await this.repository.softDelete({ id } as T);
    return result.affected > 0;
  }

  /**
   * 根据id更新数据
   * @param id
   * @param updateDto
   */
  @Patch('/:id')
  async update(
    @Param('id') id: number | string,
    @ValidScope('update') @Body() updateDto: T
  ) {
    Assert.notNull(id, '缺少必填参数id');
    const data = await this.repository.findOneBy({ id } as T);
    Assert.notEmptyObject(data, '找不到要更新的数据！请检查id是否正确');
    // 去除无关字段
    this.deleteOtherKeys(updateDto);
    // 更新接口存在id 去除
    if (updateDto.id) {
      delete updateDto.id;
    }
    const result = await this.repository.update({ id } as T, updateDto);
    return result.affected > 0;
  }

  /**
   * 新增数据
   * @param createDto
   */
  @Post()
  async create(@ValidScope('create') @Body() createDto: T) {
    // 去除无关字段
    this.deleteOtherKeys(createDto);
    // 新增接口存在id 去除
    if (createDto.id) {
      delete createDto.id;
    }
    return await this.repository.save(createDto);
  }

  /**
   * 从存储库中获取对应实体的的管理器
   * @protected
   */
  protected get repository() {
    return this.dataSource.getRepository(this.entity);
  }

  /**
   * 设置实体
   * @param entity 数据库实体
   */
  setEntity(entity: IEntityClass<T>) {
    this.entity = entity;
  }

  /**
   * 获取实体的字KEYS
   * @protected
   */
  protected getEntityKeys() {
    const entityMetadata = this.dataSource.getMetadata(
      this.entity as EntityTarget<IEntityClass<T>>
    );
    // 去除实体上所有的key
    const allColumnKeys = entityMetadata.columns.map(
      it => it.propertyAliasName
    );
    // 新增时间key
    const createDateColumnKey =
      entityMetadata.createDateColumn.propertyAliasName;
    // 更新时间key
    const updateDateColumnKey =
      entityMetadata.updateDateColumn.propertyAliasName;
    // 删除key
    const deleteDateColumnKey =
      entityMetadata.deleteDateColumn.propertyAliasName;
    // 主键key
    const primaryColumnKeys = entityMetadata.primaryColumns.map(
      it => it.propertyAliasName
    );
    // 需要过滤的key
    const filterKeys = [
      createDateColumnKey,
      updateDateColumnKey,
      deleteDateColumnKey,
      ...primaryColumnKeys,
    ];
    return allColumnKeys.filter(it => !filterKeys.includes(it));
  }

  /**
   * 在实体中删除无关key
   * @param target 数据库实体
   * @param whiteList 白名单
   * @protected
   */
  protected deleteOtherKeys(target: IEntity | IPage, whiteList: string[] = []) {
    // 去除无关字段
    const dtoKeys = [...this.getEntityKeys(), ...whiteList];
    for (const key in target) {
      if (!dtoKeys.includes(key)) {
        delete target[key];
      }
    }
  }

  /**
   * 获取实体字段的查询条件
   * @protected
   */
  protected getQueryPropertyMetadataFormEntity() {
    // 获取实体字段上@Public装饰器配置
    const propertyMetadataMap = getClassMetadata(
      INJECT_CUSTOM_PROPERTY,
      this.entity
    );
    if (!propertyMetadataMap || Object.keys(propertyMetadataMap).length === 0)
      return null;
    const result = {};
    for (const key in propertyMetadataMap) {
      result[key] = propertyMetadataMap[key].metadata;
    }
    return result;
  }

  /**
   * 根据字段配置的查询模式和数据生成查询条件
   * @param queryKeyMetadata 元数据
   * @param query 查询数据
   * @protected
   */
  protected structureQueryWhere(
    queryKeyMetadata: any,
    query: IEntity
  ): FindOptionsWhere<IEntity> {
    // 模式参数转换
    const opsMapper = {
      eq: (row, key) => Equal(row[key]),
      like: (row, key) => Like(`%${row[key]}%`),
      lt: (row, key) => LessThan(row[key]),
      gt: (row, key) => MoreThan(row[key]),
      lte: (row, key) => LessThanOrEqual(row[key]),
      gte: (row, key) => MoreThanOrEqual(row[key]),
      bet: (row, key) => {
        if (Array.isArray(row[key])) {
          return Between(row[key][0], row[key][1]);
        }
        const [form, to] = row[key].split(',');
        return Between(form, to);
      },
    };
    const where = {};
    for (const key in queryKeyMetadata) {
      if (query[key]) {
        for (const op in opsMapper) {
          if (op === queryKeyMetadata[key]) {
            where[key] = opsMapper[queryKeyMetadata[key]](query, key);
            break;
          }
        }
      }
    }
    return where;
  }
}
