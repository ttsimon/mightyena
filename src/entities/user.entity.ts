import { Column, Entity } from 'typeorm';
import { BasicsEntity, Public, ValidScope } from '../kernel';
import { Rule, RuleType } from '@midwayjs/validate';

@Entity('user')
export default class UserEntity extends BasicsEntity {
  @Column({
    nullable: true,
  })
  @Public({ bet: true })
  @Rule(RuleType.string().required())
  @ValidScope('create')
  @ValidScope('update')
  name: string;

  @Column({
    nullable: true,
  })
  @Public({ gt: true })
  @Rule(RuleType.number().required())
  @ValidScope('update')
  age: number;

  @Column({
    default: '1',
  })
  gender: string;
}
