import { MidwayConfig, MidwayAppInfo } from '@midwayjs/core';

export default (appInfo: MidwayAppInfo) => {
  return {
    // use for cookie sign key, should change to your own and keep security
    keys: appInfo.name + '_1684490426839_902',
    egg: {
      port: 7001,
    },
    typeorm: {
      dataSource: {
        default: {
          type: 'mysql',
          host: '',
          port: 3306,
          username: '',
          password: '',
          database: '',
          synchronize: false, // 如果第一次使用，不存在表，有同步的需求可以写 true，注意会丢数据
          logging: true,
          // 或者扫描形式
          entities: ['entities/*.entity{.ts,.js}'],
          migrations: ['migration/mysql/*.ts'],
          cli: {
            // 数据迁移工具使用的
            entitiesDir: 'entities',
            migrationsDir: 'migration/mysql',
          },
        },
      },
    },
    cors: {
      origin: '*',
    },
  } as MidwayConfig;
};
