import { Export } from '../kernel';
import UserEntity from '../entities/user.entity';

@Export({
  prefix: '/user',
  entity: UserEntity,
  single: true,
  remove: true,
  update: true,
  create: true,
})
export class User {}
