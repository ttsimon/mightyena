import { Export } from '../kernel';
import UserEntity from '../entities/user.entity';

@Export({
  prefix: '/api',
  entity: UserEntity,
  create: true,
  remove: true,
  update: true,
  single: true,
})
export class ApiController {}
