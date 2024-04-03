import {
  MidwayDecoratorService,
  PipeUnionTransform,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/core';

@Provide()
@Scope(ScopeEnum.Singleton)
export class DecoratorService extends MidwayDecoratorService {
  registerParameterPipes(decoratorKey: string, pipes: PipeUnionTransform[]) {
    // if (!super.parameterDecoratorPipes.has(decoratorKey)) {
    //   this.parameterDecoratorPipes.set(decoratorKey, []);
    // }
    // this.parameterDecoratorPipes.set(
    //   decoratorKey,
    //   this.parameterDecoratorPipes.get(decoratorKey).concat(pipes)
    // );
  }
}
