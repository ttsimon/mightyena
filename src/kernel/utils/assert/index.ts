import { Exception } from '../../exception/index';

export class Assert {
  /**
   * 不为空断言
   */
  static notNull(obj: any, message: string, code?: number) {
    if (obj === null || obj === void 0) {
      throw new Exception(message, code);
    }
  }
  /**
   * 空字符串断言
   */
  static notEmpty(obj: string, message: string, code?: number) {
    if (!obj || '' === obj.trim()) {
      throw new Exception(message, code);
    }
  }
  /**
   * 布尔断言
   */
  static isTrue(expression: boolean, message: string, code?: number) {
    if (!expression) {
      throw new Exception(message, code);
    }
  }

  /**
   * 对象不为空断言
   */
  static notEmptyObject(obj: object, message: string, code?: number) {
    this.notNull(obj, message, code);
    if (Object.keys(obj).length === 0) {
      throw new Exception(message, code);
    }
  }

  /**
   * 数组不为空断言
   */
  static notEmptyArray(obj: any[], message: string, code?: number) {
    this.notNull(obj, message, code);
    if (obj.length === 0) {
      throw new Exception(message, code);
    }
  }
}
