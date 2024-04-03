import { AbstractValidationPipe } from '@midwayjs/validate';
import {
  listPropertyDataFromClass,
  getPropertyDataFromClass,
  Pipe,
  TransformOptions,
  getClassExtendedMetadata,
  getClassMetadata,
  WEB_ROUTER_KEY,
} from '@midwayjs/core';
import { BaseController } from '../base';
import { EXPORT_VALID_SCOPE_KEY } from '../constant';
import { RULES_KEY } from '@midwayjs/validate/dist/constants';
import * as Joi from 'joi';

@Pipe()
export class ValidateScopePipe extends AbstractValidationPipe {
  /**
   * 重写此方法 增加中文翻译
   */
  validateWithSchema(
    value: any,
    options: TransformOptions,
    schema: Joi.AnySchema
  ) {
    const validateOptions = this.parseValidationOptions(options);
    const result = this.validateService.validateWithSchema(schema, value, {
      ...validateOptions,
      locale: 'zh_CN',
    });
    if (result && result.value !== undefined) {
      return result.value;
    }
    return value;
  }
  transform(value: unknown, transformOptions: TransformOptions): unknown {
    // 改写transformOptions 设置@Body()修饰的参数类型
    if (transformOptions.target instanceof BaseController) {
      transformOptions.metaType.name = transformOptions.target.entity.name;
      transformOptions.metaType.originDesign = transformOptions.target.entity;
      transformOptions.metaType.isBaseType = false;
    }
    // 获取当前类所有的接口配置
    const targetRequestMappingList = getClassMetadata(
      WEB_ROUTER_KEY,
      transformOptions.target
    );
    // 允许valid的请求方式
    const validRequestMethod = ['post', 'put', 'patch', 'delete'];
    // 根据方法名和请求方式判断是否需要验证
    const needValid = targetRequestMappingList.some(
      it =>
        it.method === transformOptions.methodName &&
        validRequestMethod.includes(it.requestMethod)
    );
    // 当需要验证并且value类型为object 执行验证
    if (needValid && typeof value === 'object') {
      // 根据请求调用的方法获取当前作用域
      const targetMethodParamScope = getPropertyDataFromClass(
        EXPORT_VALID_SCOPE_KEY,
        transformOptions.target,
        transformOptions.methodName
      );
      // 获取所有当前实体上的设置了作用域的参数
      const entityPropertyScopes = listPropertyDataFromClass(
        EXPORT_VALID_SCOPE_KEY,
        transformOptions.metaType.originDesign
      );
      // 当前作用域下要排除的字段
      const excludeProperties = [];
      if (targetMethodParamScope && targetMethodParamScope.one) {
        // 当前请求的Scope
        const scope = targetMethodParamScope.one.scope;
        if (entityPropertyScopes && entityPropertyScopes.length) {
          entityPropertyScopes.forEach(it => {
            // 只有一个存在代表只有一个Scope作用域 需要判断与当前作用域是否一致 不一致排除
            if (it.length <= 1) {
              const isCurrentScope = it.some(v => v.scope === scope);
              if (!isCurrentScope) {
                excludeProperties.push(it[0].propertyKey);
              }
            }
          });
        }
      }
      // 获取实体上字段的校验规则
      const rules = {
        ...getClassExtendedMetadata(
          RULES_KEY,
          transformOptions.metaType.originDesign
        ),
      };
      // 存在需要排除的字段 从rules中删除
      if (excludeProperties.length) {
        excludeProperties.forEach(it => {
          delete rules[it];
        });
      }
      // 校验
      const schema = Joi.object(rules);
      return this.validateWithSchema(value, transformOptions, schema);
    }
    return value;
  }
}
