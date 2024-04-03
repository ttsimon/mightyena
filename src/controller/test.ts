import { Body, Controller, Get, Inject, Post, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/web';
import { Test } from '../service/test';
import { Ctx, ValidScope } from '../kernel';
import UserEntity from '../entities/user.entity';

@Controller('/test')
export class ApiController {
  @Inject()
  ctx: Context;
  @Inject()
  testService: Test;
  @Get()
  async list(@Query('id') id: string, @Ctx() ctx) {
    console.log(ctx);
    return id;
  }

  @Post()
  async create(@ValidScope('create') @Body() data: UserEntity) {}
}
