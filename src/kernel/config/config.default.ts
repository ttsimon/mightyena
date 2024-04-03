import { MidwayConfig } from '@midwayjs/core';

export default () => {
  return {
    midwayLogger: {
      clients: {
        // 自定义routes日志格式
        routeLogger: {
          fileLogName: 'kernel.log',
          level: 'error',
          format: info => {
            return `\x1B[32m${info.timestamp} INFO\x1B[0m \x1B[34m${info.pid}\x1B[0m \x1B[33mRoute ${info.message}\x1B[0m`;
          },
        },
      },
    },
    validate: {
      validationOptions: {
        stripUnknown: true,
      },
    },
  } as MidwayConfig;
};
