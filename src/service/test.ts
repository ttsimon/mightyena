import { Context } from '@midwayjs/web';
import { Inject, Provide } from '@midwayjs/core';

@Provide()
export class Test {
  @Inject()
  ctx: Context;

  list() {
    console.log(this);
  }
}
