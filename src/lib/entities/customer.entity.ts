import { Base } from 'lib/entities/base.entity';

import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

registerEnumType(Role, {
  name: 'Role',
});

@ObjectType()
export class Customer extends Base {
  @Field(() => String)
  email: string;

  @Field(() => Role)
  role: Role;
}
