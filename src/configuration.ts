import {
  App,
  Configuration,
  ILifeCycle,
  ILogger,
  Inject,
  Logger,
  MidwayWebRouterService,
} from '@midwayjs/core';
import { Application } from 'egg';
import { join } from 'path';
import * as egg from '@midwayjs/web';
import * as kernel from './kernel';
import * as orm from '@midwayjs/typeorm';

@Configuration({
  imports: [egg, orm, kernel],
  importConfigs: [join(__dirname, './config/')],
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application;

  @Logger('coreLogger')
  logger: ILogger;

  @Inject()
  webRouterService: MidwayWebRouterService;

  async onReady() {}
}
