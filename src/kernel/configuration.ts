import {
  App,
  Configuration,
  getClassMetadata,
  IMidwayContainer,
  ILifeCycle,
  ILogger,
  Inject,
  listModule,
  Logger,
  MidwayWebRouterService,
  WEB_ROUTER_KEY,
  MidwayDecoratorService,
  WEB_ROUTER_PARAM_KEY,
} from '@midwayjs/core';
import { Application } from 'egg';
import * as DefaultConfig from './config/config.default';
import * as validate from '@midwayjs/validate';
import { BaseController } from './base';
import { ResponseMiddleware } from './middleware';
import { ExceptionFilter } from './filter';
import { IEntity, IEntityClass, IExportOptions } from './types';
import { EXPORT_MODEL_KEY } from './constant';
import { ValidateScopePipe } from './pipe';

@Configuration({
  imports: [validate],
  namespace: 'kernel',
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
})
export class MyConfiguration implements ILifeCycle {
  @App()
  app: Application;

  @Logger('routeLogger')
  routeLogger: ILogger;

  @Inject()
  webRouterService: MidwayWebRouterService;

  @Inject()
  decoratorService: MidwayDecoratorService;

  container: IMidwayContainer;

  async onReady(container: IMidwayContainer) {
    this.app.useMiddleware(ResponseMiddleware);
    this.app.useFilter(ExceptionFilter);
    this.container = container;
    this.registerController();
    await this.onLogRoute();
    // 注册ValidScopePipe校验管道
    this.decoratorService.registerParameterPipes(WEB_ROUTER_PARAM_KEY, [
      ValidateScopePipe,
    ]);
  }

  /**
   * 注册控制器
   */
  registerController() {
    // 获取所有添加了@Export的类
    const modules = listModule(EXPORT_MODEL_KEY);
    for (const module of modules) {
      const targetMetadata = getClassMetadata(EXPORT_MODEL_KEY, module);
      // 添加控制器主类
      this.webRouterService.addController(module, {
        prefix: targetMetadata.prefix,
      });
      // 注册路由
      this.registerRoutes(module, targetMetadata);
    }
  }

  /**
   * 注册路由
   * @param target 目标类
   * @param targetMetadata 目标类元数据
   */
  registerRoutes(
    target: IEntityClass<IEntity>,
    targetMetadata: IExportOptions
  ) {
    // 实例化基础控制器
    const controller: BaseController = this.container.get(BaseController);
    // 获取BaseController类中WEB_ROUTER_KEY的方法
    const baseMethodMetadata = getClassMetadata(WEB_ROUTER_KEY, BaseController);
    // 获取target类中WEB_ROUTER_KEY的方法
    const targetMethodMetadata = getClassMetadata(WEB_ROUTER_KEY, target);
    // 去除重复的路由 重复的路由使用用户自定义的
    const baseRoutes = baseMethodMetadata.filter(
      it =>
        !targetMethodMetadata ||
        !targetMethodMetadata.some(
          v => v.path === it.path && v.requestMethod === it.requestMethod
        )
    );
    controller.setEntity(targetMetadata.entity);
    this.registerRoute(baseRoutes, controller, targetMetadata, target);
  }

  /**
   * 注册路由
   * @param baseRoutes BaseController中requestMapping标注的方法集合
   * @param controller BaseController类实例
   * @param targetMetadata 目标类元数据
   * @param target 目标类
   */
  registerRoute(
    baseRoutes,
    controller: BaseController,
    targetMetadata: IExportOptions,
    target: IEntityClass<IEntity>
  ) {
    const routes = [];
    const methodMap = {
      page: 'query',
      create: 'create',
      update: 'update',
      remove: 'delete',
      single: 'single',
    };
    // 判断是否开启对应功能
    for (const key in methodMap) {
      if (targetMetadata[key]) {
        const route = baseRoutes.find(it => it.method === methodMap[key]);
        if (route) {
          routes.push(route);
        }
      }
    }
    // 注册路由
    routes.forEach(item => {
      // 调用webRouterService创建Router实例
      this.webRouterService.addRouter(
        controller[item.method].bind(controller),
        {
          prefix: targetMetadata.prefix,
          requestMethod: item.requestMethod,
          url: item.path,
          controllerClz: target,
        }
      );
    });
  }

  /**
   * 输出接口定义
   */
  async onLogRoute() {
    // 获取所有路由
    const routes = await this.webRouterService.getFlattenRouterTable();
    // 转换输出格式
    const RouteList = routes.map(
      item =>
        `[${
          item.fullUrl
        }] exported with method -> [${item.requestMethod.toUpperCase()}]`
    );
    // 打印输出
    RouteList.forEach(item => this.routeLogger.error(item));
  }
}
